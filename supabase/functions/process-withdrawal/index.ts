
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

// Enhanced validation functions
function validateAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         amount >= 10000 && // Minimum KES 100
         amount <= 500000000 && // Maximum KES 5M
         Number.isInteger(amount);
}

function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(?:\+254|254|0)[17]\d{8}$/;
  return typeof phone === 'string' && phoneRegex.test(phone.replace(/\s+/g, ''));
}

function validateBankAccount(accountNumber: string): boolean {
  // Basic bank account validation - adjust per Kenyan banks
  return typeof accountNumber === 'string' && 
         /^\d{6,20}$/.test(accountNumber);
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

    const body: WithdrawalRequest = await req.json()

    // Enhanced input validation
    if (!validateAmount(body.amount)) {
      throw new Error('Invalid amount. Minimum withdrawal is KES 100, maximum is KES 5,000,000')
    }

    if (!['mpesa', 'bank_transfer'].includes(body.payment_method)) {
      throw new Error('Invalid payment method. Must be mpesa or bank_transfer')
    }

    // Validate account details based on payment method
    if (body.payment_method === 'mpesa') {
      if (!body.account_details.phone_number || !validatePhoneNumber(body.account_details.phone_number)) {
        throw new Error('Valid phone number is required for M-Pesa withdrawals')
      }
    } else if (body.payment_method === 'bank_transfer') {
      if (!body.account_details.bank_name || body.account_details.bank_name.length < 2) {
        throw new Error('Bank name is required for bank transfers')
      }
      if (!body.account_details.account_number || !validateBankAccount(body.account_details.account_number)) {
        throw new Error('Valid bank account number is required')
      }
      if (!body.account_details.account_name || body.account_details.account_name.length < 2) {
        throw new Error('Account holder name is required')
      }
    }

    // Check for duplicate withdrawal requests in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentRequests } = await supabaseClient
      .from('withdrawal_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('amount', body.amount)
      .gte('requested_at', fiveMinutesAgo)

    if (recentRequests && recentRequests.length > 0) {
      throw new Error('Duplicate withdrawal request detected. Please wait before trying again.')
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabaseClient
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      console.error('Wallet not found for user:', user.id)
      throw new Error('Wallet not found')
    }

    // Check if user has sufficient balance
    if (wallet.balance < body.amount) {
      throw new Error('Insufficient balance')
    }

    // Sanitize account details
    const sanitizedAccountDetails = {
      ...body.account_details,
      phone_number: body.account_details.phone_number ? sanitizeInput(body.account_details.phone_number) : undefined,
      bank_name: body.account_details.bank_name ? sanitizeInput(body.account_details.bank_name) : undefined,
      account_number: body.account_details.account_number ? sanitizeInput(body.account_details.account_number) : undefined,
      account_name: body.account_details.account_name ? sanitizeInput(body.account_details.account_name) : undefined,
    }

    // Create withdrawal request
    const { data: withdrawalRequest, error: requestError } = await supabaseClient
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        amount: body.amount,
        payment_method: body.payment_method,
        account_details: sanitizedAccountDetails,
        status: 'pending'
      })
      .select()
      .single()

    if (requestError) {
      console.error('Failed to create withdrawal request:', requestError)
      throw new Error('Failed to create withdrawal request')
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

    // Log security event
    await supabaseClient.rpc('log_security_event', {
      p_action: 'WITHDRAWAL_REQUESTED',
      p_resource_type: 'withdrawal_request',
      p_resource_id: withdrawalRequest.id,
      p_details: {
        amount: body.amount,
        payment_method: body.payment_method,
        wallet_balance: wallet.balance
      }
    }).catch(err => console.error('Failed to log security event:', err));

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
    
    // Don't expose internal errors to client
    const clientMessage = error.message.includes('Invalid') || 
                         error.message.includes('required') || 
                         error.message.includes('Insufficient') ||
                         error.message.includes('Duplicate')
      ? error.message 
      : 'Withdrawal service temporarily unavailable';

    return new Response(
      JSON.stringify({ error: clientMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
