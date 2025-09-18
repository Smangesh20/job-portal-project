#!/bin/bash

# Ask Ya Cham - Health Check Script
# Comprehensive health monitoring for all platform components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="production"
TIMEOUT=30
RETRY_COUNT=3

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    return 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    return 0
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    return 1
}

# Health check functions
check_kubernetes_cluster() {
    log "Checking Kubernetes cluster health..."
    
    if ! kubectl cluster-info &> /dev/null; then
        error "Cannot connect to Kubernetes cluster"
        return 1
    fi
    
    # Check cluster nodes
    local unhealthy_nodes=$(kubectl get nodes --no-headers | grep -v Ready | wc -l)
    if [ $unhealthy_nodes -gt 0 ]; then
        warning "Found $unhealthy_nodes unhealthy nodes"
        kubectl get nodes
    else
        success "All nodes are healthy"
    fi
    
    # Check cluster resources
    local resource_usage=$(kubectl top nodes --no-headers 2>/dev/null || echo "Metrics not available")
    if [ "$resource_usage" != "Metrics not available" ]; then
        log "Node resource usage:"
        kubectl top nodes
    fi
    
    return 0
}

check_namespace() {
    log "Checking namespace health..."
    
    if ! kubectl get namespace $NAMESPACE &> /dev/null; then
        error "Namespace $NAMESPACE does not exist"
        return 1
    fi
    
    success "Namespace $NAMESPACE exists"
    return 0
}

check_deployments() {
    log "Checking deployment health..."
    
    local deployments=("ask-ya-cham-api" "ask-ya-cham-web" "ask-ya-cham-ai")
    local all_healthy=true
    
    for deployment in "${deployments[@]}"; do
        log "Checking deployment: $deployment"
        
        # Check if deployment exists
        if ! kubectl get deployment $deployment -n $NAMESPACE &> /dev/null; then
            error "Deployment $deployment not found"
            all_healthy=false
            continue
        fi
        
        # Check deployment status
        local ready_replicas=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
        local desired_replicas=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.replicas}')
        
        if [ "$ready_replicas" != "$desired_replicas" ]; then
            error "Deployment $deployment: $ready_replicas/$desired_replicas replicas ready"
            all_healthy=false
        else
            success "Deployment $deployment: All replicas ready"
        fi
        
        # Check pod health
        local unhealthy_pods=$(kubectl get pods -l app=$deployment -n $NAMESPACE --no-headers | grep -v Running | wc -l)
        if [ $unhealthy_pods -gt 0 ]; then
            warning "Found $unhealthy_pods unhealthy pods for $deployment"
            kubectl get pods -l app=$deployment -n $NAMESPACE
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        success "All deployments are healthy"
        return 0
    else
        error "Some deployments are unhealthy"
        return 1
    fi
}

check_services() {
    log "Checking service health..."
    
    local services=("ask-ya-cham-api-service" "ask-ya-cham-web-service" "ask-ya-cham-ai-service")
    local all_healthy=true
    
    for service in "${services[@]}"; do
        log "Checking service: $service"
        
        if ! kubectl get service $service -n $NAMESPACE &> /dev/null; then
            error "Service $service not found"
            all_healthy=false
            continue
        fi
        
        # Check service endpoints
        local endpoints=$(kubectl get endpoints $service -n $NAMESPACE -o jsonpath='{.subsets[*].addresses[*].ip}' 2>/dev/null || echo "")
        if [ -z "$endpoints" ]; then
            error "Service $service has no endpoints"
            all_healthy=false
        else
            success "Service $service has endpoints: $endpoints"
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        success "All services are healthy"
        return 0
    else
        error "Some services are unhealthy"
        return 1
    fi
}

check_ingress() {
    log "Checking ingress health..."
    
    if ! kubectl get ingress ask-ya-cham-ingress -n $NAMESPACE &> /dev/null; then
        error "Ingress not found"
        return 1
    fi
    
    # Check ingress status
    local ingress_status=$(kubectl get ingress ask-ya-cham-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[*].ip}' 2>/dev/null || echo "")
    if [ -n "$ingress_status" ]; then
        success "Ingress is healthy with IP: $ingress_status"
    else
        warning "Ingress IP not yet assigned"
    fi
    
    return 0
}

check_database() {
    log "Checking database health..."
    
    # Check if database pod is running
    local db_pods=$(kubectl get pods -l app=postgresql -n $NAMESPACE --no-headers | grep Running | wc -l)
    if [ $db_pods -eq 0 ]; then
        error "No database pods are running"
        return 1
    fi
    
    # Test database connection
    kubectl run db-health-check --image=postgres:13 --rm -i --restart=Never -- \
        psql $DATABASE_URL -c "SELECT 1;" &> /dev/null || {
        error "Database connection test failed"
        return 1
    }
    
    success "Database is healthy"
    return 0
}

