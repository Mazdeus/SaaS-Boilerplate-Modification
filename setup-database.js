#!/usr/bin/env node

/**
 * Script automasi untuk setup database Neon
 * Jalankan dengan: node setup-database.js
 */

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  // Validasi environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in environment variables');
    console.log('Please add DATABASE_URL to your .env.local file');
    process.exit(1);
  }

  try {
    // Initialize Neon connection
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔍 Testing database connection...');
    const versionResult = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log(`📊 PostgreSQL version: ${versionResult[0].version.split(' ')[0]} ${versionResult[0].version.split(' ')[1]}\n`);

    // Read SQL migration file
    console.log('📖 Reading migration file...');
    const sqlFilePath = path.join(__dirname, 'database', 'setup-complete.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error('❌ ERROR: database/setup-complete.sql file not found');
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ Migration file loaded successfully\n');

    // Execute migration
    console.log('🔄 Executing database migration...');
    console.log('This may take a few moments...\n');

    // Split SQL content by statement separator and execute
    const statements = sqlContent.split('--').filter(stmt => stmt.trim());
    
    // Execute the complete SQL file
    await sql.unsafe(sqlContent);
    
    console.log('✅ Database migration executed successfully!\n');

    // Verify tables created
    console.log('🔍 Verifying tables creation...');
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    console.log('📋 Tables created:');
    tablesResult.forEach(table => {
      console.log(`  ✓ ${table.table_name}`);
    });

    // Check sample data
    console.log('\n🔍 Checking sample data...');
    
    try {
      const companyCount = await sql`SELECT COUNT(*) FROM company_info`;
      console.log(`  ✓ Company info records: ${companyCount[0].count}`);
      
      const pagesCount = await sql`SELECT COUNT(*) FROM cms_page`;
      console.log(`  ✓ CMS pages: ${pagesCount[0].count}`);
      
      const blocksCount = await sql`SELECT COUNT(*) FROM cms_block`;
      console.log(`  ✓ CMS blocks: ${blocksCount[0].count}`);
    } catch (error) {
      console.log('  ⚠️  Sample data check skipped (tables might be empty)');
    }

    console.log('\n🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!');
    console.log('\n📝 Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Test your application');
    console.log('  3. Use: npm run db:studio to explore your database');
    console.log('\n💡 Useful commands:');
    console.log('  - npm run db:studio   # Open Drizzle Studio');
    console.log('  - npm run db:generate # Generate new migrations');
    console.log('  - npm run db:migrate  # Apply migrations');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.message.includes('connect')) {
      console.log('\n🔧 Troubleshooting connection issues:');
      console.log('  1. Check your DATABASE_URL in .env.local');
      console.log('  2. Ensure your Neon project is active');
      console.log('  3. Verify internet connection');
    } else if (error.message.includes('relation')) {
      console.log('\n🔧 Database schema issues:');
      console.log('  1. Ensure you have proper permissions');
      console.log('  2. Check if tables already exist');
      console.log('  3. Try dropping existing tables if needed');
    }
    
    process.exit(1);
  }
}

// Helper function untuk display progress
function displayProgress() {
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let index = 0;
  
  return setInterval(() => {
    process.stdout.write(`\r${spinner[index]} Processing...`);
    index = (index + 1) % spinner.length;
  }, 100);
}

// Run setup
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
