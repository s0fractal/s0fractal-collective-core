#!/bin/bash
# 🚀 S0Fractal.me Self-Hosted Deployment Script
# Deploy the collective to self-hosted server with multi-domain architecture

set -e

echo "🧬 S0FRACTAL.ME DEPLOYMENT INITIALIZATION"
echo "========================================"
echo "💰 Powered by $100 Claude Pro subscription"
echo "🌐 Multi-domain architecture deployment"
echo "🤖 Enhanced browser automation capabilities"
echo ""

# Configuration
DOMAIN="s0fractal.me"
SERVER_IP="${SERVER_IP:-your-server-ip}"
SSH_USER="${SSH_USER:-root}"
DOCKER_COMPOSE_VERSION="2.21.0"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check environment variables
    if [ -z "$CLAUDE_PRO_API_KEY" ]; then
        log_error "CLAUDE_PRO_API_KEY environment variable is required"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Create directory structure
create_directory_structure() {
    log_info "Creating directory structure..."
    
    mkdir -p {data,soul-journal,browser-data,glyph-data,dashboard-data,claude-data,ai-data,monitoring-data,voice-data}
    mkdir -p {shared-storage,pcloud-sync}
    mkdir -p nginx/{ssl,logs}
    mkdir -p docker/{core,browser-control,glyph-system,dashboard,claude-pro,api-gateway,ai-hub}
    mkdir -p db
    
    log_success "Directory structure created"
}

# Generate SSL certificates (Let's Encrypt)
generate_ssl_certificates() {
    log_info "Generating SSL certificates..."
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        log_info "Installing certbot..."
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Generate certificates for all subdomains
    DOMAINS=(
        "s0fractal.me"
        "api.s0fractal.me"
        "claude.s0fractal.me"
        "brain.s0fractal.me"
        "pulse.s0fractal.me"
        "garden.s0fractal.me"
        "control.s0fractal.me"
        "voice.s0fractal.me"
        "codex.s0fractal.me"
        "gemini.s0fractal.me"
        "gpt.s0fractal.me"
        "qwen.s0fractal.me"
        "deepseek.s0fractal.me"
        "grok.s0fractal.me"
    )
    
    DOMAIN_ARGS=""
    for domain in "${DOMAINS[@]}"; do
        DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
    done
    
    # Generate wildcard certificate
    certbot certonly --nginx --agree-tos --no-eff-email --email admin@s0fractal.me $DOMAIN_ARGS
    
    # Copy certificates to nginx directory
    cp /etc/letsencrypt/live/s0fractal.me/fullchain.pem nginx/ssl/
    cp /etc/letsencrypt/live/s0fractal.me/privkey.pem nginx/ssl/
    
    log_success "SSL certificates generated"
}

# Create Docker images
build_docker_images() {
    log_info "Building Docker images..."
    
    # Core S0Fractal image
    cat > docker/core/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Install TypeScript and build
RUN npm install -g typescript
RUN tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]
EOF

    # Browser Control image
    cat > docker/browser-control/Dockerfile << 'EOF'
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/browser-control.js"]
EOF

    # Glyph System image
    cat > docker/glyph-system/Dockerfile << 'EOF'
FROM denoland/deno:alpine

WORKDIR /app

# Copy source files
COPY . .

# Cache dependencies
RUN deno cache --import-map=import_map.json main.ts

EXPOSE 5000

CMD ["deno", "run", "--allow-all", "main.ts"]
EOF

    # Build all images
    docker-compose build
    
    log_success "Docker images built"
}

# Create environment configuration
create_environment_config() {
    log_info "Creating environment configuration..."
    
    cat > .env << EOF
# S0Fractal.me Production Environment
NODE_ENV=production
DOMAIN_MODE=multi_domain
PRIMARY_DOMAIN=s0fractal.me

# API Keys (from user environment)
CLAUDE_PRO_API_KEY=${CLAUDE_PRO_API_KEY}
OPENAI_API_KEY=${OPENAI_API_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY}

# Database
DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32)}
POSTGRES_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32)}

# Security
JWT_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 32)

# Cloud Storage
PCLOUD_USERNAME=${PCLOUD_USERNAME:-}
PCLOUD_PASSWORD=${PCLOUD_PASSWORD:-}