check_redis() {
    log "Checking Redis health..."
    
    # Check if Redis pod is running
    local redis_pods=$(kubectl get pods -l app=redis -n $NAMESPACE --no-headers | grep Running | wc -l)
    if [ $redis_pods -eq 0 ]; then
        error "No Redis pods are running"
        return 1
    fi
    
    # Test Redis connection
    kubectl run redis-health-check --image=redis:6 --rm -i --restart=Never -- \
        redis-cli -h redis-service ping | grep -q PONG || {
        error "Redis connection test failed"
        return 1
    }
    
    success "Redis is healthy"
    return 0
}

check_api_endpoints() {
    log "Checking API endpoint health..."
    
    local endpoints=(
        "http://ask-ya-cham-api-service:3001/health"
        "http://ask-ya-cham-api-service:3001/api/health"
        "http://ask-ya-cham-api-service:3001/api/auth/health"
    )
    local all_healthy=true
    
    for endpoint in "${endpoints[@]}"; do
        log "Checking endpoint: $endpoint"
        
        kubectl run api-endpoint-check --image=curlimages/curl --rm -i --restart=Never -- \
            curl -f -s --max-time $TIMEOUT $endpoint > /dev/null || {
            error "Endpoint $endpoint is not responding"
            all_healthy=false
        }
        
        if [ "$all_healthy" = true ]; then
            success "Endpoint $endpoint is healthy"
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        success "All API endpoints are healthy"
        return 0
    else
        error "Some API endpoints are unhealthy"
        return 1
    fi
}

check_web_endpoints() {
    log "Checking Web endpoint health..."
    
    local endpoints=(
        "http://ask-ya-cham-web-service:3000/health"
        "http://ask-ya-cham-web-service:3000/"
    )
    local all_healthy=true
    
    for endpoint in "${endpoints[@]}"; do
        log "Checking endpoint: $endpoint"
        
        kubectl run web-endpoint-check --image=curlimages/curl --rm -i --restart=Never -- \
            curl -f -s --max-time $TIMEOUT $endpoint > /dev/null || {
            error "Endpoint $endpoint is not responding"
            all_healthy=false
        }
        
        if [ "$all_healthy" = true ]; then
            success "Endpoint $endpoint is healthy"
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        success "All Web endpoints are healthy"
        return 0
    else
        error "Some Web endpoints are unhealthy"
        return 1
    fi
}

check_ai_service() {
    log "Checking AI Service health..."
    
    local endpoints=(
        "http://ask-ya-cham-ai-service:3002/health"
        "http://ask-ya-cham-ai-service:3002/api/health"
    )
    local all_healthy=true
    
    for endpoint in "${endpoints[@]}"; do
        log "Checking endpoint: $endpoint"
        
        kubectl run ai-endpoint-check --image=curlimages/curl --rm -i --restart=Never -- \
            curl -f -s --max-time $TIMEOUT $endpoint > /dev/null || {
            error "Endpoint $endpoint is not responding"
            all_healthy=false
        }
        
        if [ "$all_healthy" = true ]; then
            success "Endpoint $endpoint is healthy"
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        success "AI Service is healthy"
        return 0
    else
        error "AI Service is unhealthy"
        return 1
    fi
}

check_external_services() {
    log "Checking external services..."
    
    local all_healthy=true
    
    # Check SMTP service
    log "Checking SMTP service..."
    kubectl run smtp-check --image=alpine --rm -i --restart=Never -- \
        nc -zv $SMTP_HOST $SMTP_PORT &> /dev/null || {
        error "SMTP service is not accessible"
        all_healthy=false
    }
    
    if [ "$all_healthy" = true ]; then
        success "SMTP service is accessible"
    fi
    
    # Check external APIs (if any)
    # Add checks for third-party services here
    
    if [ "$all_healthy" = true ]; then
        success "All external services are healthy"
        return 0
    else
        error "Some external services are unhealthy"
        return 1
    fi
}

check_resource_usage() {
    log "Checking resource usage..."
    
    # Check pod resource usage
    log "Pod resource usage:"
    kubectl top pods -n $NAMESPACE --no-headers 2>/dev/null || warning "Metrics not available"
    
    # Check node resource usage
    log "Node resource usage:"
    kubectl top nodes --no-headers 2>/dev/null || warning "Metrics not available"
    
    # Check for resource warnings
    local resource_warnings=$(kubectl get events -n $NAMESPACE --field-selector type=Warning --no-headers | wc -l)
    if [ $resource_warnings -gt 0 ]; then
        warning "Found $resource_warnings resource warnings"
        kubectl get events -n $NAMESPACE --field-selector type=Warning --sort-by='.lastTimestamp'
    else
        success "No resource warnings found"
    fi
    
    return 0
}

