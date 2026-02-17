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
      process.env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes
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

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${supabaseUrl}`);
  
  // Try to query a public table or execute a simple command
  // Since we don't know if tables exist, we'll just try to auth.
  // Actually, we can try to fetch data from a non-existent table and check the error.
  // Or just check if auth service is reachable.
  
  try {
      const { data, error } = await supabase.from('test_connection').select('*').limit(1);
      
      if (error) {
          if (error.code === '42P01') { // undefined_table
               console.log('✅ Connection successful! (Database is reachable, table not found as expected)');
          } else {
               console.error('❌ Connection failed:', error.message);
          }
      } else {
          console.log('✅ Connection successful!');
      }

  } catch (err) {
      console.error('❌ Connection error:', err);
  }
}

testConnection();
