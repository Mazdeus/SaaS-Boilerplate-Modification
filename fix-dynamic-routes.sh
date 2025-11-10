#!/bin/bash

# ===================================================================
# Script untuk menambahkan dynamic export ke semua CMS API routes
# ===================================================================

echo "🔧 Fixing Next.js Static Generation Issues..."

# Array of CMS API route files
api_files=(
    "src/app/api/cms/about/route.ts"
    "src/app/api/cms/about/[id]/route.ts"
    "src/app/api/cms/brand-branches/route.ts"
    "src/app/api/cms/brand-branches/[id]/route.ts"
    "src/app/api/cms/collections/route.ts"
    "src/app/api/cms/company-branches/route.ts"
    "src/app/api/cms/company-branches/[id]/route.ts"
    "src/app/api/cms/company-info/route.ts"
    "src/app/api/cms/company-info/[id]/route.ts"
    "src/app/api/cms/hero/route.ts"
    "src/app/api/cms/hero/[id]/route.ts"
    "src/app/api/cms/products/route.ts"
    "src/app/api/cms/products/[id]/route.ts"
    "src/app/api/cms/services/route.ts"
    "src/app/api/cms/services/[id]/route.ts"
    "src/app/api/cms/stats/route.ts"
    "src/app/api/cms/team/route.ts"
    "src/app/api/cms/team/[id]/route.ts"
    "src/app/api/cms/testimonials/route.ts"
    "src/app/api/cms/testimonials/[id]/route.ts"
)

# Function to add dynamic export
add_dynamic_export() {
    local file="$1"
    
    if [ -f "$file" ]; then
        # Check if dynamic export already exists
        if ! grep -q "export const dynamic" "$file"; then
            echo "📝 Adding dynamic export to: $file"
            
            # Create temporary file
            temp_file=$(mktemp)
            
            # Add imports and dynamic exports after the import statements
            sed '/^import/,/^$/{
                /^$/a\
// Force dynamic rendering for CMS API routes\
export const dynamic = '\''force-dynamic'\'';\
export const runtime = '\''nodejs'\'';

            }' "$file" > "$temp_file"
            
            # Move temp file back to original
            mv "$temp_file" "$file"
            echo "✅ Updated: $file"
        else
            echo "⏭️ Skipped: $file (already has dynamic export)"
        fi
    else
        echo "⚠️ File not found: $file"
    fi
}

# Process each API file
for file in "${api_files[@]}"; do
    add_dynamic_export "$file"
done

echo ""
echo "🎉 All CMS API routes have been updated!"
echo "📋 Changes made:"
echo "   - Added 'export const dynamic = \"force-dynamic\"'"
echo "   - Added 'export const runtime = \"nodejs\"'"
echo ""
echo "💡 This will prevent Next.js from trying to statically render these routes during build time."
