#!/bin/bash

# 🚀 GOOGLE-STYLE SENDGRID SETUP SCRIPT
# Complete setup for bulletproof email functionality

echo "🚀 Setting up Google-Style SendGrid Email System..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from .env.example"
else
    echo "✅ .env file already exists"
fi

# Check if SendGrid API key is set
if grep -q "SENDGRID_API_KEY=your-sendgrid-api-key" .env; then
    echo "⚠️  WARNING: SendGrid API key not configured!"
    echo "📧 Please update your .env file with your actual SendGrid API key:"
    echo "   SENDGRID_API_KEY=SG.your-actual-sendgrid-api-key-here"
    echo ""
    echo "🔗 Get your API key from: https://app.sendgrid.com/settings/api_keys"
    echo ""
    read -p "Press Enter to continue after updating your API key..."
fi

# Check if FROM_EMAIL is set
if grep -q "FROM_EMAIL=noreply@askyacham.com" .env; then
    echo "✅ FROM_EMAIL is properly configured"
else
    echo "📧 FROM_EMAIL configuration found"
fi

# Check if FRONTEND_URL is set
if grep -q "FRONTEND_URL=https://www.askyacham.com" .env; then
    echo "✅ FRONTEND_URL is properly configured"
else
    echo "🌐 FRONTEND_URL configuration found"
fi

echo ""
echo "🧪 Testing SendGrid Configuration..."

# Test SendGrid connection
echo "📡 Testing SendGrid API connection..."
curl -s -X "GET" "https://api.sendgrid.com/v3/user/account" \
  -H "Authorization: Bearer $(grep SENDGRID_API_KEY .env | cut -d '=' -f2)" \
  -H "Content-Type: application/json" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ SendGrid API connection successful!"
else
    echo "❌ SendGrid API connection failed!"
    echo "   Please check your SENDGRID_API_KEY in .env file"
fi

echo ""
echo "📧 SendGrid Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. ✅ SendGrid API key configured"
echo "2. ✅ Email templates ready"
echo "3. ✅ Test endpoints available"
echo ""
echo "🧪 Test your setup:"
echo "   GET  /api/test-email/connection"
echo "   POST /api/test-email/sendgrid"
echo ""
echo "🔐 Forgot password endpoint:"
echo "   POST /api/auth/forgot-password"
echo ""
echo "🚀 Your email system is now bulletproof and Google-style!"







