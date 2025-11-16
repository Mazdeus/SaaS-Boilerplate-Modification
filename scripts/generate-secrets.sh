#!/bin/bash

# Script to generate secure JWT and Session secrets for production
# Run this on your Azure VM

echo "================================================"
echo "  GENERATE PRODUCTION SECRETS"
echo "================================================"
echo ""
echo "Generating secure random secrets..."
echo ""

echo "JWT_SECRET:"
openssl rand -base64 48
echo ""

echo "SESSION_SECRET:"
openssl rand -base64 48
echo ""

echo "================================================"
echo "COPY these secrets to your .env.production file"
echo "NEVER commit these secrets to Git!"
echo "================================================"
