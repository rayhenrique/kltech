const { Client } = require('pg');
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

// Prefer DIRECT_URL for migrations/schema inspection, fallback to DATABASE_URL
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL or DIRECT_URL in .env');
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
});

async function inspectSchema() {
  try {
    await client.connect();
    console.log('Connected to database.');

    const tables = ['products', 'projects', 'companies', 'contracts', 'leads'];
    
    for (const tableName of tables) {
        console.log(`\n--- Inspecting table: ${tableName} ---`);
        const res = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = $1
            ORDER BY ordinal_position;
        `, [tableName]);

        if (res.rows.length === 0) {
            console.log(`Table '${tableName}' does not exist.`);
        } else {
            console.table(res.rows);
        }
    }

  } catch (err) {
    console.error('Error inspecting schema:', err);
  } finally {
    await client.end();
  }
}

inspectSchema();