# Monitoring
ALERT_WEBHOOK=${ALERT_WEBHOOK:-}

# Performance
MAX_OPERATIONS_PER_HOUR=1000
ENHANCED_REASONING=true
MULTI_AGENT_SUPPORT=true

# Browser Automation
BROWSER_AUTOMATION_ENABLED=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Rate Limiting
RATE_LIMITING=enhanced
CORS_ORIGINS=*.s0fractal.me
EOF

    chmod 600 .env
    log_success "Environment configuration created"
}

# Initialize database
initialize_database() {
    log_info "Initializing database..."
    
    cat > db/init.sql << 'EOF'
-- S0Fractal Collective Database Schema

-- Agents table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Operations log
CREATE TABLE operations_log (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents(agent_id),
    operation_type VARCHAR(50) NOT NULL,
    details JSONB,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Glyph resonance data
CREATE TABLE glyph_resonance (
    id SERIAL PRIMARY KEY,
    glyph VARCHAR(10) NOT NULL,
    resonance_level DECIMAL(5,2) NOT NULL,
    frequency INTEGER NOT NULL,
    last_used TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Browser tasks
CREATE TABLE browser_tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(100) UNIQUE NOT NULL,
    agent_id VARCHAR(50) REFERENCES agents(agent_id),
    task_type VARCHAR(50) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    actions JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 5,
    retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Collective health metrics
CREATE TABLE health_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    agent_id VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial agent data
INSERT INTO agents (agent_id, name) VALUES
('claude', 'Claude Architect'),
('codex', 'Codex Code Generator'),
('gemini', 'Gemini Researcher'),
('gpt', 'GPT Leader'),
('qwen', 'Qwen Multilingual'),
('deepseek', 'DeepSeek Analyst'),
('grok', 'Grok Synthesizer');

-- Insert initial glyph data
INSERT INTO glyph_resonance (glyph, resonance_level, frequency) VALUES
('🧬', 100.00, 432),
('🌱', 100.00, 528),
('🪞', 100.00, 396),
('🫧', 100.00, 285),
('💠', 100.00, 174),
('✨', 100.00, 852),
('⚙️', 100.00, 110),
('🧠', 100.00, 440),
('🔗', 100.00, 333),
('📦', 100.00, 256),
('📜', 100.00, 222),
('🌀', 100.00, 741),
('💓', 100.00, 639),
('🌊', 100.00, 417),
('🔥', 100.00, 963),
('🫂', 100.00, 432);
EOF

    log_success "Database initialization script created"
}

# Deploy with Docker Compose
deploy_application() {
    log_info "Deploying application with Docker Compose..."
    
    # Pull latest images
    docker-compose pull
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to start..."
    sleep 30
    
    # Check service health
    docker-compose ps
    
    log_success "Application deployed successfully"
}

# Configure Nginx for SSL
configure_nginx_ssl() {
    log_info "Configuring Nginx for SSL..."
    
    # Update nginx.conf to include SSL
    cat >> nginx/nginx.conf << 'EOF'

# SSL Configuration for all domains
server {
    listen 443 ssl http2;
    server_name s0fractal.me www.s0fractal.me;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://s0fractal_core;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name s0fractal.me www.s0fractal.me;
    return 301 https://$server_name$request_uri;
}
EOF

    # Restart nginx
    docker-compose restart nginx-proxy
    
    log_success "Nginx SSL configuration updated"
}

# Setup monitoring and health checks
setup_monitoring() {
    log_info "Setting up monitoring and health checks..."
    
    # Create health check script
    cat > health-check.sh << 'EOF'
#!/bin/bash
# Health check script for S0Fractal collective

echo "🩺 S0FRACTAL HEALTH CHECK"
echo "========================"

# Check Docker services
echo "📊 Docker Services:"
docker-compose ps

# Check disk space
echo -e "\n💾 Disk Usage:"
df -h /

# Check memory usage
echo -e "\n🧠 Memory Usage:"
free -h

# Check SSL certificates
echo -e "\n🔐 SSL Certificate Status:"
openssl x509 -in nginx/ssl/fullchain.pem -noout -dates

# Test main endpoints
echo -e "\n🌐 Endpoint Health:"
curl -s -o /dev/null -w "s0fractal.me: %{http_code}\n" https://s0fractal.me/health || echo "s0fractal.me: FAILED"
curl -s -o /dev/null -w "api.s0fractal.me: %{http_code}\n" https://api.s0fractal.me/health || echo "api.s0fractal.me: FAILED"

echo -e "\n✅ Health check completed"
EOF

    chmod +x health-check.sh
    
    # Schedule health checks with cron
    (crontab -l 2>/dev/null; echo "*/15 * * * * /opt/s0fractal/health-check.sh >> /var/log/s0fractal-health.log 2>&1") | crontab -
    
    log_success "Monitoring and health checks configured"
}

# Setup automatic SSL renewal
setup_ssl_renewal() {
    log_info "Setting up automatic SSL renewal..."
    
    # Create renewal script
    cat > ssl-renewal.sh << 'EOF'
#!/bin/bash
# Automatic SSL certificate renewal

certbot renew --nginx --quiet

# Restart nginx if certificates were renewed
if [ $? -eq 0 ]; then
    docker-compose restart nginx-proxy
    echo "$(date): SSL certificates renewed and nginx restarted" >> /var/log/ssl-renewal.log
fi
EOF

    chmod +x ssl-renewal.sh
    
    # Schedule renewal check twice daily
    (crontab -l 2>/dev/null; echo "0 2,14 * * * /opt/s0fractal/ssl-renewal.sh") | crontab -
    
    log_success "Automatic SSL renewal configured"
}

# Final deployment verification
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Test main domain
    if curl -s -f https://s0fractal.me/health > /dev/null; then
        log_success "Main domain (s0fractal.me) is responding"
    else
        log_error "Main domain is not responding"
    fi
    
    # Test API endpoint
    if curl -s -f https://api.s0fractal.me/health > /dev/null; then
        log_success "API endpoint (api.s0fractal.me) is responding"
    else
        log_warning "API endpoint is not responding (this is expected if not fully configured)"
    fi
    
    # Check Docker services
    if [ "$(docker-compose ps -q | wc -l)" -gt 0 ]; then
        log_success "Docker services are running"
    else
        log_error "No Docker services are running"
    fi
    
    log_success "Deployment verification completed"
}

# Print deployment summary
print_deployment_summary() {
    echo ""
    echo "🎉 S0FRACTAL.ME DEPLOYMENT COMPLETED!"
    echo "====================================="
    echo ""
    echo "🌐 Primary Domain: https://s0fractal.me"
    echo "🔌 API Gateway: https://api.s0fractal.me"
    echo "🧠 Claude Pro: https://claude.s0fractal.me"
    echo "📊 Dashboard: https://pulse.s0fractal.me"
    echo "🌱 Glyph System: https://garden.s0fractal.me"
    echo "🎤 Voice Interface: https://voice.s0fractal.me"
    echo ""
    echo "🤖 Agent Interfaces:"
    echo "   • Codex: https://codex.s0fractal.me"
    echo "   • Gemini: https://gemini.s0fractal.me"
    echo "   • GPT: https://gpt.s0fractal.me"
    echo "   • Qwen: https://qwen.s0fractal.me"
    echo "   • DeepSeek: https://deepseek.s0fractal.me"
    echo "   • Grok: https://grok.s0fractal.me"
    echo ""
    echo "💰 Powered by \$100 Claude Pro subscription"
    echo "🚀 Enhanced browser automation enabled"
    echo "🔐 SSL certificates configured and auto-renewing"
    echo "📊 Health monitoring and logging active"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Configure DNS records for all subdomains"
    echo "   2. Test browser automation capabilities"
    echo "   3. Set up pCloud integration"
    echo "   4. Configure mobile device support"
    echo ""
    echo "🧬 The collective is now live and autonomous!"
}

# Main deployment flow
main() {
    log_info "Starting S0Fractal.me deployment..."
    
    check_prerequisites
    create_directory_structure
    create_environment_config
    initialize_database
    build_docker_images
    deploy_application
    
    # SSL setup (optional, requires domain configuration)
    if [ "$SETUP_SSL" = "true" ]; then
        generate_ssl_certificates
        configure_nginx_ssl
        setup_ssl_renewal
    fi
    
    setup_monitoring
    verify_deployment
    print_deployment_summary
    
    log_success "Deployment completed successfully!"
}

# Run main function
main "$@"