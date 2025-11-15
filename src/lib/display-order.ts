/**
 * Display Order Normalization Utility
 * 
 * This module provides functions to normalize display order (urutan) values
 * ensuring they are always sequential, unique, and without gaps.
 * 
 * Use after any create, update, or delete operations to maintain clean ordering.
 */

import { db } from '@/db';
import { sql } from 'drizzle-orm';

/**
 * Normalize display order for any table
 * Reorders all items sequentially starting from 0
 * 
 * @param tableName - Name of the table to normalize
 * @param orderColumn - Name of the display order column (default: 'display_order')
 * @param idColumn - Name of the ID column (default: 'id')
 * @param additionalConditions - Optional WHERE clause conditions
 * 
 * @example
 * // Normalize all collections
 * await normalizeDisplayOrder('collections');
 * 
 * @example
 * // Normalize only active stores
 * await normalizeDisplayOrder('stores', 'display_order', 'id', 'is_active = true');
 */
export async function normalizeDisplayOrder(
  tableName: string,
  orderColumn: string = 'display_order',
  idColumn: string = 'id',
  additionalConditions?: string
): Promise<void> {
  try {
    // Build WHERE clause
    const whereClause = additionalConditions ? `WHERE ${additionalConditions}` : '';

    // Use ROW_NUMBER() to assign sequential order based on current display order
    const query = sql.raw(`
      WITH ranked AS (
        SELECT 
          ${idColumn},
          ROW_NUMBER() OVER (ORDER BY ${orderColumn}, ${idColumn}) - 1 AS new_order
        FROM ${tableName}
        ${whereClause}
      )
      UPDATE ${tableName}
      SET ${orderColumn} = ranked.new_order,
          updated_at = NOW()
      FROM ranked
      WHERE ${tableName}.${idColumn} = ranked.${idColumn}
    `);

    await db.execute(query);
    
    console.log(`Display order normalized for table: ${tableName}`);
  } catch (error) {
    console.error(`Error normalizing display order for ${tableName}:`, error);
    throw error;
  }
}

/**
 * Get the next available display order for a table
 * 
 * @param tableName - Name of the table
 * @param orderColumn - Name of the display order column (default: 'display_order')
 * @param additionalConditions - Optional WHERE clause conditions
 * @returns The next available display order number
 * 
 * @example
 * const nextOrder = await getNextDisplayOrder('collections');
 * // Use nextOrder when creating new item
 */
export async function getNextDisplayOrder(
  tableName: string,
  orderColumn: string = 'display_order',
  additionalConditions?: string
): Promise<number> {
  try {
    const whereClause = additionalConditions ? `WHERE ${additionalConditions}` : '';
    
    const query = sql.raw(`
      SELECT COALESCE(MAX(${orderColumn}), -1) + 1 AS next_order
      FROM ${tableName}
      ${whereClause}
    `);

    const result = await db.execute(query);
    const rows = result.rows as Array<{ next_order: number }>;
    
    return rows[0]?.next_order ?? 0;
  } catch (error) {
    console.error(`Error getting next display order for ${tableName}:`, error);
    return 0;
  }
}

/**
 * Shift display order values to make room for insertion
 * 
 * @param tableName - Name of the table
 * @param position - Position where new item will be inserted
 * @param orderColumn - Name of the display order column (default: 'display_order')
 * 
 * @example
 * // Insert new item at position 2, shift others down
 * await shiftDisplayOrder('collections', 2);
 */
export async function shiftDisplayOrder(
  tableName: string,
  position: number,
  orderColumn: string = 'display_order'
): Promise<void> {
  try {
    const query = sql.raw(`
      UPDATE ${tableName}
      SET ${orderColumn} = ${orderColumn} + 1,
          updated_at = NOW()
      WHERE ${orderColumn} >= ${position}
    `);

    await db.execute(query);
    
    console.log(`Display order shifted for table: ${tableName} at position: ${position}`);
  } catch (error) {
    console.error(`Error shifting display order for ${tableName}:`, error);
    throw error;
  }
}

/**
 * Validate display order uniqueness
 * Check if there are duplicate display order values
 * 
 * @param tableName - Name of the table
 * @param orderColumn - Name of the display order column (default: 'display_order')
 * @returns Array of duplicate display order values
 */
export async function findDuplicateOrders(
  tableName: string,
  orderColumn: string = 'display_order'
): Promise<number[]> {
  try {
    const query = sql.raw(`
      SELECT ${orderColumn}
      FROM ${tableName}
      GROUP BY ${orderColumn}
      HAVING COUNT(*) > 1
    `);

    const result = await db.execute(query);
    const rows = result.rows as Array<{ display_order: number }>;
    
    return rows.map(row => row.display_order);
  } catch (error) {
    console.error(`Error finding duplicate orders for ${tableName}:`, error);
    return [];
  }
}

/**
 * Auto-normalize display order after operations
 * Call this helper after create, update, or delete operations
 * 
 * @param tableName - Name of the table
 * @param shouldNormalize - Whether to normalize (default: true)
 */
export async function autoNormalizeAfterOperation(
  tableName: string,
  shouldNormalize: boolean = true
): Promise<void> {
  if (!shouldNormalize) return;
  
  try {
    await normalizeDisplayOrder(tableName);
  } catch (error) {
    // Log but don't throw - normalization failure shouldn't break the main operation
    console.error(`Auto-normalization failed for ${tableName}:`, error);
  }
}
