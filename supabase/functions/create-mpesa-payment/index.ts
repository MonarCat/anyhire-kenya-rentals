
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
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const body: PaymentRequest = await req.json()

    // Get M-Pesa credentials
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    const environment = Deno.env.get('MPESA_ENVIRONMENT') || 'sandbox'
    const shortcode = Deno.env.get('MPESA_SHORTCODE')
    const passkey = Deno.env.get('MPESA_PASSKEY')

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      throw new Error('M-Pesa credentials not configured')
    }

    const baseUrl = environment === 'sandbox' 
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke'

    // Generate access token
    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get M-Pesa access token')
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

    // Initiate STK push
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
      AccountReference: body.account_reference,
      TransactionDesc: body.description
    }

    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkData)
    })

    const stkResult = await stkResponse.json()

    if (stkResult.ResponseCode !== '0') {
      throw new Error(stkResult.ResponseDescription || 'Failed to initiate M-Pesa payment')
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
        description: body.description,
        booking_id: body.booking_id || null
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error(`Failed to create transaction: ${transactionError.message}`)
    }

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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
