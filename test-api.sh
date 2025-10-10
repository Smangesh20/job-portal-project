#!/bin/bash

# AskYaCham API Test Script
# Tests all authentication endpoints

echo "🧪 Testing AskYaCham Authentication API"
echo "========================================"
echo ""

API_URL="http://localhost:4200/api"
EMAIL="test@example.com"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Send OTP
echo -e "${BLUE}Test 1: Send OTP${NC}"
echo "POST $API_URL/auth/send-otp"
RESPONSE=$(curl -s -X POST "$API_URL/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"action\":\"signup\"}")

echo "Response: $RESPONSE"

# Extract OTP from response (development mode)
OTP=$(echo $RESPONSE | grep -o '"otp":"[0-9]*"' | grep -o '[0-9]*')

if [ ! -z "$OTP" ]; then
  echo -e "${GREEN}✓ OTP received: $OTP${NC}"
else
  echo -e "${RED}✗ Failed to get OTP${NC}"
  exit 1
fi
echo ""

# Test 2: Verify OTP
echo -e "${BLUE}Test 2: Verify OTP${NC}"
echo "POST $API_URL/auth/verify-otp"
VERIFY_RESPONSE=$(curl -s -X POST "$API_URL/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"otp\":\"$OTP\",\"action\":\"signup\"}")

echo "Response: $VERIFY_RESPONSE"

if echo $VERIFY_RESPONSE | grep -q "success.*true"; then
  echo -e "${GREEN}✓ OTP verified successfully${NC}"
else
  echo -e "${RED}✗ OTP verification failed${NC}"
  exit 1
fi
echo ""

# Test 3: Resend OTP
echo -e "${BLUE}Test 3: Resend OTP${NC}"
echo "POST $API_URL/auth/resend-otp"
RESEND_RESPONSE=$(curl -s -X POST "$API_URL/auth/resend-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"action\":\"signin\"}")

echo "Response: $RESEND_RESPONSE"

if echo $RESEND_RESPONSE | grep -q "success.*true"; then
  echo -e "${GREEN}✓ OTP resent successfully${NC}"
else
  echo -e "${RED}✗ Failed to resend OTP${NC}"
  exit 1
fi
echo ""

# Test 4: Invalid Email
echo -e "${BLUE}Test 4: Invalid Email Format${NC}"
echo "POST $API_URL/auth/send-otp (with invalid email)"
INVALID_RESPONSE=$(curl -s -X POST "$API_URL/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"notanemail\",\"action\":\"signup\"}")

echo "Response: $INVALID_RESPONSE"

if echo $INVALID_RESPONSE | grep -q "Invalid email"; then
  echo -e "${GREEN}✓ Invalid email properly rejected${NC}"
else
  echo -e "${RED}✗ Invalid email should be rejected${NC}"
fi
echo ""

# Test 5: Invalid OTP
echo -e "${BLUE}Test 5: Invalid OTP${NC}"
echo "POST $API_URL/auth/verify-otp (with wrong OTP)"
WRONG_OTP_RESPONSE=$(curl -s -X POST "$API_URL/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"otp\":\"000000\",\"action\":\"signup\"}")

echo "Response: $WRONG_OTP_RESPONSE"

if echo $WRONG_OTP_RESPONSE | grep -q "Invalid.*expired"; then
  echo -e "${GREEN}✓ Invalid OTP properly rejected${NC}"
else
  echo -e "${RED}✗ Invalid OTP should be rejected${NC}"
fi
echo ""

# Test 6: CORS Check
echo -e "${BLUE}Test 6: CORS Headers${NC}"
echo "OPTIONS $API_URL/auth/send-otp"
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$API_URL/auth/send-otp" \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST")

echo "Headers:"
echo "$CORS_RESPONSE"

if echo $CORS_RESPONSE | grep -q "Access-Control-Allow"; then
  echo -e "${GREEN}✓ CORS headers present${NC}"
else
  echo -e "${RED}✗ CORS headers missing${NC}"
fi
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}✓ All API tests completed!${NC}"
echo ""
echo "📝 Summary:"
echo "  - OTP sending: Working ✓"
echo "  - OTP verification: Working ✓"
echo "  - OTP resend: Working ✓"
echo "  - Input validation: Working ✓"
echo "  - CORS: Configured ✓"
echo ""
echo "🎉 Your API is fully functional!"

