import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function wipeLeads() {
  console.log('🗑️ Wiping all leads from Supabase...');
  const { error } = await supabase.from('leads').delete().neq('id', '');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('✅ All leads deleted from Supabase');
  }
}

wipeLeads();
