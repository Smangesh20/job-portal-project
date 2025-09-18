#!/bin/bash

# Build Validation Script
# This script validates that all packages can be built successfully

set -e

echo "🔨 Validating build process..."

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

# Function to check if a directory has a package.json
has_package_json() {
    [ -f "$1/package.json" ]
}

# Function to check if a package has build script
has_build_script() {
    [ -f "$1/package.json" ] && grep -q '"build"' "$1/package.json"
}

# Function to run build for a package
build_package() {
    local package_dir=$1
    local package_name=$(basename "$package_dir")
    
    print_status "info" "Building package: $package_name"
    
    cd "$package_dir"
    
    # Check if package.json exists
    if ! has_package_json "."; then
        print_status "error" "No package.json found in $package_name"
        return 1
    fi
    
    # Check if build script exists
    if ! has_build_script "."; then
        print_status "warning" "No build script found in $package_name, skipping"
        cd - > /dev/null
        return 0
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "info" "Installing dependencies for $package_name"
        npm install --silent
    fi
    
    # Run build
    print_status "info" "Running build for $package_name"
    if npm run build; then
        print_status "success" "Build successful for $package_name"
        cd - > /dev/null
        return 0
    else
        print_status "error" "Build failed for $package_name"
        cd - > /dev/null
        return 1
    fi
}

# Function to run type check for a package
type_check_package() {
    local package_dir=$1
    local package_name=$(basename "$package_dir")
    
    print_status "info" "Type checking package: $package_name"
    
    cd "$package_dir"
    
    # Check if package.json exists
    if ! has_package_json "."; then
        print_status "error" "No package.json found in $package_name"
        return 1
    fi
    
    # Check if type-check script exists
    if ! grep -q '"type-check"' package.json; then
        print_status "warning" "No type-check script found in $package_name, skipping"
        cd - > /dev/null
        return 0
    fi
    
    # Run type check
    print_status "info" "Running type check for $package_name"
    if npm run type-check; then
        print_status "success" "Type check successful for $package_name"
        cd - > /dev/null
        return 0
    else
        print_status "error" "Type check failed for $package_name"
        cd - > /dev/null
        return 1
    fi
}

# Function to run lint for a package
lint_package() {
    local package_dir=$1
    local package_name=$(basename "$package_dir")
    
    print_status "info" "Linting package: $package_name"
    
    cd "$package_dir"
    
    # Check if package.json exists
    if ! has_package_json "."; then
        print_status "error" "No package.json found in $package_name"
        return 1
    fi
    
    # Check if lint script exists
    if ! grep -q '"lint"' package.json; then
        print_status "warning" "No lint script found in $package_name, skipping"
        cd - > /dev/null
        return 0
    fi
    
    # Run lint
    print_status "info" "Running lint for $package_name"
    if npm run lint; then
        print_status "success" "Lint successful for $package_name"
        cd - > /dev/null
        return 0
    else
        print_status "error" "Lint failed for $package_name"
        cd - > /dev/null
        return 1
    fi
}

# Track build results
BUILD_FAILURES=0
TYPE_CHECK_FAILURES=0
LINT_FAILURES=0
TOTAL_PACKAGES=0

# Start from project root
PROJECT_ROOT=$(pwd)

# Check if we're in a monorepo
if [ -f "turbo.json" ]; then
    print_status "info" "Monorepo detected, using Turbo for builds"
    
    # Install dependencies at root level
    if [ ! -d "node_modules" ]; then
        print_status "info" "Installing root dependencies"
        npm install --silent
    fi
    
    # Run turbo build
    print_status "info" "Running turbo build"
    if npx turbo build; then
        print_status "success" "Turbo build successful"
    else
        print_status "error" "Turbo build failed"
        BUILD_FAILURES=1
    fi
    
    # Run turbo type-check
    print_status "info" "Running turbo type-check"
    if npx turbo type-check; then
        print_status "success" "Turbo type-check successful"
    else
        print_status "error" "Turbo type-check failed"
        TYPE_CHECK_FAILURES=1
    fi
    
    # Run turbo lint
    print_status "info" "Running turbo lint"
    if npx turbo lint; then
        print_status "success" "Turbo lint successful"
    else
        print_status "error" "Turbo lint failed"
        LINT_FAILURES=1
    fi
    
else
    print_status "info" "Standard project detected, building packages individually"
    
    # Build packages in apps directory
    if [ -d "apps" ]; then
        for package_dir in apps/*/; do
            if [ -d "$package_dir" ]; then
                TOTAL_PACKAGES=$((TOTAL_PACKAGES + 1))
                
                # Build package
                if ! build_package "$package_dir"; then
                    BUILD_FAILURES=$((BUILD_FAILURES + 1))
                fi
                
                # Type check package
                if ! type_check_package "$package_dir"; then
                    TYPE_CHECK_FAILURES=$((TYPE_CHECK_FAILURES + 1))
                fi
                
                # Lint package
                if ! lint_package "$package_dir"; then
                    LINT_FAILURES=$((LINT_FAILURES + 1))
                fi
            fi
        done
    fi
    
    # Build packages in packages directory
    if [ -d "packages" ]; then
        for package_dir in packages/*/; do
            if [ -d "$package_dir" ]; then
                TOTAL_PACKAGES=$((TOTAL_PACKAGES + 1))
                
                # Build package
                if ! build_package "$package_dir"; then
                    BUILD_FAILURES=$((BUILD_FAILURES + 1))
                fi
                
                # Type check package
                if ! type_check_package "$package_dir"; then
                    TYPE_CHECK_FAILURES=$((TYPE_CHECK_FAILURES + 1))
                fi
                
                # Lint package
                if ! lint_package "$package_dir"; then
                    LINT_FAILURES=$((LINT_FAILURES + 1))
                fi
            fi
        done
    fi
    
    # Build root package if it has build script
    if has_build_script "."; then
        TOTAL_PACKAGES=$((TOTAL_PACKAGES + 1))
        
        # Build root package
        if ! build_package "."; then
            BUILD_FAILURES=$((BUILD_FAILURES + 1))
        fi
        
        # Type check root package
        if ! type_check_package "."; then
            TYPE_CHECK_FAILURES=$((TYPE_CHECK_FAILURES + 1))
        fi
        
        # Lint root package
        if ! lint_package "."; then
            LINT_FAILURES=$((LINT_FAILURES + 1))
        fi
    fi
fi

# Summary
echo ""
echo "🎯 Build Validation Summary:"
echo "============================"
echo "Total packages processed: $TOTAL_PACKAGES"
echo "Build failures: $BUILD_FAILURES"
echo "Type check failures: $TYPE_CHECK_FAILURES"
echo "Lint failures: $LINT_FAILURES"

if [ $BUILD_FAILURES -eq 0 ] && [ $TYPE_CHECK_FAILURES -eq 0 ] && [ $LINT_FAILURES -eq 0 ]; then
    print_status "success" "Build validation PASSED"
    echo ""
    echo "✅ All packages built successfully"
    echo "✅ All type checks passed"
    echo "✅ All lint checks passed"
    echo "✅ Project is ready for deployment"
    exit 0
else
    print_status "error" "Build validation FAILED"
    echo ""
    echo "❌ Some packages failed validation"
    echo "❌ Please fix the issues above before proceeding"
    exit 1
fi
