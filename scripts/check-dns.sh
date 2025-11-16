#!/bin/bash

# Quick DNS Check Script for brodofootwear.studio
# Usage: ./scripts/check-dns.sh

echo "🔍 Checking DNS propagation for brodofootwear.studio..."
echo ""

# Check root domain
echo "📍 Root domain (@):"
nslookup brodofootwear.studio
echo ""

# Check www subdomain
echo "📍 WWW subdomain:"
nslookup www.brodofootwear.studio
echo ""

# Check with dig (if available)
if command -v dig &> /dev/null; then
    echo "📍 Detailed DNS info (dig):"
    dig brodofootwear.studio +short
    echo ""
fi

# Expected IP
EXPECTED_IP="40.81.26.137"
echo "✅ Expected IP: $EXPECTED_IP"
echo ""

# Check if DNS is propagated
CURRENT_IP=$(nslookup brodofootwear.studio | grep -A1 "Non-authoritative answer" | tail -1 | awk '{print $2}')
if [ "$CURRENT_IP" == "$EXPECTED_IP" ]; then
    echo "✅ DNS propagation complete! Domain is pointing to Azure VM."
else
    echo "⏳ DNS not yet propagated. Current IP: $CURRENT_IP"
    echo "   Please wait a few minutes and try again."
fi
