
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const body = await req.json()
    const orderTrackingId = body.OrderTrackingId

    if (!orderTrackingId) {
      throw new Error('Missing OrderTrackingId')
    }

    // Get Pesapal credentials
    const pesapalConsumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY')
    const pesapalConsumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET')
    const pesapalEnvironment = Deno.env.get('PESAPAL_ENVIRONMENT') || 'sandbox'

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

    // Get transaction status from Pesapal
    const statusResponse = await fetch(
      `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    const statusData = await statusResponse.json()

    // Update transaction in database
    const { data: transaction, error: findError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('pesapal_tracking_id', orderTrackingId)
      .single()

    if (findError || !transaction) {
      throw new Error(`Transaction not found for tracking ID: ${orderTrackingId}`)
    }

    let newStatus = 'pending'
    if (statusData.payment_status_description === 'Completed') {
      newStatus = 'completed'
    } else if (statusData.payment_status_description === 'Failed') {
      newStatus = 'failed'
    } else if (statusData.payment_status_description === 'Cancelled') {
      newStatus = 'cancelled'
    }

    // Update transaction status
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: newStatus,
        payment_method: statusData.payment_method,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`)
    }

    // If payment completed, handle subscription or booking activation
    if (newStatus === 'completed') {
      if (transaction.transaction_type === 'subscription') {
        // Activate subscription
        const { error: subError } = await supabaseClient
          .from('user_subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', transaction.user_id)

        if (subError) {
          console.error('Failed to activate subscription:', subError)
        }
      } else if (transaction.transaction_type === 'rental_payment' && transaction.booking_id) {
        // Update booking status
        const { error: bookingError } = await supabaseClient
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            transaction_id: transaction.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.booking_id)

        if (bookingError) {
          console.error('Failed to update booking:', bookingError)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, status: newStatus }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Pesapal webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
