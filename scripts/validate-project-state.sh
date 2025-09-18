#!/bin/bash

# Project State Validation Script
# This script validates the current state of the project to prevent common errors

set -e

echo "🔍 Validating project state..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
}

# Check for duplicate completion files
echo "Checking for duplicate completion files..."
COMPLETION_FILES=$(find . -name "*COMPLETION*" -o -name "*FINAL*" -o -name "*ULTIMATE*" -o -name "*PERFECTION*" -o -name "*DEAD_END*" | grep -v node_modules | grep -v archive | wc -l)

if [ $COMPLETION_FILES -gt 3 ]; then
    print_status "error" "Too many completion files found: $COMPLETION_FILES"
    echo "Found files:"
    find . -name "*COMPLETION*" -o -name "*FINAL*" -o -name "*ULTIMATE*" -o -name "*PERFECTION*" -o -name "*DEAD_END*" | grep -v node_modules | grep -v archive
    echo ""
    echo "Please consolidate completion status files into a single source of truth."
    exit 1
else
    print_status "success" "Completion files count acceptable: $COMPLETION_FILES"
fi

# Check for required files
echo "Checking for required files..."
REQUIRED_FILES=("package.json" "README.md" "docker-compose.yml" "turbo.json")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    print_status "error" "Required files missing: ${MISSING_FILES[*]}"
    exit 1
else
    print_status "success" "All required files present"
fi

# Check for package.json consistency
echo "Checking package.json consistency..."
if [ -f "package.json" ]; then
    # Check if main package.json has proper scripts
    if ! grep -q '"build"' package.json; then
        print_status "warning" "Main package.json missing build script"
    fi
    
    if ! grep -q '"test"' package.json; then
        print_status "warning" "Main package.json missing test script"
    fi
    
    if ! grep -q '"lint"' package.json; then
        print_status "warning" "Main package.json missing lint script"
    fi
fi

# Check for workspace consistency
echo "Checking workspace consistency..."
if [ -f "turbo.json" ]; then
    print_status "success" "Turbo.json found - monorepo setup detected"
    
    # Check if all workspace packages have proper structure
    for dir in apps/*/; do
        if [ -d "$dir" ]; then
            package_name=$(basename "$dir")
            if [ ! -f "$dir/package.json" ]; then
                print_status "error" "Package $package_name missing package.json"
                exit 1
            fi
        fi
    done
fi

# Check for environment files
echo "Checking environment configuration..."
if [ ! -f ".env.example" ]; then
    print_status "warning" "No .env.example file found"
fi

if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
    print_status "warning" "No environment file found (.env or .env.local)"
fi

# Check for git configuration
echo "Checking git configuration..."
if [ ! -d ".git" ]; then
    print_status "warning" "Not a git repository"
else
    # Check for .gitignore
    if [ ! -f ".gitignore" ]; then
        print_status "warning" "No .gitignore file found"
    fi
    
    # Check for uncommitted changes
    if ! git diff --quiet; then
        print_status "warning" "Uncommitted changes detected"
    fi
fi

# Check for TypeScript configuration
echo "Checking TypeScript configuration..."
TS_CONFIG_FOUND=false
for dir in apps/*/; do
    if [ -d "$dir" ] && [ -f "$dir/tsconfig.json" ]; then
        TS_CONFIG_FOUND=true
        break
    fi
done

if [ "$TS_CONFIG_FOUND" = false ]; then
    print_status "warning" "No TypeScript configuration found in workspace packages"
fi

# Check for test files
echo "Checking test coverage..."
TEST_FILES=$(find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" | grep -v node_modules | wc -l)
if [ $TEST_FILES -eq 0 ]; then
    print_status "warning" "No test files found"
else
    print_status "success" "Test files found: $TEST_FILES"
fi

# Check for documentation
echo "Checking documentation..."
DOC_FILES=$(find . -name "*.md" | grep -v node_modules | wc -l)
if [ $DOC_FILES -lt 3 ]; then
    print_status "warning" "Limited documentation found: $DOC_FILES markdown files"
else
    print_status "success" "Documentation files found: $DOC_FILES"
fi

# Check for Docker configuration
echo "Checking Docker configuration..."
DOCKER_FILES=$(find . -name "Dockerfile*" | wc -l)
if [ $DOCKER_FILES -eq 0 ]; then
    print_status "warning" "No Docker configuration found"
else
    print_status "success" "Docker files found: $DOCKER_FILES"
fi

# Check for CI/CD configuration
echo "Checking CI/CD configuration..."
if [ -d ".github/workflows" ]; then
    WORKFLOW_FILES=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
    if [ $WORKFLOW_FILES -gt 0 ]; then
        print_status "success" "CI/CD workflows found: $WORKFLOW_FILES"
    else
        print_status "warning" "No CI/CD workflows found"
    fi
else
    print_status "warning" "No CI/CD configuration found"
fi

# Summary
echo ""
echo "🎯 Project State Validation Summary:"
echo "=================================="

if [ $COMPLETION_FILES -le 3 ] && [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_status "success" "Project state validation PASSED"
    echo ""
    echo "✅ All critical checks passed"
    echo "✅ Project is in a valid state"
    echo "✅ Ready for development/deployment"
    exit 0
else
    print_status "error" "Project state validation FAILED"
    echo ""
    echo "❌ Critical issues found"
    echo "❌ Please fix the issues above before proceeding"
    exit 1
fi
