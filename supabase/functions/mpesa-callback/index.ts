
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting map to prevent callback abuse
const callbackCounts = new Map<string, { count: number, resetTime: number }>();
const MAX_CALLBACKS_PER_MINUTE = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = callbackCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    callbackCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  
  if (record.count >= MAX_CALLBACKS_PER_MINUTE) {
    return true;
  }
  
  record.count++;
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clientIP = req.headers.get('cf-connecting-ip') || 
                   req.headers.get('x-forwarded-for') || 
                   'unknown';

  // Rate limiting
  if (isRateLimited(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response('Rate limit exceeded', { status: 429, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(body, null, 2))

    const stkCallback = body.Body?.stkCallback
    if (!stkCallback) {
      throw new Error('Invalid callback format')
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode

    if (!checkoutRequestId) {
      throw new Error('Missing CheckoutRequestID')
    }

    // Additional validation
    if (typeof resultCode !== 'number' && typeof resultCode !== 'string') {
      throw new Error('Invalid result code format')
    }

    // Find transaction by checkout request ID
    const { data: transaction, error: findError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('mpesa_checkout_request_id', checkoutRequestId)
      .single()

    if (findError || !transaction) {
      console.error(`Transaction not found for checkout request ID: ${checkoutRequestId}`)
      throw new Error(`Transaction not found for checkout request ID: ${checkoutRequestId}`)
    }

    // Prevent duplicate processing
    if (transaction.status !== 'pending') {
      console.log(`Transaction ${transaction.id} already processed with status: ${transaction.status}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    let newStatus = 'pending'
    let mpesaReceiptNumber = null

    if (resultCode === 0 || resultCode === '0') {
      // Payment successful
      newStatus = 'completed'
      
      // Extract M-Pesa receipt number
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || []
      const receiptItem = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')
      mpesaReceiptNumber = receiptItem?.Value || null

      // Additional validation for successful payments
      const amountItem = callbackMetadata.find((item: any) => item.Name === 'Amount')
      const transactionAmount = amountItem?.Value;
      
      if (transactionAmount && Math.abs(Number(transactionAmount) - (transaction.amount / 100)) > 0.01) {
        console.error(`Amount mismatch: Expected ${transaction.amount/100}, got ${transactionAmount}`);
        newStatus = 'failed';
      }
    } else {
      // Payment failed or cancelled
      newStatus = 'failed'
    }

    // Update transaction status
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: newStatus,
        mpesa_receipt_number: mpesaReceiptNumber,
        payment_method: 'mpesa',
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    if (updateError) {
      console.error('Failed to update transaction:', updateError)
      throw new Error(`Failed to update transaction: ${updateError.message}`)
    }

    // Log security event
    await supabaseClient.rpc('log_security_event', {
      p_action: newStatus === 'completed' ? 'PAYMENT_COMPLETED' : 'PAYMENT_FAILED',
      p_resource_type: 'transaction',
      p_resource_id: transaction.id,
      p_details: {
        checkout_request_id: checkoutRequestId,
        result_code: resultCode,
        receipt_number: mpesaReceiptNumber,
        amount: transaction.amount
      }
    }).catch(err => console.error('Failed to log security event:', err));

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
    console.error('M-Pesa callback error:', error)
    return new Response(
      JSON.stringify({ error: 'Callback processing failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
