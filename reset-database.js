#!/usr/bin/env node

/**
 * Reset Database Script
 * PERINGATAN: Script ini akan menghapus SEMUA data di database!
 * Jalankan dengan: node reset-database.js
 */

const { neon } = require('@neondatabase/serverless');
const readline = require('readline');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase());
    });
  });
}

async function resetDatabase() {
  console.log('🚨 DATABASE RESET SCRIPT');
  console.log('==============================');
  console.log('⚠️  WARNING: This will delete ALL data in your database!');
  console.log('⚠️  This action is IRREVERSIBLE!');
  console.log('==============================\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    rl.close();
    return;
  }

  try {
    // Double confirmation
    const confirm1 = await askQuestion('Are you sure you want to reset the database? (yes/no): ');
    if (confirm1 !== 'yes') {
      console.log('❌ Operation cancelled.');
      rl.close();
      return;
    }

    const confirm2 = await askQuestion('Type "RESET" to confirm (this will delete all data): ');
    if (confirm2 !== 'reset') {
      console.log('❌ Operation cancelled.');
      rl.close();
      return;
    }

    console.log('\n🔄 Starting database reset...');

    const sql = neon(process.env.DATABASE_URL);

    // Test connection first
    console.log('🔍 Testing connection...');
    await sql`SELECT 1`;
    console.log('✅ Connection successful');

    // Get list of all tables
    console.log('📋 Fetching table list...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log('ℹ️  No tables found. Database is already empty.');
      rl.close();
      return;
    }

    console.log('📋 Tables to be deleted:');
    tables.forEach(table => {
      console.log(`  🗑️  ${table.table_name}`);
    });

    // Final confirmation
    const finalConfirm = await askQuestion('\nProceed with deletion? (yes/no): ');
    if (finalConfirm !== 'yes') {
      console.log('❌ Operation cancelled.');
      rl.close();
      return;
    }

    console.log('\n🗑️  Dropping all tables...');

    // Drop tables with CASCADE to handle foreign key constraints
    for (const table of tables) {
      try {
        await sql.unsafe(`DROP TABLE IF EXISTS "${table.table_name}" CASCADE`);
        console.log(`  ✅ Dropped: ${table.table_name}`);
      } catch (error) {
        console.log(`  ❌ Failed to drop ${table.table_name}: ${error.message}`);
      }
    }

    // Drop any remaining sequences
    console.log('\n🔢 Cleaning up sequences...');
    const sequences = await sql`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `;

    for (const seq of sequences) {
      try {
        await sql.unsafe(`DROP SEQUENCE IF EXISTS "${seq.sequence_name}" CASCADE`);
        console.log(`  ✅ Dropped sequence: ${seq.sequence_name}`);
      } catch (error) {
        console.log(`  ❌ Failed to drop sequence ${seq.sequence_name}: ${error.message}`);
      }
    }

    // Drop any remaining indexes
    console.log('\n📊 Cleaning up indexes...');
    const indexes = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname NOT LIKE 'pg_%'
    `;

    for (const idx of indexes) {
      try {
        await sql.unsafe(`DROP INDEX IF EXISTS "${idx.indexname}" CASCADE`);
        console.log(`  ✅ Dropped index: ${idx.indexname}`);
      } catch (error) {
        // Some indexes are automatically dropped with tables
        console.log(`  ⚠️  Index ${idx.indexname}: ${error.message}`);
      }
    }

    // Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    const remainingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;

    if (remainingTables.length === 0) {
      console.log('✅ Database successfully reset - no tables remaining');
    } else {
      console.log('⚠️  Some tables may still exist:');
      remainingTables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

    console.log('\n🎉 DATABASE RESET COMPLETED!');
    console.log('\n📝 Next steps:');
    console.log('  1. Run: node setup-database.js (to recreate tables)');
    console.log('  2. Run: npm run dev (to start application)');
    console.log('  3. Or run: npm run db:generate && npm run db:migrate (using Drizzle)');

  } catch (error) {
    console.error('\n❌ Database reset failed:', error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Ensure you have proper database permissions');
    console.log('  2. Check if any connections are still active');
    console.log('  3. Try connecting to Neon dashboard and reset manually');
    
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function resetMigrationsOnly() {
  console.log('🔄 Resetting migrations folder...');
  
  const fs = require('fs');
  const path = require('path');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const backupDir = path.join(__dirname, 'migrations_backup');
  
  try {
    // Create backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Move existing migrations to backup
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir);
      files.forEach(file => {
        if (file.endsWith('.sql') || file === 'meta') {
          const sourcePath = path.join(migrationsDir, file);
          const destPath = path.join(backupDir, file);
          
          if (fs.lstatSync(sourcePath).isDirectory()) {
            // Handle directories (like meta folder)
            if (fs.existsSync(destPath)) {
              fs.rmSync(destPath, { recursive: true });
            }
            fs.cpSync(sourcePath, destPath, { recursive: true });
            fs.rmSync(sourcePath, { recursive: true });
          } else {
            // Handle files
            if (fs.existsSync(destPath)) {
              fs.unlinkSync(destPath);
            }
            fs.renameSync(sourcePath, destPath);
          }
        }
      });
    }
    
    console.log('✅ Migrations backed up to migrations_backup/');
    console.log('📝 Now you can run: npm run db:generate');
    
  } catch (error) {
    console.error('❌ Failed to reset migrations:', error.message);
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'migrations-only') {
    resetMigrationsOnly();
  } else {
    resetDatabase();
  }
}

module.exports = { 
  resetDatabase, 
  resetMigrationsOnly 
};
