// Script to push database schema to Neon
import { config } from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load environment variables from .env.local
config({ path: '.env.local' });

async function pushDatabase() {
  try {
    console.log('🚀 Pushing database schema to Neon...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in .env.local');
    }
    
    const { stdout, stderr } = await execAsync('npx drizzle-kit push', {
      env: { ...process.env }
    });
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Database schema pushed successfully!');
  } catch (error) {
    console.error('❌ Error pushing database:', error);
    process.exit(1);
  }
}

pushDatabase();
