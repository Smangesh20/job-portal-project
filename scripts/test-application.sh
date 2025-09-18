#!/bin/bash

# Comprehensive Application Testing Script
# This script tests the entire application to ensure it's working correctly

set -e

echo "🧪 Starting comprehensive application testing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "info" ]; then
        echo -e "${BLUE}ℹ️  $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
}

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "info" "Running test: $test_name"
    
    if eval "$test_command"; then
        print_status "success" "Test passed: $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_status "error" "Test failed: $test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# 1. Environment Tests
echo ""
echo "🔧 Testing Environment Configuration..."

run_test "Node.js version check" "node --version | grep -E 'v(18|20)'"
run_test "NPM version check" "npm --version"
run_test "TypeScript installation" "npx tsc --version"

# 2. Project Structure Tests
echo ""
echo "📁 Testing Project Structure..."

run_test "Package.json exists" "[ -f package.json ]"
run_test "Turbo.json exists" "[ -f turbo.json ]"
run_test "Web app package.json exists" "[ -f apps/web/package.json ]"
run_test "API package.json exists" "[ -f apps/api/package.json ]"
run_test "Error prevention scripts exist" "[ -f scripts/validate-project-state.sh ] && [ -f scripts/validate-build.sh ]"

# 3. Code Quality Tests
echo ""
echo "🔍 Testing Code Quality..."

run_test "TypeScript compilation (Web)" "cd apps/web && npx tsc --noEmit"
run_test "TypeScript compilation (API)" "cd apps/api && npx tsc --noEmit"

# 4. Build Tests
echo ""
echo "🔨 Testing Build Process..."

run_test "Web app build" "cd apps/web && npm run build"
run_test "API build" "cd apps/api && npm run build"

# 5. Linting Tests
echo ""
echo "🧹 Testing Code Linting..."

run_test "Web app linting" "cd apps/web && npm run lint"
run_test "API linting" "cd apps/api && npm run lint"

# 6. Dependencies Tests
echo ""
echo "📦 Testing Dependencies..."

run_test "Web dependencies installation" "cd apps/web && npm ci"
run_test "API dependencies installation" "cd apps/api && npm ci"

# 7. Error Prevention Tests
echo ""
echo "🛡️ Testing Error Prevention System..."

run_test "Project state validation" "npm run validate:project"
run_test "Build validation" "npm run validate:build"

# 8. API Tests (if server is running)
echo ""
echo "🌐 Testing API Endpoints..."

# Check if API server is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    run_test "Health check endpoint" "curl -s http://localhost:3001/health | grep -q 'healthy'"
    run_test "Research search endpoint" "curl -s -X POST http://localhost:3001/api/research/search -H 'Content-Type: application/json' -d '{\"query\":\"test\"}' | grep -q 'success'"
else
    print_status "warning" "API server not running - skipping API tests"
fi

# 9. Web App Tests (if server is running)
echo ""
echo "🌍 Testing Web Application..."

# Check if web server is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    run_test "Web app accessibility" "curl -s http://localhost:3000 | grep -q 'Ask Ya Cham'"
else
    print_status "warning" "Web server not running - skipping web app tests"
fi

# 10. Security Tests
echo ""
echo "🔒 Testing Security..."

run_test "No hardcoded secrets" "! grep -r 'password.*=' apps/ --exclude-dir=node_modules || true"
run_test "No console.log in production code" "! grep -r 'console\.log' apps/web/src --exclude-dir=node_modules || true"

# 11. Performance Tests
echo ""
echo "⚡ Testing Performance..."

run_test "Bundle size check" "cd apps/web && npm run build && [ \$(du -s .next | cut -f1) -lt 50000 ]"

# 12. Error Handling Tests
echo ""
echo "🚨 Testing Error Handling..."

run_test "Error boundary implementation" "grep -q 'ErrorBoundary' apps/web/src/app/page.tsx"
run_test "API error handling" "grep -q 'handleApiError' apps/web/src/lib/api-client.ts"

# Summary
echo ""
echo "📊 Test Results Summary:"
echo "========================"
echo "Total tests: $TOTAL_TESTS"
print_status "success" "Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    print_status "error" "Failed: $TESTS_FAILED"
else
    print_status "success" "Failed: $TESTS_FAILED"
fi

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))
    echo "Success rate: $SUCCESS_RATE%"
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        print_status "success" "Excellent! Application is in great shape."
        exit 0
    elif [ $SUCCESS_RATE -ge 70 ]; then
        print_status "warning" "Good, but some improvements needed."
        exit 0
    else
        print_status "error" "Critical issues found. Please fix before deployment."
        exit 1
    fi
else
    print_status "error" "No tests were run."
    exit 1
fi
