// Supabase Edge Function: delete-account
//
// Deploy this function, then the client can call:
//   supabase.functions.invoke('delete-account', { body: { userId } })
//
// You must set secrets for deployment:
//   SUPABASE_SERVICE_ROLE_KEY (never expose this in the client)
//
// Notes:
// - This function verifies the caller's JWT and only deletes the *caller*.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error:
            'Missing SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const authHeader = req.headers.get('Authorization')
    const jwt = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null

    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { userId: requestedUserId } = await req.json().catch(() => ({}))

    // Identify the caller using their JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: userError?.message ?? 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (requestedUserId && requestedUserId !== user.id) {
      return new Response(JSON.stringify({ error: 'Cannot delete a different user' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Admin client can delete Auth users
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
