# Ask Ya Cham - Complete Deployment Guide

This comprehensive deployment guide covers all aspects of deploying the Ask Ya Cham platform in various environments, from development to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment](#development-environment)
- [Staging Environment](#staging-environment)
- [Production Environment](#production-environment)
- [Cloud Deployment](#cloud-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)
- [Security Checklist](#security-checklist)

## 🔧 Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 4 cores, 2.4 GHz
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Network**: 1 Gbps connection

#### Recommended Requirements
- **CPU**: 8 cores, 3.0 GHz
- **RAM**: 16 GB
- **Storage**: 500 GB NVMe SSD
- **Network**: 10 Gbps connection

### Software Dependencies

#### Required Software
- **Docker**: 24.0+ with Docker Compose 2.20+
- **Node.js**: 20.0.0+
- **npm**: 10.0.0+
- **Python**: 3.11+
- **PostgreSQL**: 15+
- **Redis**: 7+
- **Nginx**: 1.24+

#### Optional Software
- **Kubernetes**: 1.28+
- **Helm**: 3.12+
- **Terraform**: 1.6+
- **Ansible**: 6.0+

## 🚀 Development Environment

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/askyacham/platform.git
   cd platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your local configuration
   ```

4. **Start Development Services**
   ```bash
   # Using Docker Compose (Recommended)
   npm run docker:up
   
   # Or start services individually
   npm run dev
   ```

5. **Initialize Database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### Development Commands

```bash
# Development
npm run dev              # Start all services
npm run dev:web          # Start only frontend
npm run dev:api          # Start only backend API
npm run dev:ai           # Start only AI service

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database

# Testing
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # End-to-end tests

# Code Quality
npm run lint             # ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript check
npm run format           # Prettier formatting

# Docker
npm run docker:build     # Build images
npm run docker:up        # Start services
npm run docker:down      # Stop services
npm run docker:logs      # View logs
```

### Development Environment Variables

```env
# Development Configuration
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug

# Database (Local)
DATABASE_URL=postgresql://askyacham_user:secure_password_2024@localhost:5432/askyacham
REDIS_URL=redis://localhost:6379
MONGODB_URL=mongodb://localhost:27017/askyacham_docs
ELASTICSEARCH_URL=http://localhost:9200

# API Configuration
API_PORT=3001
API_HOST=0.0.0.0

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security (Development)
JWT_SECRET=dev-jwt-secret-key
ENCRYPTION_KEY=dev-encryption-key-32-chars

# AI Services (Optional for development)
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key

# Email (Development - Use Mailtrap or similar)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
```

## 🧪 Staging Environment

### Staging Setup

1. **Create Staging Environment**
   ```bash
   # Create staging branch
   git checkout -b staging
   
   # Deploy to staging
   ./scripts/deploy-staging.sh
   ```

2. **Staging Configuration**
   ```env
   # Staging Configuration
   NODE_ENV=staging
   DEBUG=false
   LOG_LEVEL=info
   
   # Database (Staging)
   DATABASE_URL=postgresql://staging_user:staging_pass@staging-db:5432/askyacham_staging
   REDIS_URL=redis://staging-redis:6379
   
   # API Configuration
   API_PORT=3001
   API_HOST=0.0.0.0
   
   # Frontend Configuration
   NEXT_PUBLIC_API_URL=https://api-staging.askyacham.com
   NEXT_PUBLIC_WS_URL=wss://api-staging.askyacham.com
   NEXT_PUBLIC_APP_URL=https://staging.askyacham.com
   
   # Security
   JWT_SECRET=staging-jwt-secret-key
   ENCRYPTION_KEY=staging-encryption-key-32-chars
   
   # External Services
   OPENAI_API_KEY=your-openai-key
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=your-sendgrid-user
   SMTP_PASS=your-sendgrid-pass
   ```

3. **Staging Deployment Script**
   ```bash
   #!/bin/bash
   # scripts/deploy-staging.sh
   
   set -e
   
   echo "🚀 Deploying to staging environment..."
   
   # Build and push Docker images
   docker build -t askyacham/web:staging ./apps/web
   docker build -t askyacham/api:staging ./apps/api
   docker build -t askyacham/ai-service:staging ./apps/ai-service
   
   docker push askyacham/web:staging
   docker push askyacham/api:staging
   docker push askyacham/ai-service:staging
   
   # Deploy to staging server
   ssh staging-server "docker-compose -f docker-compose.staging.yml pull"
   ssh staging-server "docker-compose -f docker-compose.staging.yml up -d"
   
   # Run database migrations
   ssh staging-server "docker-compose -f docker-compose.staging.yml exec api npm run db:migrate"
   
   echo "✅ Staging deployment completed!"
   ```

## 🏭 Production Environment

### Production Setup

#### 1. Infrastructure Preparation

```bash
# Create production infrastructure
terraform init
terraform plan -var-file=production.tfvars
terraform apply -var-file=production.tfvars
```

#### 2. Database Setup

```bash
# Create production database
createdb -h prod-db-server -U postgres askyacham_production

# Create database user
psql -h prod-db-server -U postgres -c "CREATE USER askyacham_user WITH PASSWORD 'secure_production_password';"
psql -h prod-db-server -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE askyacham_production TO askyacham_user;"

# Run migrations
DATABASE_URL=postgresql://askyacham_user:secure_production_password@prod-db-server:5432/askyacham_production npm run db:migrate
```

#### 3. Production Configuration

```env
# Production Configuration
NODE_ENV=production
DEBUG=false
LOG_LEVEL=warn

# Database (Production)
DATABASE_URL=postgresql://askyacham_user:secure_production_password@prod-db-server:5432/askyacham_production
REDIS_URL=redis://prod-redis-server:6379
MONGODB_URL=mongodb://askyacham_admin:secure_mongo_password@prod-mongo-server:27017/askyacham_docs?authSource=admin
ELASTICSEARCH_URL=http://prod-elasticsearch-server:9200

# API Configuration
API_PORT=3001
API_HOST=0.0.0.0

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.askyacham.com
NEXT_PUBLIC_WS_URL=wss://api.askyacham.com
NEXT_PUBLIC_APP_URL=https://askyacham.com

# Security (Production - Use strong secrets)
JWT_SECRET=your-super-secure-jwt-secret-key-2024
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-2024
ENCRYPTION_KEY=your-32-character-encryption-key
SESSION_SECRET=your-session-secret-key

# External Services
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=your-sendgrid-user
SMTP_PASS=your-sendgrid-pass

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ask-ya-cham-production

# Monitoring
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=your-ga-id
```

#### 4. Production Deployment Script

```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "🚀 Starting production deployment..."

# Build production images
echo "📦 Building Docker images..."
docker build -t askyacham/web:latest ./apps/web
docker build -t askyacham/api:latest ./apps/api
docker build -t askyacham/ai-service:latest ./apps/ai-service

# Tag for registry
docker tag askyacham/web:latest registry.askyacham.com/web:latest
docker tag askyacham/api:latest registry.askyacham.com/api:latest
docker tag askyacham/ai-service:latest registry.askyacham.com/ai-service:latest

# Push to registry
echo "📤 Pushing images to registry..."
docker push registry.askyacham.com/web:latest
docker push registry.askyacham.com/api:latest
docker push registry.askyacham.com/ai-service:latest

# Deploy to production
echo "🚀 Deploying to production servers..."
ansible-playbook -i inventory/production deploy.yml

# Health check
echo "🔍 Running health checks..."
./scripts/health-check.sh

echo "✅ Production deployment completed successfully!"
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. ECS Deployment

```yaml
# docker-compose.aws.yml
version: '3.8'

services:
  web:
    image: askyacham/web:latest
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.askyacham.com
    ports:
      - "3000:3000"
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  api:
    image: askyacham/api:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - "3001:3001"
    deploy:
      replicas: 5
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  ai-service:
    image: askyacham/ai-service:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "8000:8000"
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
```

#### 2. EKS Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: askyacham-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: askyacham-web
  template:
    metadata:
      labels:
        app: askyacham-web
    spec:
      containers:
      - name: web
        image: askyacham/web:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: askyacham-web-service
spec:
  selector:
    app: askyacham-web
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Google Cloud Deployment

#### 1. Cloud Run Deployment

```bash
# Deploy to Cloud Run
gcloud run deploy askyacham-web \
  --image gcr.io/askyacham/web:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10

gcloud run deploy askyacham-api \
  --image gcr.io/askyacham/api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 20

gcloud run deploy askyacham-ai-service \
  --image gcr.io/askyacham/ai-service:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 4 \
  --max-instances 5
```

#### 2. GKE Deployment

```bash
# Create GKE cluster
gcloud container clusters create askyacham-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-standard-4 \
  --disk-size 100GB \
  --disk-type pd-ssd

# Deploy application
kubectl apply -f k8s/
```

### Azure Deployment

#### 1. Container Instances

```bash
# Deploy to Azure Container Instances
az container create \
  --resource-group askyacham-rg \
  --name askyacham-web \
  --image askyacham.azurecr.io/web:latest \
  --cpu 1 \
  --memory 1 \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

#### 2. AKS Deployment

```bash
# Create AKS cluster
az aks create \
  --resource-group askyacham-rg \
  --name askyacham-cluster \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --generate-ssh-keys

# Deploy application
kubectl apply -f k8s/
```

## ☸️ Kubernetes Deployment

### 1. Namespace Setup

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: askyacham
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: askyacham-quota
  namespace: askyacham
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    persistentvolumeclaims: "10"
    pods: "50"
    services: "10"
```

### 2. ConfigMaps and Secrets

```yaml
# k8s/config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: askyacham-config
  namespace: askyacham
data:
  NODE_ENV: "production"
  API_PORT: "3001"
  LOG_LEVEL: "info"
---
apiVersion: v1
kind: Secret
metadata:
  name: askyacham-secrets
  namespace: askyacham
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  OPENAI_API_KEY: <base64-encoded-openai-key>
```

### 3. Database Deployment

```yaml
# k8s/database.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: askyacham
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: askyacham
        - name: POSTGRES_USER
          value: askyacham_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
```

### 4. Application Deployment

```yaml
# k8s/app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: askyacham-web
  namespace: askyacham
spec:
  replicas: 3
  selector:
    matchLabels:
      app: askyacham-web
  template:
    metadata:
      labels:
        app: askyacham-web
    spec:
      containers:
      - name: web
        image: askyacham/web:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: askyacham-config
        - secretRef:
            name: askyacham-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 5. Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: askyacham-ingress
  namespace: askyacham
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - askyacham.com
    - api.askyacham.com
    secretName: askyacham-tls
  rules:
  - host: askyacham.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: askyacham-web-service
            port:
              number: 80
  - host: api.askyacham.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: askyacham-api-service
            port:
              number: 80
```

### 6. Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: askyacham-web-hpa
  namespace: askyacham
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: askyacham-web
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 📊 Monitoring & Maintenance

### 1. Monitoring Stack

```yaml
# k8s/monitoring.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
```

### 2. Logging Stack

```yaml
# k8s/logging.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    metadata:
      labels:
        app: fluent-bit
    spec:
      containers:
      - name: fluent-bit
        image: fluent/fluent-bit:latest
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

### 3. Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

set -e

echo "🔍 Running health checks..."

# Check API health
echo "Checking API health..."
curl -f http://localhost:3001/health || exit 1

# Check AI service health
echo "Checking AI service health..."
curl -f http://localhost:8000/health || exit 1

# Check database connectivity
echo "Checking database connectivity..."
npm run db:health-check || exit 1

# Check Redis connectivity
echo "Checking Redis connectivity..."
redis-cli ping || exit 1

echo "✅ All health checks passed!"
```

### 4. Backup Script

```bash
#!/bin/bash
# scripts/backup.sh

set -e

BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Starting backup process..."

# Database backup
echo "Backing up database..."
pg_dump $DATABASE_URL > "$BACKUP_DIR/database.sql"

# Redis backup
echo "Backing up Redis..."
redis-cli --rdb "$BACKUP_DIR/redis.rdb"

# MongoDB backup
echo "Backing up MongoDB..."
mongodump --uri="$MONGODB_URL" --out="$BACKUP_DIR/mongodb"

# Compress backup
echo "Compressing backup..."
tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" .

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "$BACKUP_DIR.tar.gz" s3://askyacham-backups/

echo "✅ Backup completed successfully!"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check database logs
docker logs postgres-container

# Restart database service
docker-compose restart postgres
```

#### 2. Redis Connection Issues

```bash
# Check Redis connectivity
redis-cli ping

# Check Redis logs
docker logs redis-container

# Clear Redis cache
redis-cli FLUSHALL
```

#### 3. API Service Issues

```bash
# Check API logs
docker logs api-container

# Restart API service
docker-compose restart api

# Check API health
curl -f http://localhost:3001/health
```

#### 4. Frontend Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild application
npm run build
```

### Performance Issues

#### 1. Slow Database Queries

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Add database indexes
CREATE INDEX CONCURRENTLY idx_job_postings_status ON job_postings(status);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

#### 2. High Memory Usage

```bash
# Check memory usage
docker stats

# Restart services
docker-compose restart

# Scale services
docker-compose up --scale api=3
```

#### 3. Slow API Responses

```bash
# Enable API profiling
export DEBUG=express:*

# Check API metrics
curl http://localhost:3001/metrics

# Optimize database queries
npm run db:optimize
```

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] All environment variables are properly secured
- [ ] Database passwords are strong and unique
- [ ] JWT secrets are cryptographically secure
- [ ] SSL/TLS certificates are valid and up-to-date
- [ ] Firewall rules are properly configured
- [ ] Security headers are enabled
- [ ] Rate limiting is configured
- [ ] Input validation is implemented
- [ ] SQL injection protection is enabled
- [ ] XSS protection is enabled
- [ ] CSRF protection is enabled

### Post-Deployment Security

- [ ] Security scanning is performed
- [ ] Vulnerability assessment is completed
- [ ] Penetration testing is conducted
- [ ] Monitoring and alerting are configured
- [ ] Backup and recovery procedures are tested
- [ ] Incident response plan is in place
- [ ] Security updates are automated
- [ ] Access logs are monitored
- [ ] Failed login attempts are tracked
- [ ] Suspicious activity is detected

### Ongoing Security

- [ ] Regular security audits
- [ ] Automated vulnerability scanning
- [ ] Security patch management
- [ ] Access control reviews
- [ ] Security training for team
- [ ] Incident response drills
- [ ] Backup verification
- [ ] Disaster recovery testing

## 📞 Support

For deployment support and assistance:

- **Documentation**: [docs.askyacham.com](https://docs.askyacham.com)
- **Issues**: [GitHub Issues](https://github.com/askyacham/platform/issues)
- **Email**: support@askyacham.com
- **Slack**: [Ask Ya Cham Community](https://askyacham.slack.com)

---

**Note**: This deployment guide is regularly updated. Please check for the latest version before deploying to production.
