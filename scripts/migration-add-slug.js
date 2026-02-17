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
      process.env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1');
    }
  });
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL or DIRECT_URL in .env');
  process.exit(1);
}

const client = new Client({ connectionString });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database.');

    // 1. Add slug column if not exists (products)
    console.log('\n--- Migrating PRODUCTS ---');
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS slug text UNIQUE;
    `);
    console.log('Column `slug` added to `products`.');

    // 2. Populate slugs for existing products
    const productsRes = await client.query('SELECT id, titulo FROM products WHERE slug IS NULL');
    if (productsRes.rows.length > 0) {
      console.log(`Found ${productsRes.rows.length} products without slug.`);
      for (const prod of productsRes.rows) {
        let slug = slugify(prod.titulo);
        // Ensure uniqueness (simple check)
        let uniqueSlug = slug;
        let counter = 1;
        while (true) {
            const check = await client.query('SELECT 1 FROM products WHERE slug = $1 AND id != $2', [uniqueSlug, prod.id]);
            if (check.rows.length === 0) break;
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        
        await client.query('UPDATE products SET slug = $1 WHERE id = $2', [uniqueSlug, prod.id]);
        console.log(`Updated product "${prod.titulo}" -> slug: "${uniqueSlug}"`);
      }
    } else {
        console.log('All products already have slugs.');
    }


    // 3. Add slug column if not exists (projects)
    console.log('\n--- Migrating PROJECTS ---');
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS slug text UNIQUE;
    `);
    console.log('Column `slug` added to `projects`.');

    // 4. Populate slugs for existing projects
    const projectsRes = await client.query('SELECT id, titulo FROM projects WHERE slug IS NULL');
    if (projectsRes.rows.length > 0) {
      console.log(`Found ${projectsRes.rows.length} projects without slug.`);
      for (const proj of projectsRes.rows) {
        let slug = slugify(proj.titulo);
        // Ensure uniqueness
        let uniqueSlug = slug;
        let counter = 1;
        while (true) {
            const check = await client.query('SELECT 1 FROM projects WHERE slug = $1 AND id != $2', [uniqueSlug, proj.id]);
            if (check.rows.length === 0) break;
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        await client.query('UPDATE projects SET slug = $1 WHERE id = $2', [uniqueSlug, proj.id]);
        console.log(`Updated project "${proj.titulo}" -> slug: "${uniqueSlug}"`);
      }
    } else {
        console.log('All projects already have slugs.');
    }
    
    // Optional: Set NOT NULL constraint if all rows have slugs
    // await client.query('ALTER TABLE products ALTER COLUMN slug SET NOT NULL');
    // await client.query('ALTER TABLE projects ALTER COLUMN slug SET NOT NULL');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
