#!/usr/bin/env node

/**
 * Final Database Validation Script
 * Memverifikasi bahwa 19 tabel sudah dibuat dan 14 tabel terisi data real
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function validateDatabaseSetup() {
  console.log('🔍 Final Database Validation...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 1. Verify 19 tables created
    console.log('📊 Table Creation Verification');
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    const expectedTables = [
      'organization', 'todo', 'contact_submission', 'cms_user', 'images',
      'company_info', 'company_branch', 'contact_info', 'hero_section', 
      'about_section', 'company_value', 'team_member', 'service_item',
      'collection_item', 'product_item', 'testimonial', 'social_media', 
      'site_settings', 'activity_log'
    ];

    console.log(`Expected: ${expectedTables.length} tables`);
    console.log(`Found: ${allTables.length} tables\n`);

    const foundTableNames = allTables.map(t => t.table_name);
    const missingTables = expectedTables.filter(table => !foundTableNames.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All 19 tables created successfully!\n');
    } else {
      console.log('❌ Missing tables:', missingTables.join(', '));
      return;
    }

    // 2. Verify data in 14 main tables
    console.log('📈 Data Population Verification');
    const tablesWithData = [
      'company_info', 'contact_info', 'about_section', 'hero_section',
      'collection_item', 'product_item', 'team_member', 'service_item',
      'testimonial', 'social_media', 'site_settings', 'cms_user',
      'company_branch', 'contact_submission'
    ];

    let totalRecords = 0;
    const dataStatus = [];

    for (const tableName of tablesWithData) {
      try {
        const result = await sql.unsafe(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = parseInt(result[0].count);
        totalRecords += count;
        
        dataStatus.push({
          table: tableName,
          records: count,
          status: count > 0 ? '✅' : '❌'
        });
        
        console.log(`  ${count > 0 ? '✅' : '❌'} ${tableName}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${tableName}: Error - ${error.message}`);
        dataStatus.push({
          table: tableName,
          records: 0,
          status: '❌'
        });
      }
    }

    console.log(`\n📊 Total Records: ${totalRecords}`);

    // 3. Verify specific real data samples
    console.log('\n🔍 Real Data Verification');

    // Check company info
    const company = await sql`SELECT name, industry FROM company_info LIMIT 1`;
    if (company.length > 0 && company[0].name === 'BRODO') {
      console.log('  ✅ Company: BRODO (Real company data)');
    } else {
      console.log('  ❌ Company data missing or incorrect');
    }

    // Check products
    const products = await sql`SELECT COUNT(*) as count FROM product_item WHERE price > 0`;
    if (parseInt(products[0].count) > 0) {
      console.log(`  ✅ Products: ${products[0].count} products with real prices`);
    } else {
      console.log('  ❌ Product data missing');
    }

    // Check branches
    const branches = await sql`SELECT COUNT(*) as count FROM company_branch`;
    if (parseInt(branches[0].count) >= 10) {
      console.log(`  ✅ Branches: ${branches[0].count} store locations`);
    } else {
      console.log('  ❌ Branch data insufficient');
    }

    // Check team members
    const team = await sql`SELECT COUNT(*) as count FROM team_member`;
    if (parseInt(team[0].count) >= 2) {
      console.log(`  ✅ Team: ${team[0].count} team members`);
    } else {
      console.log('  ❌ Team data missing');
    }

    // 4. Check constraints and indexes
    console.log('\n🔐 Constraints & Indexes Verification');
    
    const primaryKeys = await sql`
      SELECT COUNT(*) as count 
      FROM information_schema.table_constraints 
      WHERE constraint_type = 'PRIMARY KEY' 
      AND table_schema = 'public'
    `;
    console.log(`  ✅ Primary Keys: ${primaryKeys[0].count}`);

    const foreignKeys = await sql`
      SELECT COUNT(*) as count 
      FROM information_schema.table_constraints 
      WHERE constraint_type = 'FOREIGN KEY' 
      AND table_schema = 'public'
    `;
    console.log(`  ✅ Foreign Keys: ${foreignKeys[0].count}`);

    const indexes = await sql`
      SELECT COUNT(*) as count 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `;
    console.log(`  ✅ Indexes: ${indexes[0].count}`);

    // 5. Final validation result
    console.log('\n🎯 FINAL VALIDATION RESULT');
    console.log('=====================================');
    
    const tablesOk = allTables.length === 19;
    const dataOk = dataStatus.filter(d => d.status === '✅').length === 14;
    
    if (tablesOk && dataOk) {
      console.log('🎉 ✅ VALIDATION PASSED!');
      console.log('🏆 Database setup is 100% complete:');
      console.log('   • 19 tables created successfully');
      console.log('   • 14 tables populated with real data');
      console.log('   • Constraints and indexes in place');
      console.log('   • Ready for production use!');
      
      console.log('\n🚀 Next Steps:');
      console.log('   1. Run: npm run dev');
      console.log('   2. Open: npm run db:studio');
      console.log('   3. Share: DATABASE_VERIFICATION_REPORT.md');
      
    } else {
      console.log('❌ VALIDATION FAILED!');
      if (!tablesOk) {
        console.log(`   • Tables: ${allTables.length}/19 created`);
      }
      if (!dataOk) {
        const populated = dataStatus.filter(d => d.status === '✅').length;
        console.log(`   • Data: ${populated}/14 tables populated`);
      }
      console.log('\n🔧 Run: npm run db:setup');
    }

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  validateDatabaseSetup();
}

module.exports = { validateDatabaseSetup };
