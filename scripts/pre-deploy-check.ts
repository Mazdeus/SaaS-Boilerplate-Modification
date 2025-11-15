/**
 * Pre-Deployment Check Script
 * 
 * Run comprehensive checks before deploying to production:
 * - TypeScript compilation
 * - Build process
 * - Display order normalization
 * - Database consistency checks
 * 
 * Usage:
 *   npm run pre-deploy
 */

import { execSync } from 'child_process';
import { findDuplicateOrders, normalizeDisplayOrder } from '../src/lib/display-order';

const TABLES_TO_CHECK = [
  'collections',
  'stores',
  'testimonials',
  'hero_sections',
  'founders',
];

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  duration?: number;
}

function runCommand(command: string, description: string): CheckResult {
  console.log(`\n🔍 ${description}...`);
  const startTime = Date.now();
  
  try {
    execSync(command, { stdio: 'inherit' });
    const duration = Date.now() - startTime;
    console.log(`✅ ${description} passed (${duration}ms)`);
    return {
      name: description,
      passed: true,
      message: 'Success',
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${description} failed (${duration}ms)`);
    return {
      name: description,
      passed: false,
      message: error instanceof Error ? error.message : String(error),
      duration,
    };
  }
}

async function checkDisplayOrders(): Promise<CheckResult> {
  console.log(`\n🔍 Checking display order consistency...`);
  const startTime = Date.now();
  
  try {
    let totalDuplicates = 0;
    let totalNormalized = 0;
    
    for (const table of TABLES_TO_CHECK) {
      const duplicates = await findDuplicateOrders(table);
      
      if (duplicates.length > 0) {
        console.log(`⚠️  ${table}: Found ${duplicates.length} duplicates, normalizing...`);
        await normalizeDisplayOrder(table);
        totalDuplicates += duplicates.length;
        totalNormalized++;
      } else {
        console.log(`✅ ${table}: No duplicates`);
      }
    }
    
    const duration = Date.now() - startTime;
    
    if (totalDuplicates > 0) {
      return {
        name: 'Display Order Check',
        passed: true,
        message: `Fixed ${totalDuplicates} duplicates in ${totalNormalized} tables`,
        duration,
      };
    } else {
      return {
        name: 'Display Order Check',
        passed: true,
        message: 'All tables have clean display orders',
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      name: 'Display Order Check',
      passed: false,
      message: error instanceof Error ? error.message : String(error),
      duration,
    };
  }
}

async function main() {
  console.log('🚀 Pre-Deployment Checks');
  console.log('=======================\n');
  console.log('Running comprehensive checks before deployment...\n');
  
  const results: CheckResult[] = [];
  
  // 1. TypeScript type check
  results.push(runCommand('npm run type-check', 'TypeScript Type Check'));
  
  // 2. Linting
  results.push(runCommand('npm run lint', 'ESLint Check'));
  
  // 3. Build
  results.push(runCommand('npm run build', 'Production Build'));
  
  // 4. Display order checks
  const displayOrderResult = await checkDisplayOrders();
  results.push(displayOrderResult);
  
  // Print summary
  console.log('\n\n📊 Pre-Deployment Summary');
  console.log('=========================\n');
  
  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);
  
  console.log('✅ Passed Checks:');
  passed.forEach(r => {
    console.log(`   - ${r.name}: ${r.message} ${r.duration ? `(${r.duration}ms)` : ''}`);
  });
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Checks:');
    failed.forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
    
    console.log('\n⚠️  Deployment not recommended! Fix errors above first.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed! Ready for deployment! 🎉\n');
    
    console.log('📋 Deployment Checklist:');
    console.log('  [ ] Environment variables configured');
    console.log('  [ ] Database connection string updated');
    console.log('  [ ] Production database seeded');
    console.log('  [ ] CDN/Image hosting configured');
    console.log('  [ ] Analytics tracking configured');
    console.log('  [ ] Error monitoring setup (Sentry, etc.)');
    console.log('  [ ] Performance monitoring enabled');
    console.log('  [ ] Security headers configured');
    console.log('  [ ] Rate limiting enabled');
    console.log('  [ ] Backup strategy in place');
    console.log('');
  }
}

// Run all checks
main().catch(error => {
  console.error('\n❌ Fatal error during checks:', error);
  process.exit(1);
});
