/**
 * Conditional database setup for Docker builds
 * This script will only run database operations if we're in runtime (not build time)
 */

// Check if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.BUILD_TIME === 'true';

if (isBuildTime) {
  console.log('⏭️ Skipping database operations during build time');
  console.log('📋 Build-time environment detected:');
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   - BUILD_TIME: ${process.env.BUILD_TIME}`);
  process.exit(0);
}

// Runtime database setup
console.log('🗄️ Running database setup at runtime...');
console.log('📋 Runtime environment detected:');
console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   - BUILD_TIME: ${process.env.BUILD_TIME || 'false'}`);
console.log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);

try {
  require('./setup-database.js');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('⚠️  This might be expected during initial container startup');
  console.log('🔄 The application will continue to start and retry database operations');
  
  // Don't exit with error - let the application start anyway
  // The health check will handle database availability
}
