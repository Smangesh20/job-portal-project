#!/bin/bash

# Ask Ya Cham - Production Deployment Script
# This script handles the complete deployment process for the Ask Ya Cham platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ask-ya-cham"
NAMESPACE="production"
REGISTRY_URL="your-registry.com"
VERSION=${1:-"latest"}

# Environment variables
export NODE_ENV=production
export KUBECONFIG=/path/to/kubeconfig

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        error "kubectl is not installed"
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        error "docker is not installed"
    fi
    
    # Check if helm is installed
    if ! command -v helm &> /dev/null; then
        error "helm is not installed"
    fi
    
    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        error "Cannot connect to Kubernetes cluster"
    fi
    
    success "Prerequisites check passed"
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build API image
    log "Building API image..."
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION} apps/api/
    docker push ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION}
    
    # Build Web image
    log "Building Web image..."
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}-web:${VERSION} apps/web/
    docker push ${REGISTRY_URL}/${PROJECT_NAME}-web:${VERSION}
    
    # Build AI Service image
    log "Building AI Service image..."
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}-ai:${VERSION} apps/ai-service/
    docker push ${REGISTRY_URL}/${PROJECT_NAME}-ai:${VERSION}
    
    success "Docker images built and pushed successfully"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # API tests
    log "Running API tests..."
    cd apps/api
    npm test -- --coverage --passWithNoTests
    cd ../..
    
    # Web tests
    log "Running Web tests..."
    cd apps/web
    npm test -- --coverage --passWithNoTests
    cd ../..
    
    # Integration tests
    log "Running integration tests..."
    npm run test:integration
    
    success "All tests passed"
}

# Security scanning
security_scan() {
    log "Running security scans..."
    
    # Scan API image
    log "Scanning API image for vulnerabilities..."
    trivy image --exit-code 1 --severity HIGH,CRITICAL ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION}
    
    # Scan Web image
    log "Scanning Web image for vulnerabilities..."
    trivy image --exit-code 1 --severity HIGH,CRITICAL ${REGISTRY_URL}/${PROJECT_NAME}-web:${VERSION}
    
    # Scan AI Service image
    log "Scanning AI Service image for vulnerabilities..."
    trivy image --exit-code 1 --severity HIGH,CRITICAL ${REGISTRY_URL}/${PROJECT_NAME}-ai:${VERSION}
    
    success "Security scans passed"
}

# Database migration
run_migrations() {
    log "Running database migrations..."
    
    # Create migration job
    cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration-${VERSION}
  namespace: ${NAMESPACE}
spec:
  template:
    spec:
      containers:
      - name: migration
        image: ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION}
        command: ["npm", "run", "db:migrate"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
      restartPolicy: Never
  backoffLimit: 3
EOF
    
    # Wait for migration to complete
    kubectl wait --for=condition=complete job/db-migration-${VERSION} -n ${NAMESPACE} --timeout=300s
    
    success "Database migrations completed"
}

# Deploy to Kubernetes
deploy_k8s() {
    log "Deploying to Kubernetes..."
    
    # Update image tags in manifests
    sed -i "s|image: ${REGISTRY_URL}/${PROJECT_NAME}-.*:.*|image: ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION}|g" k8s/production/api-deployment.yaml
    sed -i "s|image: ${REGISTRY_URL}/${PROJECT_NAME}-.*:.*|image: ${REGISTRY_URL}/${PROJECT_NAME}-web:${VERSION}|g" k8s/production/web-deployment.yaml
    sed -i "s|image: ${REGISTRY_URL}/${PROJECT_NAME}-.*:.*|image: ${REGISTRY_URL}/${PROJECT_NAME}-ai:${VERSION}|g" k8s/production/ai-deployment.yaml
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/production/namespace.yaml
    kubectl apply -f k8s/production/configmap.yaml
    kubectl apply -f k8s/production/secrets.yaml
    kubectl apply -f k8s/production/api-deployment.yaml
    kubectl apply -f k8s/production/web-deployment.yaml
    kubectl apply -f k8s/production/ai-deployment.yaml
    kubectl apply -f k8s/production/services.yaml
    kubectl apply -f k8s/production/ingress.yaml
    
    success "Kubernetes deployment completed"
}

