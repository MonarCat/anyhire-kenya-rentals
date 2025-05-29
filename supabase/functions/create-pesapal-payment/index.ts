
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number
  currency: string
  description: string
  callback_url: string
  notification_id: string
  billing_address: {
    email_address: string
    phone_number: string
    country_code: string
    first_name: string
    last_name: string
  }
  payment_type: 'subscription' | 'rental_payment'
  plan_id?: string
  booking_id?: string
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

    // Get Pesapal credentials
    const pesapalConsumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY')
    const pesapalConsumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET')
    const pesapalEnvironment = Deno.env.get('PESAPAL_ENVIRONMENT') || 'sandbox'

    if (!pesapalConsumerKey || !pesapalConsumerSecret) {
      throw new Error('Pesapal credentials not configured')
    }

    const baseUrl = pesapalEnvironment === 'sandbox' 
      ? 'https://cybqa.pesapal.com/pesapalv3'
      : 'https://pay.pesapal.com/v3'

    // Get access token
    const authResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        consumer_key: pesapalConsumerKey,
        consumer_secret: pesapalConsumerSecret
      })
    })

    const authData = await authResponse.json()
    const accessToken = authData.token

    // Prepare order data
    const orderData = {
      id: crypto.randomUUID(),
      currency: body.currency,
      amount: body.amount / 100, // Convert from cents to KES
      description: body.description,
      callback_url: body.callback_url,
      notification_id: body.notification_id,
      billing_address: body.billing_address
    }

    // Submit order to Pesapal
    const orderResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    })

    const orderResult = await orderResponse.json()

    if (!orderResponse.ok) {
      throw new Error(`Pesapal order creation failed: ${orderResult.error_message || 'Unknown error'}`)
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: body.payment_type,
        amount: body.amount,
        currency: body.currency,
        status: 'pending',
        pesapal_tracking_id: orderResult.order_tracking_id,
        pesapal_order_id: orderData.id,
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
        redirect_url: orderResult.redirect_url,
        order_tracking_id: orderResult.order_tracking_id,
        transaction_id: transaction.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating Pesapal payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
