
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number
  phoneNumber: string
  description: string
  callback_url: string
  transaction_id: string
  payment_type: 'subscription' | 'rental_payment'
  plan_id?: string
  booking_id?: string
  account_reference: string
}

// Input validation functions
function validateAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && amount <= 100000000 && Number.isInteger(amount);
}

function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(?:\+254|254|0)[17]\d{8}$/;
  return typeof phone === 'string' && phoneRegex.test(phone.replace(/\s+/g, ''));
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, '').trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const body: PaymentRequest = await req.json()

    // Enhanced input validation
    if (!validateAmount(body.amount)) {
      throw new Error('Invalid amount. Must be a positive integer between 1 and 100,000,000 cents')
    }

    if (!validatePhoneNumber(body.phoneNumber)) {
      throw new Error('Invalid phone number format. Must be a valid Kenyan phone number')
    }

    if (!body.description || body.description.length > 200) {
      throw new Error('Description is required and must be less than 200 characters')
    }

    if (!['subscription', 'rental_payment'].includes(body.payment_type)) {
      throw new Error('Invalid payment type')
    }

    // Sanitize inputs
    const sanitizedDescription = sanitizeInput(body.description);
    const sanitizedAccountRef = sanitizeInput(body.account_reference);

    // Get M-Pesa credentials
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    const environment = Deno.env.get('MPESA_ENVIRONMENT') || 'sandbox'
    const shortcode = Deno.env.get('MPESA_SHORTCODE')
    const passkey = Deno.env.get('MPESA_PASSKEY')

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      console.error('M-Pesa credentials not configured')
      throw new Error('Payment service configuration error')
    }

    const baseUrl = environment === 'sandbox' 
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke'

    // Generate access token with timeout
    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    const tokenController = new AbortController();
    setTimeout(() => tokenController.abort(), 10000); // 10 second timeout

    const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      signal: tokenController.signal
    })

    if (!tokenResponse.ok) {
      console.error('Failed to get M-Pesa access token:', tokenResponse.status)
      throw new Error('Payment service temporarily unavailable')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
    const password = btoa(`${shortcode}${passkey}${timestamp}`)

    // Format phone number
    const formattedPhone = body.phoneNumber.startsWith('254') 
      ? body.phoneNumber 
      : `254${body.phoneNumber.replace(/^0/, '')}`

    // Initiate STK push with timeout
    const stkData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: body.amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
      AccountReference: sanitizedAccountRef,
      TransactionDesc: sanitizedDescription
    }

    const stkController = new AbortController();
    setTimeout(() => stkController.abort(), 15000); // 15 second timeout

    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkData),
      signal: stkController.signal
    })

    const stkResult = await stkResponse.json()

    if (stkResult.ResponseCode !== '0') {
      console.error('M-Pesa STK push failed:', stkResult)
      throw new Error(stkResult.ResponseDescription || 'Payment initiation failed')
    }

    // Create transaction record with M-Pesa specific fields
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: body.payment_type,
        amount: body.amount,
        currency: 'KES',
        status: 'pending',
        mpesa_checkout_request_id: stkResult.CheckoutRequestID,
        mpesa_merchant_request_id: stkResult.MerchantRequestID,
        description: sanitizedDescription,
        booking_id: body.booking_id || null
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError)
      throw new Error('Failed to record transaction')
    }

    // Log security event
    await supabaseClient.rpc('log_security_event', {
      p_action: 'PAYMENT_INITIATED',
      p_resource_type: 'transaction',
      p_resource_id: transaction.id,
      p_details: {
        payment_type: body.payment_type,
        amount: body.amount,
        phone_number: formattedPhone.slice(-4) // Only log last 4 digits
      }
    }).catch(err => console.error('Failed to log security event:', err));

    // If it's a subscription payment, create or update user subscription
    if (body.payment_type === 'subscription' && body.plan_id) {
      const { error: subscriptionError } = await supabaseClient
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          plan_id: body.plan_id,
          status: 'pending'
        })

      if (subscriptionError) {
        console.error('Failed to create subscription:', subscriptionError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment initiated successfully',
        checkout_request_id: stkResult.CheckoutRequestID,
        transaction_id: transaction.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating M-Pesa payment:', error)
    
    // Don't expose internal errors to client
    const clientMessage = error.message.includes('Invalid') || error.message.includes('required') 
      ? error.message 
      : 'Payment service temporarily unavailable';

    return new Response(
      JSON.stringify({ error: clientMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