check_logs() {
    log "Checking for error logs..."
    
    local deployments=("ask-ya-cham-api" "ask-ya-cham-web" "ask-ya-cham-ai")
    local error_count=0
    
    for deployment in "${deployments[@]}"; do
        log "Checking logs for $deployment..."
        
        # Check for error logs in the last 10 minutes
        local errors=$(kubectl logs -l app=$deployment -n $NAMESPACE --since=10m | grep -i error | wc -l)
        if [ $errors -gt 0 ]; then
            warning "Found $errors errors in $deployment logs"
            error_count=$((error_count + errors))
        else
            success "No errors found in $deployment logs"
        fi
    done
    
    if [ $error_count -eq 0 ]; then
        success "No errors found in application logs"
        return 0
    else
        warning "Found $error_count total errors in logs"
        return 1
    fi
}

check_security() {
    log "Checking security status..."
    
    # Check for security events
    local security_events=$(kubectl get events -n $NAMESPACE --field-selector reason=FailedMount,reason=FailedScheduling --no-headers | wc -l)
    if [ $security_events -gt 0 ]; then
        warning "Found $security_events security-related events"
        kubectl get events -n $NAMESPACE --field-selector reason=FailedMount,reason=FailedScheduling --sort-by='.lastTimestamp'
    else
        success "No security events found"
    fi
    
    # Check pod security context
    log "Checking pod security contexts..."
    kubectl get pods -n $NAMESPACE -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.securityContext.runAsNonRoot}{"\n"}{end}' | \
        grep -v "true" && warning "Some pods are running as root" || success "All pods are running as non-root"
    
    return 0
}

generate_health_report() {
    log "Generating health report..."
    
    local report_file="health-reports/health-report-$(date +%Y%m%d_%H%M%S).txt"
    mkdir -p health-reports
    
    {
        echo "Ask Ya Cham Health Report"
        echo "Generated: $(date)"
        echo "=================================="
        echo ""
        
        echo "Kubernetes Cluster:"
        kubectl cluster-info
        echo ""
        
        echo "Node Status:"
        kubectl get nodes
        echo ""
        
        echo "Pod Status:"
        kubectl get pods -n $NAMESPACE
        echo ""
        
        echo "Service Status:"
        kubectl get services -n $NAMESPACE
        echo ""
        
        echo "Deployment Status:"
        kubectl get deployments -n $NAMESPACE
        echo ""
        
        echo "Resource Usage:"
        kubectl top pods -n $NAMESPACE 2>/dev/null || echo "Metrics not available"
        kubectl top nodes 2>/dev/null || echo "Metrics not available"
        echo ""
        
        echo "Recent Events:"
        kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -20
        echo ""
        
    } > $report_file
    
    log "Health report saved to: $report_file"
    return 0
}

# Main health check function
main() {
    log "Starting comprehensive health check..."
    
    local overall_status=0
    
    # Infrastructure checks
    check_kubernetes_cluster || overall_status=1
    check_namespace || overall_status=1
    check_deployments || overall_status=1
    check_services || overall_status=1
    check_ingress || overall_status=1
    
    # Service checks
    check_database || overall_status=1
    check_redis || overall_status=1
    check_external_services || overall_status=1
    
    # Application checks
    check_api_endpoints || overall_status=1
    check_web_endpoints || overall_status=1
    check_ai_service || overall_status=1
    
    # Monitoring checks
    check_resource_usage || overall_status=1
    check_logs || overall_status=1
    check_security || overall_status=1
    
    # Generate report
    generate_health_report
    
    # Final status
    if [ $overall_status -eq 0 ]; then
        success "All health checks passed!"
        exit 0
    else
        error "Some health checks failed!"
        exit 1
    fi
}

# Handle script arguments
case "${1:-all}" in
    "all")
        main
        ;;
    "cluster")
        check_kubernetes_cluster
        ;;
    "deployments")
        check_deployments
        ;;
    "services")
        check_services
        ;;
    "database")
        check_database
        ;;
    "redis")
        check_redis
        ;;
    "api")
        check_api_endpoints
        ;;
    "web")
        check_web_endpoints
        ;;
    "ai")
        check_ai_service
        ;;
    "resources")
        check_resource_usage
        ;;
    "logs")
        check_logs
        ;;
    "security")
        check_security
        ;;
    "report")
        generate_health_report
        ;;
    *)
        echo "Usage: $0 [CHECK_TYPE]"
        echo ""
        echo "Check Types:"
        echo "  all         - Run all health checks (default)"
        echo "  cluster     - Check Kubernetes cluster"
        echo "  deployments - Check deployments"
        echo "  services    - Check services"
        echo "  database    - Check database"
        echo "  redis       - Check Redis"
        echo "  api         - Check API endpoints"
        echo "  web         - Check Web endpoints"
        echo "  ai          - Check AI service"
        echo "  resources   - Check resource usage"
        echo "  logs        - Check logs"
        echo "  security    - Check security"
        echo "  report      - Generate health report"
        echo ""
        echo "Examples:"
        echo "  $0 all"
        echo "  $0 api"
        echo "  $0 database"
        exit 1
        ;;
esac