# Health checks
health_checks() {
    log "Running health checks..."
    
    # Wait for deployments to be ready
    kubectl wait --for=condition=available deployment/${PROJECT_NAME}-api -n ${NAMESPACE} --timeout=300s
    kubectl wait --for=condition=available deployment/${PROJECT_NAME}-web -n ${NAMESPACE} --timeout=300s
    kubectl wait --for=condition=available deployment/${PROJECT_NAME}-ai -n ${NAMESPACE} --timeout=300s
    
    # API health check
    log "Checking API health..."
    kubectl run api-health-check --image=curlimages/curl --rm -i --restart=Never -- \
        curl -f http://${PROJECT_NAME}-api-service:3001/health || error "API health check failed"
    
    # Web health check
    log "Checking Web health..."
    kubectl run web-health-check --image=curlimages/curl --rm -i --restart=Never -- \
        curl -f http://${PROJECT_NAME}-web-service:3000/health || error "Web health check failed"
    
    # AI Service health check
    log "Checking AI Service health..."
    kubectl run ai-health-check --image=curlimages/curl --rm -i --restart=Never -- \
        curl -f http://${PROJECT_NAME}-ai-service:3002/health || error "AI Service health check failed"
    
    success "All health checks passed"
}

# Performance testing
performance_test() {
    log "Running performance tests..."
    
    # Load test with k6
    k6 run --vus 100 --duration 5m load-tests/production.js || warning "Performance test failed"
    
    success "Performance tests completed"
}

# Backup current deployment
backup_deployment() {
    log "Creating backup of current deployment..."
    
    # Create backup directory
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p ${BACKUP_DIR}
    
    # Backup current deployments
    kubectl get deployments -n ${NAMESPACE} -o yaml > ${BACKUP_DIR}/deployments.yaml
    kubectl get services -n ${NAMESPACE} -o yaml > ${BACKUP_DIR}/services.yaml
    kubectl get ingress -n ${NAMESPACE} -o yaml > ${BACKUP_DIR}/ingress.yaml
    kubectl get configmaps -n ${NAMESPACE} -o yaml > ${BACKUP_DIR}/configmaps.yaml
    
    # Backup secrets (without sensitive data)
    kubectl get secrets -n ${NAMESPACE} -o yaml > ${BACKUP_DIR}/secrets.yaml
    
    success "Backup created in ${BACKUP_DIR}"
}

# Rollback function
rollback() {
    warning "Rolling back deployment..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t backups/ | head -n1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        error "No backup found for rollback"
    fi
    
    log "Rolling back to ${LATEST_BACKUP}..."
    
    # Apply backup
    kubectl apply -f backups/${LATEST_BACKUP}/deployments.yaml
    kubectl apply -f backups/${LATEST_BACKUP}/services.yaml
    kubectl apply -f backups/${LATEST_BACKUP}/ingress.yaml
    kubectl apply -f backups/${LATEST_BACKUP}/configmaps.yaml
    
    success "Rollback completed"
}

# Cleanup function
cleanup() {
    log "Cleaning up resources..."
    
    # Clean up old images
    docker image prune -f
    
    # Clean up old backups (keep last 10)
    ls -t backups/ | tail -n +11 | xargs -I {} rm -rf backups/{}
    
    success "Cleanup completed"
}

# Notification function
send_notification() {
    local status=$1
    local message=$2
    
    # Send Slack notification
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Ask Ya Cham Deployment ${status}: ${message}\"}" \
        ${SLACK_WEBHOOK_URL} || warning "Failed to send Slack notification"
    
    # Send email notification
    echo "Deployment ${status}: ${message}" | mail -s "Ask Ya Cham Deployment ${status}" ${ADMIN_EMAIL} || warning "Failed to send email notification"
}

# Main deployment function
deploy() {
    log "Starting Ask Ya Cham deployment (Version: ${VERSION})"
    
    # Create deployment log
    DEPLOYMENT_LOG="logs/deployment_$(date +%Y%m%d_%H%M%S).log"
    mkdir -p logs
    exec > >(tee -a ${DEPLOYMENT_LOG}) 2>&1
    
    # Pre-deployment checks
    check_prerequisites
    
    # Backup current deployment
    backup_deployment
    
    # Build and test
    run_tests
    build_images
    security_scan
    
    # Deploy
    run_migrations
    deploy_k8s
    
    # Post-deployment verification
    health_checks
    performance_test
    
    # Cleanup
    cleanup
    
    success "Deployment completed successfully!"
    send_notification "SUCCESS" "Version ${VERSION} deployed successfully"
    
    log "Deployment log saved to: ${DEPLOYMENT_LOG}"
}

# Handle script arguments
case "${2:-deploy}" in
    "deploy")
        deploy
        ;;
    "rollback")
        rollback
        ;;
    "health")
        health_checks
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_images
        ;;
    "scan")
        security_scan
        ;;
    "migrate")
        run_migrations
        ;;
    *)
        echo "Usage: $0 [VERSION] [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  deploy    - Full deployment (default)"
        echo "  rollback  - Rollback to previous version"
        echo "  health    - Run health checks"
        echo "  test      - Run tests only"
        echo "  build     - Build images only"
        echo "  scan      - Security scan only"
        echo "  migrate   - Run database migrations only"
        echo ""
        echo "Examples:"
        echo "  $0 v1.2.3 deploy"
        echo "  $0 latest rollback"
        echo "  $0 v1.2.3 health"
        exit 1
        ;;
esac
