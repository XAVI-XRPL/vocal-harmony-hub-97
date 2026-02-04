import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No valid auth token' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Create Supabase client with user's auth token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('User authenticated:', user.id);

    // Get stemId from query params
    const url = new URL(req.url);
    const stemId = url.searchParams.get('stemId');

    if (!stemId) {
      return new Response(
        JSON.stringify({ error: 'Missing stemId parameter' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching stem:', stemId);

    // RLS will automatically enforce subscription check
    // If the user doesn't have access, this query will return no results
    const { data: stem, error: stemError } = await supabase
      .from('stems')
      .select('id, audio_path, song_id')
      .eq('id', stemId)
      .maybeSingle();

    if (stemError) {
      console.error('Stem query error:', stemError.message);
      return new Response(
        JSON.stringify({ error: 'Database error' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!stem) {
      console.log('Stem not found or access denied for:', stemId);
      return new Response(
        JSON.stringify({ error: 'Stem not found or access denied. You may need a premium subscription.' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Access granted for stem:', stemId, 'audio_path:', stem.audio_path);

    // Return the audio URL - the path stored in the database
    return new Response(
      JSON.stringify({ 
        url: stem.audio_path,
        stemId: stem.id,
        songId: stem.song_id
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
