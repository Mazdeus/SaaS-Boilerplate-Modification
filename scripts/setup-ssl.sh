#!/bin/bash

# SSL Setup Script for brodofootwear.studio
# Run this on Azure VM after DNS is propagated
# Usage: sudo ./setup-ssl.sh

set -e

echo "🔒 SSL Setup for brodofootwear.studio"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Domain variables
DOMAIN="brodofootwear.studio"
WWW_DOMAIN="www.brodofootwear.studio"
EMAIL="your-email@example.com"  # Change this!

echo "📋 Configuration:"
echo "   Domain: $DOMAIN"
echo "   WWW: $WWW_DOMAIN"
echo ""

# Check DNS first
echo "🔍 Checking DNS propagation..."
IP_ADDRESS=$(dig +short $DOMAIN | tail -1)
if [ -z "$IP_ADDRESS" ]; then
    echo "❌ DNS not propagated yet. Please wait and try again."
    exit 1
fi
echo "✅ DNS resolved to: $IP_ADDRESS"
echo ""

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
    echo "✅ Certbot installed"
else
    echo "✅ Certbot already installed"
fi
echo ""

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "❌ Nginx is not running. Please start Nginx first."
    exit 1
fi
echo "✅ Nginx is running"
echo ""

# Check if Nginx config exists
if [ ! -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    echo "❌ Nginx configuration not found at /etc/nginx/sites-available/$DOMAIN"
    echo "   Please create Nginx config first (see SETUP-DOMAIN-BRODOFOOTWEAR.md)"
    exit 1
fi
echo "✅ Nginx configuration found"
echo ""

# Generate SSL certificate
echo "🔐 Generating SSL certificate..."
echo "   You'll be asked a few questions..."
echo ""

certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL certificate generated successfully!"
    echo ""
    echo "🔄 Testing auto-renewal..."
    certbot renew --dry-run
    echo ""
    echo "✅ Auto-renewal is configured!"
    echo ""
    echo "🎉 Setup complete!"
    echo "   Your site is now accessible via HTTPS:"
    echo "   - https://$DOMAIN"
    echo "   - https://$WWW_DOMAIN"
    echo ""
    echo "📊 Certificate info:"
    certbot certificates
else
    echo "❌ SSL generation failed. Please check the error above."
    exit 1
fi
