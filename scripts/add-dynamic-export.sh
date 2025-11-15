#!/bin/bash

# Script to add dynamic export to all API routes
# This fixes the "couldn't be rendered statically" error

echo "Adding 'export const dynamic = force-dynamic' to all API routes..."

# Find all route.ts files in src/app/api
find src/app/api -name "route.ts" | while read file; do
  # Check if file already has dynamic export
  if grep -q "export const dynamic" "$file"; then
    echo "✓ $file already has dynamic export"
  else
    # Check if file uses cookies or auth
    if grep -q -E "(cookies|requireAuth|verifyAuth)" "$file"; then
      echo "📝 Adding dynamic export to $file"
      
      # Add after imports, before first export function
      # Find the line number of first export function
      line_num=$(grep -n "^export async function" "$file" | head -1 | cut -d: -f1)
      
      if [ ! -z "$line_num" ]; then
        # Insert before the export function
        insert_line=$((line_num - 1))
        sed -i "${insert_line}a\\\n// Force dynamic rendering for this route\nexport const dynamic = 'force-dynamic';\n" "$file"
        echo "✅ Added to $file"
      fi
    fi
  fi
done

echo ""
echo "Done! All API routes updated."
