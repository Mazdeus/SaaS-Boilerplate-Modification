import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

console.log('🔍 Checking Neon Database Connection...\n');
console.log('📍 Database URL:', databaseUrl.replace(/:[^:]*@/, ':****@'));
console.log('');

async function checkDatabase() {
  try {
    const sql = neon(databaseUrl);
    const db = drizzle(sql);

    console.log('✅ Connection established!\n');

    // Check if contact_submission table exists
    console.log('🔍 Checking if contact_submission table exists...');
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_submission'
      );
    `;

    if (result[0].exists) {
      console.log('✅ Table "contact_submission" EXISTS!\n');

      // Get table structure
      console.log('📋 Table structure:');
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'contact_submission'
        ORDER BY ordinal_position;
      `;

      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
      });

      console.log('');

      // Count existing records
      const count = await sql`SELECT COUNT(*) FROM contact_submission;`;
      console.log(`📊 Records in table: ${count[0].count}`);
      console.log('');
      console.log('✅ Database is ready!');
    } else {
      console.log('❌ Table "contact_submission" DOES NOT EXIST!');
      console.log('');
      console.log('🔧 To fix this:');
      console.log('1. Run: npm run db:push');
      console.log('2. Or manually run migration SQL in Neon console');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('');
    console.log('Full error:', error);
  }
}

checkDatabase();
