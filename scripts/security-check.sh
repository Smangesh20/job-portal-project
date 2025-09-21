#!/bin/bash

# Security Check Script for Ask Ya Cham Platform
# This script performs comprehensive security checks for production deployment

set -e

echo "🔒 Starting Security Check for Ask Ya Cham Platform..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running in production environment
check_environment() {
    echo -e "\n${BLUE}🔍 Environment Check${NC}"
    echo "=================="
    
    if [ "$NODE_ENV" = "production" ]; then
        print_status "Production environment detected" 0
    else
        print_warning "Not running in production environment"
    fi
    
    # Check for sensitive environment variables
    if [ -z "$JWT_SECRET" ]; then
        print_status "JWT_SECRET not exposed" 1
    else
        print_status "JWT_SECRET is set" 0
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        print_status "DATABASE_URL not exposed" 1
    else
        print_status "DATABASE_URL is set" 0
    fi
}

# Check security headers
check_security_headers() {
    echo -e "\n${BLUE}🛡️  Security Headers Check${NC}"
    echo "=========================="
    
    # Test localhost if available
    if command -v curl &> /dev/null; then
        echo "Testing security headers..."
        
        # Check if API is running
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            HEADERS=$(curl -s -I http://localhost:3001/health)
            
            if echo "$HEADERS" | grep -q "X-Frame-Options"; then
                print_status "X-Frame-Options header present" 0
            else
                print_status "X-Frame-Options header missing" 1
            fi
            
            if echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
                print_status "X-Content-Type-Options header present" 0
            else
                print_status "X-Content-Type-Options header missing" 1
            fi
            
            if echo "$HEADERS" | grep -q "Strict-Transport-Security"; then
                print_status "HSTS header present" 0
            else
                print_warning "HSTS header missing (HTTPS required)"
            fi
            
        else
            print_warning "API server not running - cannot test headers"
        fi
    else
        print_warning "curl not available - cannot test security headers"
    fi
}

# Check for exposed debug information
check_debug_exposure() {
    echo -e "\n${BLUE}🐛 Debug Information Check${NC}"
    echo "============================"
    
    # Check for debug endpoints
    if [ "$NODE_ENV" = "production" ]; then
        print_status "Debug endpoints should be disabled in production" 0
        
        # Check if debug environment variables are set
        if [ -z "$DEBUG" ]; then
            print_status "DEBUG environment variable not set" 0
        else
            print_status "DEBUG environment variable is set (potential security risk)" 1
        fi
        
        if [ -z "$NODE_ENV" ] || [ "$NODE_ENV" = "development" ]; then
            print_status "NODE_ENV should be 'production'" 1
        else
            print_status "NODE_ENV is correctly set to production" 0
        fi
    fi
}

# Check file permissions
check_file_permissions() {
    echo -e "\n${BLUE}📁 File Permissions Check${NC}"
    echo "==========================="
    
    # Check for sensitive files
    SENSITIVE_FILES=(
        ".env"
        "package.json"
        "package-lock.json"
        "yarn.lock"
        "docker-compose.yml"
        "Dockerfile"
    )
    
    for file in "${SENSITIVE_FILES[@]}"; do
        if [ -f "$file" ]; then
            PERMS=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%A" "$file" 2>/dev/null)
            if [ "$PERMS" -gt 644 ]; then
                print_status "$file permissions are too permissive ($PERMS)" 1
            else
                print_status "$file permissions are secure ($PERMS)" 0
            fi
        fi
    done
}

# Check for common vulnerabilities
check_vulnerabilities() {
    echo -e "\n${BLUE}🔍 Vulnerability Check${NC}"
    echo "======================="
    
    # Check for hardcoded secrets
    if grep -r "password.*=" . --include="*.js" --include="*.ts" --include="*.json" | grep -v "node_modules" | grep -v "\.git" > /dev/null 2>&1; then
        print_status "Potential hardcoded passwords found" 1
        print_info "Review files for hardcoded credentials"
    else
        print_status "No obvious hardcoded passwords found" 0
    fi
    
    # Check for test credentials in production
    if [ "$NODE_ENV" = "production" ]; then
        if grep -r "test@example.com" . --include="*.js" --include="*.ts" --include="*.tsx" | grep -v "node_modules" | grep -v "\.git" > /dev/null 2>&1; then
            print_status "Test credentials found in production code" 1
        else
            print_status "No test credentials in production code" 0
        fi
    fi
}

# Check dependencies for vulnerabilities
check_dependencies() {
    echo -e "\n${BLUE}📦 Dependency Security Check${NC}"
    echo "================================"
    
    if command -v npm &> /dev/null; then
        if [ -f "package.json" ]; then
            print_info "Checking for known vulnerabilities..."
            if npm audit --audit-level moderate > /dev/null 2>&1; then
                print_status "No high or critical vulnerabilities found" 0
            else
                print_warning "Vulnerabilities found - run 'npm audit' for details"
            fi
        fi
    else
        print_warning "npm not available - cannot check dependencies"
    fi
}

# Check SSL/TLS configuration
check_ssl() {
    echo -e "\n${BLUE}🔐 SSL/TLS Check${NC}"
    echo "=================="
    
    if command -v openssl &> /dev/null; then
        print_info "SSL/TLS check requires HTTPS endpoint"
        print_info "Configure SSL certificates for production deployment"
    else
        print_warning "openssl not available - cannot check SSL configuration"
    fi
}

# Check database security
check_database_security() {
    echo -e "\n${BLUE}🗄️  Database Security Check${NC}"
    echo "============================="
    
    if [ -n "$DATABASE_URL" ]; then
        # Check if database URL contains default credentials
        if echo "$DATABASE_URL" | grep -q "admin:admin\|root:root\|user:password"; then
            print_status "Default database credentials detected" 1
        else
            print_status "Database credentials appear secure" 0
        fi
        
        # Check if database URL is exposed in logs
        if [ "$NODE_ENV" = "production" ]; then
            print_status "Database URL should not be logged in production" 0
        fi
    else
        print_warning "DATABASE_URL not set - cannot check database security"
    fi
}

# Generate security report
generate_report() {
    echo -e "\n${BLUE}📊 Security Report Summary${NC}"
    echo "============================"
    
    echo "Security check completed at: $(date)"
    echo "Environment: ${NODE_ENV:-'not set'}"
    echo "Platform: $(uname -s)"
    
    print_info "For detailed security recommendations, see PRODUCTION_SECURITY_GUIDE.md"
}

# Main execution
main() {
    check_environment
    check_security_headers
    check_debug_exposure
    check_file_permissions
    check_vulnerabilities
    check_dependencies
    check_ssl
    check_database_security
    generate_report
    
    echo -e "\n${GREEN}🔒 Security check completed!${NC}"
    echo "================================"
    print_info "Review any warnings or failures above"
    print_info "For additional security measures, see PRODUCTION_SECURITY_GUIDE.md"
}

# Run the security check
main "$@"