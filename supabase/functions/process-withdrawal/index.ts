
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawalRequest {
  amount: number
  payment_method: string
  account_details: {
    phone_number?: string
    bank_name?: string
    account_number?: string
    account_name?: string
  }
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

    const body: WithdrawalRequest = await req.json()

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      throw new Error('Wallet not found')
    }

    // Check if user has sufficient balance
    if (wallet.balance < body.amount) {
      throw new Error('Insufficient balance')
    }

    // Minimum withdrawal amount (KES 100)
    if (body.amount < 10000) { // 10000 cents = KES 100
      throw new Error('Minimum withdrawal amount is KES 100')
    }

    // Create withdrawal request
    const { data: withdrawalRequest, error: requestError } = await supabaseClient
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        amount: body.amount,
        payment_method: body.payment_method,
        account_details: body.account_details,
        status: 'pending'
      })
      .select()
      .single()

    if (requestError) {
      throw new Error(`Failed to create withdrawal request: ${requestError.message}`)
    }

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'withdrawal',
        amount: body.amount,
        currency: 'KES',
        status: 'pending',
        description: `Withdrawal request - ${body.payment_method}`
      })

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        withdrawal_request_id: withdrawalRequest.id,
        message: 'Withdrawal request submitted successfully. It will be processed within 24 hours.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
