const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.resolve(__dirname, '../.env');
try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1');
    }
  });
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLS() {
  console.log('Testing RLS policies with ANON key...\n');

  const tables = ['products', 'projects', 'companies'];

  for (const table of tables) {
    console.log(`Trying to SELECT * from '${table}'...`);
    const { data, error } = await supabase.from(table).select('*').limit(1);

    if (error) {
      console.error(`❌ Access DENIED or Error for '${table}':`, error.message);
      console.log('   (If this is "permission denied", you need to enable public SELECT policy)\n');
    } else {
      console.log(`✅ Access GRANTED for '${table}'. Found ${data.length} rows.\n`);
    }
  }
}

testRLS();
