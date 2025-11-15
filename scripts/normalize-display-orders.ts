/**
 * Normalize Display Order - Migration Script
 * 
 * Run this script to normalize display order for all existing data in the database.
 * This ensures all entities with display_order field have sequential, unique values.
 * 
 * Usage:
 *   npx tsx scripts/normalize-display-orders.ts
 * 
 * Or with specific tables:
 *   npx tsx scripts/normalize-display-orders.ts collections stores
 */

import { normalizeDisplayOrder, findDuplicateOrders } from '../src/lib/display-order';

// List of all tables with display_order field
const TABLES_WITH_DISPLAY_ORDER = [
  'collections',
  'stores',
  'testimonials',
  'hero_sections',
  'founders',
  'collection_images',
  'instagram_posts',
  'company_values',
];

interface NormalizationResult {
  table: string;
  success: boolean;
  duplicatesFound: number;
  error?: string;
}

async function checkDuplicates(tableName: string): Promise<number[]> {
  try {
    const duplicates = await findDuplicateOrders(tableName);
    return duplicates;
  } catch (error) {
    console.error(`Error checking duplicates for ${tableName}:`, error);
    return [];
  }
}

async function normalizeTable(tableName: string): Promise<NormalizationResult> {
  console.log(`\n📊 Processing table: ${tableName}`);
  
  try {
    // Check for duplicates before normalization
    const duplicatesBefore = await checkDuplicates(tableName);
    
    if (duplicatesBefore.length > 0) {
      console.log(`⚠️  Found ${duplicatesBefore.length} duplicate order values:`, duplicatesBefore);
    } else {
      console.log('✅ No duplicates found');
    }
    
    // Perform normalization
    console.log('🔄 Normalizing...');
    await normalizeDisplayOrder(tableName);
    
    // Verify normalization
    const duplicatesAfter = await checkDuplicates(tableName);
    
    if (duplicatesAfter.length === 0) {
      console.log('✅ Normalization successful!');
      return {
        table: tableName,
        success: true,
        duplicatesFound: duplicatesBefore.length,
      };
    } else {
      console.log('❌ Still has duplicates after normalization:', duplicatesAfter);
      return {
        table: tableName,
        success: false,
        duplicatesFound: duplicatesBefore.length,
        error: 'Duplicates persist after normalization',
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error normalizing ${tableName}:`, errorMessage);
    return {
      table: tableName,
      success: false,
      duplicatesFound: 0,
      error: errorMessage,
    };
  }
}

async function main() {
  console.log('🚀 Display Order Normalization Script');
  console.log('=====================================\n');
  
  // Get tables from command line args, or use all tables
  const args = process.argv.slice(2);
  const tablesToNormalize = args.length > 0 ? args : TABLES_WITH_DISPLAY_ORDER;
  
  console.log('📋 Tables to normalize:', tablesToNormalize.join(', '));
  console.log('');
  
  const results: NormalizationResult[] = [];
  
  // Process each table
  for (const tableName of tablesToNormalize) {
    const result = await normalizeTable(tableName);
    results.push(result);
  }
  
  // Print summary
  console.log('\n\n📊 Normalization Summary');
  console.log('========================\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalDuplicatesFixed = results.reduce((sum, r) => sum + r.duplicatesFound, 0);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`🔧 Total duplicates fixed: ${totalDuplicatesFixed}`);
  
  if (failed.length > 0) {
    console.log('\n⚠️  Failed tables:');
    failed.forEach(r => {
      console.log(`   - ${r.table}: ${r.error}`);
    });
  }
  
  console.log('\n✨ Normalization complete!\n');
  
  // Exit with error code if any failures
  if (failed.length > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
