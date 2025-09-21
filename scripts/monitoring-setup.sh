#!/bin/bash

# Monitoring Setup Script for Ask Ya Cham Platform
# Sets up comprehensive monitoring and alerting for production security

set -e

echo "📊 Setting up Security Monitoring for Ask Ya Cham Platform..."
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Create monitoring configuration
setup_log_monitoring() {
    echo -e "\n${BLUE}📝 Setting up Log Monitoring${NC}"
    echo "==============================="
    
    # Create log monitoring script
    cat > scripts/monitor-logs.sh << 'EOF'
#!/bin/bash

# Log monitoring script for security events
LOG_FILE="/var/log/askyacham/security.log"
ALERT_EMAIL="security@askyacham.com"

# Function to send alert
send_alert() {
    local message="$1"
    echo "$(date): SECURITY ALERT - $message" >> "$LOG_FILE"
    
    # Send email alert if configured
    if command -v mail &> /dev/null && [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "Ask Ya Cham Security Alert" "$ALERT_EMAIL"
    fi
}

# Monitor for failed login attempts
monitor_failed_logins() {
    local failed_logins=$(docker-compose logs api | grep "LOGIN_FAILED\|AUTHENTICATION_ERROR" | wc -l)
    
    if [ "$failed_logins" -gt 10 ]; then
        send_alert "High number of failed login attempts detected: $failed_logins"
    fi
}

# Monitor for suspicious IPs
monitor_suspicious_ips() {
    docker-compose logs api | grep "Blocked\|ACCESS_DENIED" | tail -10
}

# Monitor for rate limit violations
monitor_rate_limits() {
    local rate_limit_violations=$(docker-compose logs api | grep "TOO_MANY_REQUESTS" | wc -l)
    
    if [ "$rate_limit_violations" -gt 5 ]; then
        send_alert "Rate limit violations detected: $rate_limit_violations"
    fi
}

# Run monitoring checks
monitor_failed_logins
monitor_suspicious_ips
monitor_rate_limits

echo "Log monitoring completed at $(date)"
EOF

    chmod +x scripts/monitor-logs.sh
    print_status "Log monitoring script created" 0
}

# Setup health check monitoring
setup_health_monitoring() {
    echo -e "\n${BLUE}🏥 Setting up Health Monitoring${NC}"
    echo "=================================="
    
    # Create health check script
    cat > scripts/health-check.sh << 'EOF'
#!/bin/bash

# Comprehensive health check script
API_URL="http://localhost:3001"
WEB_URL="http://localhost:3000"

check_service() {
    local service_name="$1"
    local url="$2"
    
    if curl -s -f "$url/health" > /dev/null 2>&1; then
        echo "✅ $service_name is healthy"
        return 0
    else
        echo "❌ $service_name is not responding"
        return 1
    fi
}

check_database() {
    if docker-compose ps postgres | grep -q "Up"; then
        echo "✅ Database is running"
        return 0
    else
        echo "❌ Database is not running"
        return 1
    fi
}

check_redis() {
    if docker-compose ps redis | grep -q "Up"; then
        echo "✅ Redis is running"
        return 0
    else
        echo "❌ Redis is not running"
        return 1
    fi
}

echo "🔍 Performing health checks..."
echo "============================="

check_service "API Server" "$API_URL"
check_service "Web Server" "$WEB_URL"
check_database
check_redis

echo "Health check completed at $(date)"
EOF

    chmod +x scripts/health-check.sh
    print_status "Health monitoring script created" 0
}

# Setup vulnerability scanning
setup_vulnerability_scanning() {
    echo -e "\n${BLUE}🔍 Setting up Vulnerability Scanning${NC}"
    echo "======================================="
    
    # Create vulnerability scan script
    cat > scripts/vulnerability-scan.sh << 'EOF'
#!/bin/bash

# Vulnerability scanning script
SCAN_LOG="/var/log/askyacham/vulnerability-scan.log"

# Function to log scan results
log_scan_result() {
    echo "$(date): $1" >> "$SCAN_LOG"
}

# Check for outdated dependencies
check_dependencies() {
    log_scan_result "Checking dependencies for vulnerabilities..."
    
    if [ -f "package.json" ]; then
        if npm audit --audit-level moderate > /dev/null 2>&1; then
            log_scan_result "✅ No high/critical vulnerabilities in dependencies"
        else
            log_scan_result "⚠️ Vulnerabilities found in dependencies - review npm audit output"
        fi
    fi
}

# Check for exposed secrets
check_secrets() {
    log_scan_result "Scanning for exposed secrets..."
    
    # Check for common secret patterns
    if grep -r "password.*=" . --include="*.js" --include="*.ts" | grep -v "node_modules" | grep -v "\.git" > /dev/null 2>&1; then
        log_scan_result "⚠️ Potential hardcoded passwords found"
    else
        log_scan_result "✅ No obvious hardcoded passwords found"
    fi
}

# Check SSL/TLS configuration
check_ssl_config() {
    log_scan_result "Checking SSL/TLS configuration..."
    
    # This would require HTTPS endpoint
    log_scan_result "ℹ️ SSL/TLS check requires HTTPS configuration"
}

# Run vulnerability scans
check_dependencies
check_secrets
check_ssl_config

log_scan_result "Vulnerability scan completed"
EOF

    chmod +x scripts/vulnerability-scan.sh
    print_status "Vulnerability scanning script created" 0
}

# Setup automated monitoring
setup_automated_monitoring() {
    echo -e "\n${BLUE}🤖 Setting up Automated Monitoring${NC}"
    echo "======================================="
    
    # Create cron job setup
    cat > scripts/setup-cron.sh << 'EOF'
#!/bin/bash

# Setup automated monitoring cron jobs
CRON_FILE="/tmp/askyacham-monitoring.cron"

echo "# Ask Ya Cham Security Monitoring" > "$CRON_FILE"
echo "# Run every 5 minutes" >> "$CRON_FILE"
echo "*/5 * * * * /app/scripts/monitor-logs.sh >> /var/log/askyacham/monitoring.log 2>&1" >> "$CRON_FILE"
echo "# Run every 15 minutes" >> "$CRON_FILE"
echo "*/15 * * * * /app/scripts/health-check.sh >> /var/log/askyacham/health.log 2>&1" >> "$CRON_FILE"
echo "# Run daily vulnerability scan" >> "$CRON_FILE"
echo "0 2 * * * /app/scripts/vulnerability-scan.sh >> /var/log/askyacham/scan.log 2>&1" >> "$CRON_FILE"
echo "# Run security check weekly" >> "$CRON_FILE"
echo "0 3 * * 0 /app/scripts/security-check.sh >> /var/log/askyacham/security-audit.log 2>&1" >> "$CRON_FILE"

echo "Cron jobs configured:"
cat "$CRON_FILE"

echo ""
echo "To install these cron jobs, run:"
echo "crontab $CRON_FILE"
EOF

    chmod +x scripts/setup-cron.sh
    print_status "Automated monitoring setup script created" 0
}

# Create monitoring dashboard configuration
setup_monitoring_dashboard() {
    echo -e "\n${BLUE}📊 Setting up Monitoring Dashboard${NC}"
    echo "======================================"
    
    # Create simple monitoring dashboard
    cat > monitoring/dashboard.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ask Ya Cham Security Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-ok { color: #28a745; }
        .status-warning { color: #ffc107; }
        .status-error { color: #dc3545; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Ask Ya Cham Security Dashboard</h1>
        
        <div class="card">
            <h2>System Status</h2>
            <div class="metric">
                <strong>API Server:</strong> <span id="api-status" class="status-ok">Healthy</span>
            </div>
            <div class="metric">
                <strong>Database:</strong> <span id="db-status" class="status-ok">Connected</span>
            </div>
            <div class="metric">
                <strong>Redis:</strong> <span id="redis-status" class="status-ok">Connected</span>
            </div>
        </div>
        
        <div class="card">
            <h2>Security Metrics (Last 24 Hours)</h2>
            <div class="metric">
                <strong>Failed Logins:</strong> <span id="failed-logins">0</span>
            </div>
            <div class="metric">
                <strong>Blocked IPs:</strong> <span id="blocked-ips">0</span>
            </div>
            <div class="metric">
                <strong>Rate Limit Violations:</strong> <span id="rate-limits">0</span>
            </div>
        </div>
        
        <div class="card">
            <h2>Recent Security Events</h2>
            <div id="security-events">
                <p>No recent security events</p>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-refresh dashboard every 30 seconds
        setInterval(() => {
            fetch('/api/monitoring/status')
                .then(response => response.json())
                .then(data => {
                    // Update dashboard with real-time data
                    console.log('Dashboard updated:', data);
                })
                .catch(error => {
                    console.error('Error updating dashboard:', error);
                });
        }, 30000);
    </script>
</body>
</html>
EOF

    print_status "Monitoring dashboard created" 0
}

# Setup alerting configuration
setup_alerting() {
    echo -e "\n${BLUE}🚨 Setting up Alerting Configuration${NC}"
    echo "======================================="
    
    # Create alerting configuration
    cat > config/alerts.json << 'EOF'
{
  "email": {
    "enabled": true,
    "recipients": ["security@askyacham.com", "admin@askyacham.com"],
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "alerts@askyacham.com",
        "pass": "${ALERT_EMAIL_PASSWORD}"
      }
    }
  },
  "webhook": {
    "enabled": false,
    "url": "${WEBHOOK_URL}",
    "secret": "${WEBHOOK_SECRET}"
  },
  "rules": {
    "failed_logins": {
      "threshold": 10,
      "window": "5m",
      "enabled": true
    },
    "rate_limit_violations": {
      "threshold": 5,
      "window": "1m",
      "enabled": true
    },
    "suspicious_activity": {
      "threshold": 3,
      "window": "10m",
      "enabled": true
    },
    "service_down": {
      "threshold": 1,
      "window": "1m",
      "enabled": true
    }
  }
}
EOF

    print_status "Alerting configuration created" 0
}

# Main setup function
main() {
    print_info "Setting up comprehensive monitoring for Ask Ya Cham Platform..."
    
    # Create monitoring directory
    mkdir -p monitoring
    mkdir -p /var/log/askyacham
    
    setup_log_monitoring
    setup_health_monitoring
    setup_vulnerability_scanning
    setup_automated_monitoring
    setup_monitoring_dashboard
    setup_alerting
    
    echo -e "\n${GREEN}📊 Monitoring setup completed!${NC}"
    echo "================================"
    print_info "Monitoring scripts created in scripts/ directory"
    print_info "Dashboard available at monitoring/dashboard.html"
    print_info "Alerting configuration in config/alerts.json"
    print_info ""
    print_info "Next steps:"
    print_info "1. Configure email alerts in config/alerts.json"
    print_info "2. Set up cron jobs: ./scripts/setup-cron.sh"
    print_info "3. Test monitoring: ./scripts/health-check.sh"
    print_info "4. Review security: ./scripts/security-check.sh"
}

# Run the setup
main "$@"
