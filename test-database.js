#!/usr/bin/env node

/**
 * Test Database Connection Script
 * Jalankan dengan: node test-database.js
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Please create .env.local file with DATABASE_URL');
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Test 1: Basic connection
    console.log('Test 1: Basic Connection');
    const versionResult = await sql`SELECT version()`;
    console.log('✅ Connection successful');
    console.log(`📊 PostgreSQL: ${versionResult[0].version.split(' ').slice(0, 2).join(' ')}\n`);

    // Test 2: Check existing tables
    console.log('Test 2: Check Tables');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    if (tables.length > 0) {
      console.log('✅ Tables found:');
      tables.forEach(table => {
        console.log(`  📋 ${table.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. Database might be empty.');
    }
    console.log('');

    // Test 3: Check specific tables if they exist
    const requiredTables = [
      'organization', 
      'todo', 
      'contact_submission', 
      'cms_page', 
      'cms_block',
      'company_info'
    ];

    console.log('Test 3: Verify Required Tables');
    for (const tableName of requiredTables) {
      try {
        const result = await sql.unsafe(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_name = '${tableName}' 
          AND table_schema = 'public'
        `);
        
        if (parseInt(result[0].count) > 0) {
          // Get row count
          const rowCount = await sql.unsafe(`SELECT COUNT(*) as total FROM ${tableName}`);
          console.log(`  ✅ ${tableName} (${rowCount[0].total} rows)`);
        } else {
          console.log(`  ❌ ${tableName} - Not found`);
        }
      } catch (error) {
        console.log(`  ❌ ${tableName} - Error: ${error.message}`);
      }
    }
    console.log('');

    // Test 4: Test CRUD operations
    console.log('Test 4: CRUD Operations Test');
    
    try {
      // Test INSERT
      const insertResult = await sql`
        INSERT INTO contact_submission (name, email, subject, message)
        VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test message from database test')
        RETURNING id
      `;
      const insertedId = insertResult[0].id;
      console.log(`  ✅ INSERT: Created record with ID ${insertedId}`);

      // Test SELECT
      const selectResult = await sql`
        SELECT * FROM contact_submission WHERE id = ${insertedId}
      `;
      console.log(`  ✅ SELECT: Retrieved record for ${selectResult[0].name}`);

      // Test UPDATE
      await sql`
        UPDATE contact_submission 
        SET status = 'tested' 
        WHERE id = ${insertedId}
      `;
      console.log(`  ✅ UPDATE: Updated record status`);

      // Test DELETE
      await sql`
        DELETE FROM contact_submission WHERE id = ${insertedId}
      `;
      console.log(`  ✅ DELETE: Removed test record`);

    } catch (error) {
      console.log(`  ❌ CRUD Test failed: ${error.message}`);
      console.log('     This might be because tables don\'t exist yet.');
    }

    console.log('\n🎉 Database connection test completed!');

    // Connection info
    console.log('\n📋 Connection Information:');
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log(`  Host: ${dbUrl.hostname}`);
    console.log(`  Database: ${dbUrl.pathname.slice(1)}`);
    console.log(`  SSL: ${dbUrl.searchParams.get('sslmode') || 'enabled'}`);

    console.log('\n💡 Recommended next steps:');
    if (tables.length === 0) {
      console.log('  1. Run: node setup-database.js (to create tables)');
      console.log('  2. Run: npm run dev (to start application)');
    } else {
      console.log('  1. Run: npm run dev (to start application)');
      console.log('  2. Run: npm run db:studio (to explore database)');
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    console.log('\n🔧 Troubleshooting steps:');
    
    if (error.message.includes('getaddrinfo')) {
      console.log('  1. Check internet connection');
      console.log('  2. Verify Neon project is not suspended');
    } else if (error.message.includes('authentication')) {
      console.log('  1. Verify DATABASE_URL credentials');
      console.log('  2. Check if password contains special characters (URL encode them)');
    } else if (error.message.includes('connect')) {
      console.log('  1. Check firewall settings');
      console.log('  2. Verify Neon project region');
    } else {
      console.log('  1. Double-check DATABASE_URL format');
      console.log('  2. Ensure Neon project is active');
    }

    console.log('\n📝 Expected DATABASE_URL format:');
    console.log('  postgresql://username:password@host/database?sslmode=require');
    
    process.exit(1);
  }
}

// Helper function to mask sensitive data
function maskUrl(url) {
  try {
    const urlObj = new URL(url);
    return `postgresql://***:***@${urlObj.hostname}/${urlObj.pathname.slice(1)}${urlObj.search}`;
  } catch {
    return 'Invalid URL format';
  }
}

if (require.main === module) {
  testDatabaseConnection();
}

module.exports = { testDatabaseConnection };
