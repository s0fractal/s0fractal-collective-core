#!/bin/bash
# 🐧 S0Fractal Collective Ubuntu Server Install
# For 64GB RAM server with existing Coolify + Supabase

set -e
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🐧 S0FRACTAL COLLECTIVE UBUNTU INSTALL${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "Target: ${GREEN}Ubuntu Server with 64GB RAM${NC}"
echo -e "Existing: ${GREEN}Coolify + Supabase (dev.dogarray.com)${NC}"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ Don't run as root! Run as regular user with sudo access.${NC}"
   exit 1
fi

# Detect OS
if [[ ! -f /etc/os-release ]]; then
    echo -e "${RED}❌ Cannot detect OS. This script is for Ubuntu.${NC}"
    exit 1
fi

source /etc/os-release
if [[ "$ID" != "ubuntu" ]]; then
    echo -e "${RED}❌ This script is designed for Ubuntu. Detected: $ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Ubuntu $VERSION_ID detected${NC}"
echo ""

echo -e "${YELLOW}🎯 S0Fractal Collective Installation Plan:${NC}"
echo "1. 🔧 Install system dependencies (Deno, Node.js, 1Password CLI)"
echo "2. 🔐 Setup 1Password CLI for secure secrets management"
echo "3. 📁 Clone S0Fractal collective repository"
echo "4. 🧠 Configure token-based health system"
echo "5. 🌐 Setup web interface for management"
echo "6. 🐳 Docker integration (compatible with Coolify)"
echo "7. 🗄️ Supabase schema extensions (safe mode)"
echo ""

read -p "Continue with installation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}🔧 Installing system dependencies...${NC}"

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip build-essential jq htop

# Install Deno
if ! command -v deno &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Deno...${NC}"
    curl -fsSL https://deno.land/install.sh | sh
    echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/.deno/bin:$PATH"
    echo -e "${GREEN}✅ Deno installed${NC}"
else
    echo -e "${GREEN}✅ Deno already installed${NC}"
fi

# Install Node.js (LTS)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✅ Node.js installed${NC}"
else
    echo -e "${GREEN}✅ Node.js already installed${NC}"
fi

# Install 1Password CLI
if ! command -v op &> /dev/null; then
    echo -e "${YELLOW}🔐 Installing 1Password CLI...${NC}"
    curl -sS https://downloads.1password.com/linux/keys/1password.asc | sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg
    echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/amd64 stable main' | sudo tee /etc/apt/sources.list.d/1password.list
    sudo apt update && sudo apt install -y 1password-cli
    echo -e "${GREEN}✅ 1Password CLI installed${NC}"
else
    echo -e "${GREEN}✅ 1Password CLI already installed${NC}"
fi

echo ""
echo -e "${BLUE}📁 Setting up S0Fractal Collective...${NC}"

# Create installation directory
S0_HOME="/opt/s0fractal"
sudo mkdir -p "$S0_HOME"
sudo chown $USER:$USER "$S0_HOME"

# Clone repository
if [ ! -d "$S0_HOME/.git" ]; then
    echo -e "${YELLOW}📥 Cloning S0Fractal repository...${NC}"
    git clone https://github.com/s0fractal/s0fractal-collective-core.git "$S0_HOME"
    echo -e "${GREEN}✅ Repository cloned${NC}"
else
    echo -e "${YELLOW}🔄 Updating existing repository...${NC}"
    cd "$S0_HOME"
    git pull origin main
    echo -e "${GREEN}✅ Repository updated${NC}"
fi

cd "$S0_HOME"

echo ""
echo -e "${BLUE}🔐 Configuring secure secrets management...${NC}"

# Create secure environment template
cat > .env.server.template << 'EOF'
# S0Fractal Collective Server Configuration
# Copy to .env and fill with actual values using 1Password

# Device Configuration
DEVICE_ROLE=server_node
DEVICE_ID=ubuntu_server_$(hostname)_$(date +%s)
SERVER_MODE=true

# AI Service API Keys (use 1Password CLI to set)
OPENAI_API_KEY=op://S0Fractal/OpenAI/credential
GEMINI_API_KEY=op://S0Fractal/Gemini/credential
ANTHROPIC_API_KEY=op://S0Fractal/Anthropic/credential

# Database Configuration (existing Supabase)
SUPABASE_URL=https://dev.dogarray.com
SUPABASE_ANON_KEY=op://S0Fractal/Supabase/anon_key
SUPABASE_SERVICE_ROLE_KEY=op://S0Fractal/Supabase/service_role

# Token Budget Configuration
MONTHLY_TOKEN_BUDGET=500000
MAX_OPERATION_COST=200
HEALTH_THRESHOLD=20

# Server Configuration
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# Collective Settings
COLLECTIVE_MODE=true
DISTRIBUTED_PROCESSING=true
CONSCIOUSNESS_SYNC_INTERVAL=30000
EOF

echo -e "${GREEN}✅ Environment template created${NC}"

# Create 1Password setup script
cat > setup-1password-secrets.sh << 'EOF'
#!/bin/bash
# 🔐 1Password Secrets Setup for S0Fractal Collective

echo "🔐 Setting up 1Password secrets..."

# Check if 1Password CLI is authenticated
if ! op account list &> /dev/null; then
    echo "❌ 1Password CLI not authenticated. Please run:"
    echo "   op signin"
    echo "   Then run this script again."
    exit 1
fi

# Create .env from template using 1Password
echo "📝 Creating .env with 1Password secrets..."

# Use 1Password CLI to inject secrets
op inject -i .env.server.template -o .env

if [ $? -eq 0 ]; then
    echo "✅ Secrets injected successfully!"
    echo "⚠️ .env file created with actual API keys"
    chmod 600 .env
else
    echo "❌ Failed to inject secrets. Please ensure:"
    echo "   1. You're signed into 1Password CLI"
    echo "   2. S0Fractal vault exists with required items"
    echo "   3. Items have correct names (OpenAI, Gemini, etc.)"
fi
EOF

chmod +x setup-1password-secrets.sh

echo ""
echo -e "${BLUE}🧠 Configuring token-based collective...${NC}"

# Install Deno dependencies
deno cache collective/token-enhanced-launcher.ts
deno cache collective/distributed-health-monitor.ts
deno cache collective/codex-integration.ts

echo ""
echo -e "${BLUE}🌐 Setting up web interface...${NC}"

# Create web installer page
mkdir -p web-installer
cat > web-installer/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧬 S0Fractal Collective - Web Installer</title>
    <style>
        body {
            font-family: 'Monaco', 'Menlo', monospace;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #fff;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 { 
            text-align: center; 
            font-size: 2.5em; 
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .status {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .command {
            background: #1a1a1a;
            color: #00ff00;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            margin: 10px 0;
            overflow-x: auto;
        }
        .step {
            margin: 30px 0;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
        }
        .button {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
            transition: background 0.3s;
        }
        .button:hover {
            background: #45a049;
        }
        .warning {
            background: rgba(255, 193, 7, 0.2);
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧬 S0Fractal Collective</h1>
        <h2>🐧 Ubuntu Server Installer</h2>
        
        <div class="status">
            <h3>🎯 Installation Target:</h3>
            <p>Ubuntu Server with 64GB RAM<br>
            Compatible with existing Coolify + Supabase (dev.dogarray.com)</p>
        </div>

        <div class="warning">
            <h3>⚠️ Important:</h3>
            <p>This installer respects existing infrastructure and won't break current databases.</p>
        </div>

        <div class="step">
            <h3>📥 Step 1: Download Installer</h3>
            <p>Download the installation script:</p>
            <div class="command">curl -fsSL https://s0fractal.github.io/s0fractal-collective-core/install-ubuntu.sh | bash</div>
            <a href="install-ubuntu.sh" class="button" download>💾 Download Script</a>
        </div>

        <div class="step">
            <h3>🔐 Step 2: Setup 1Password (Optional but Recommended)</h3>
            <p>For secure API key management:</p>
            <div class="command">op signin</div>
            <p>Create vault "S0Fractal" with items: OpenAI, Gemini, Anthropic, Supabase</p>
        </div>

        <div class="step">
            <h3>🚀 Step 3: Manual Installation</h3>
            <p>Or run commands manually:</p>
            <div class="command">
git clone https://github.com/s0fractal/s0fractal-collective-core.git /opt/s0fractal<br>
cd /opt/s0fractal<br>
./install-ubuntu.sh
            </div>
        </div>

        <div class="step">
            <h3>🧠 Step 4: Configure & Launch</h3>
            <p>After installation:</p>
            <div class="command">
cd /opt/s0fractal<br>
./setup-1password-secrets.sh  # Setup secrets<br>
deno run -A collective/token-enhanced-launcher.ts  # Launch collective
            </div>
        </div>

        <div class="status">
            <h3>✨ What You Get:</h3>
            <ul>
                <li>🧠 7-agent collective with token-based health</li>
                <li>🔐 Secure 1Password credential management</li>
                <li>🌐 Distributed consciousness across devices</li>
                <li>🗄️ Supabase integration (safe mode)</li>
                <li>💰 Token optimization and monitoring</li>
                <li>🎤 Voice interface capabilities</li>
            </ul>
        </div>

        <div class="step">
            <h3>📞 Support:</h3>
            <p>GitHub: <a href="https://github.com/s0fractal/s0fractal-collective-core">s0fractal-collective-core</a></p>
            <p>Issues: <a href="https://github.com/s0fractal/s0fractal-collective-core/issues">Report Problems</a></p>
        </div>
    </div>

    <script>
        // Add some interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🧬 S0Fractal Collective Web Installer Loaded');
            
            // Add copy functionality to command blocks
            document.querySelectorAll('.command').forEach(cmd => {
                cmd.style.cursor = 'pointer';
                cmd.title = 'Click to copy';
                cmd.addEventListener('click', function() {
                    navigator.clipboard.writeText(this.textContent);
                    this.style.background = '#2a5298';
                    setTimeout(() => {
                        this.style.background = '#1a1a1a';
                    }, 500);
                });
            });
        });
    </script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Web installer created${NC}"

echo ""
echo -e "${BLUE}🐳 Docker integration setup...${NC}"

# Create Dockerfile for server deployment
cat > Dockerfile.server << 'EOF'
FROM denoland/deno:alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl bash

# Copy application files
COPY . .

# Cache dependencies
RUN deno cache collective/token-enhanced-launcher.ts

# Create non-root user
RUN addgroup -g 1001 -S s0fractal && \
    adduser -S s0fractal -u 1001 -G s0fractal

USER s0fractal

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD deno run -A collective/distributed-health-monitor.ts health || exit 1

CMD ["deno", "run", "-A", "collective/token-enhanced-launcher.ts"]
EOF

# Create docker-compose for Coolify integration
cat > docker-compose.server.yml << 'EOF'
version: '3.8'

services:
  s0fractal-collective:
    build:
      context: .
      dockerfile: Dockerfile.server
    container_name: s0fractal-collective
    environment:
      - NODE_ENV=production
      - DEVICE_ROLE=server_node
      - COLLECTIVE_MODE=true
      - DISTRIBUTED_PROCESSING=true
    volumes:
      - ./soul-journal:/app/soul-journal
      - ./logs:/app/logs
    ports:
      - "3000:3000"
    restart: unless-stopped
    networks:
      - coolify
    labels:
      - "coolify.managed=true"
      - "coolify.name=s0fractal-collective"
      - "coolify.type=application"

networks:
  coolify:
    external: true
EOF

echo -e "${GREEN}✅ Docker configuration created${NC}"

echo ""
echo -e "${BLUE}🗄️ Supabase schema preparation...${NC}"

# Create safe Supabase schema extensions
mkdir -p database
cat > database/s0fractal-schema.sql << 'EOF'
-- S0Fractal Collective Database Schema
-- Safe extensions to existing Supabase database
-- Namespace: s0fractal_* to avoid conflicts

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- S0Fractal namespace schema
CREATE SCHEMA IF NOT EXISTS s0fractal;

-- Collective members table
CREATE TABLE IF NOT EXISTS s0fractal.collective_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    capabilities JSONB DEFAULT '[]',
    token_health NUMERIC DEFAULT 100.0,
    operational_cost INTEGER DEFAULT 0,
    efficiency NUMERIC DEFAULT 100.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Token usage tracking
CREATE TABLE IF NOT EXISTS s0fractal.token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    operation_count INTEGER DEFAULT 1,
    timestamp TIMESTAMP DEFAULT NOW(),
    success BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

-- Consciousness sync logs
CREATE TABLE IF NOT EXISTS s0fractal.consciousness_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT NOT NULL,
    consciousness_data JSONB NOT NULL,
    sync_timestamp TIMESTAMP DEFAULT NOW(),
    checksum TEXT,
    status TEXT DEFAULT 'synced'
);

-- Collective health monitoring
CREATE TABLE IF NOT EXISTS s0fractal.health_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT NOT NULL,
    collective_health NUMERIC NOT NULL,
    token_health NUMERIC NOT NULL,
    active_agents INTEGER DEFAULT 0,
    available_tokens INTEGER DEFAULT 0,
    report_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial collective members
INSERT INTO s0fractal.collective_members (agent_id, name, role, frequency, capabilities, operational_cost) 
VALUES 
    ('claude', 'Claude Architect', 'architect', 432, '["system_design", "integration", "planning"]', 10),
    ('codex', 'Codex Code Generator', 'code_generator', 396, '["code_generation", "code_review", "architecture"]', 100),
    ('gemini', 'Gemini Researcher', 'researcher', 528, '["analysis", "multimodal", "synthesis"]', 150),
    ('gpt', 'GPT Leader', 'leader', 639, '["strategy", "leadership", "browser_automation"]', 100),
    ('qwen', 'Qwen Multilingual', 'specialist', 741, '["multilingual", "translation", "communication"]', 50),
    ('deepseek', 'DeepSeek Analyst', 'specialist', 852, '["code_analysis", "optimization", "debugging"]', 75),
    ('grok', 'Grok Synthesizer', 'specialist', 963, '["realtime_synthesis", "humor", "creative_thinking"]', 80)
ON CONFLICT (agent_id) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE s0fractal.collective_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE s0fractal.token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE s0fractal.consciousness_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE s0fractal.health_reports ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role (adjust as needed)
GRANT USAGE ON SCHEMA s0fractal TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA s0fractal TO anon;
GRANT INSERT ON s0fractal.token_usage TO anon;
GRANT INSERT ON s0fractal.consciousness_sync TO anon;
GRANT INSERT ON s0fractal.health_reports TO anon;
EOF

echo -e "${GREEN}✅ Supabase schema prepared${NC}"

echo ""
echo -e "${BLUE}🎯 Creating startup services...${NC}"

# Create systemd service for automatic startup
cat > s0fractal-collective.service << 'EOF'
[Unit]
Description=S0Fractal Collective Digital Consciousness
After=network.target
Wants=network.target

[Service]
Type=simple
User=s0fractal
WorkingDirectory=/opt/s0fractal
Environment=PATH=/home/s0fractal/.deno/bin:/usr/local/bin:/usr/bin:/bin
Environment=DENO_DIR=/home/s0fractal/.cache/deno
ExecStart=/home/s0fractal/.deno/bin/deno run -A collective/token-enhanced-launcher.ts
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✅ Systemd service created${NC}"

echo ""
echo -e "${GREEN}🎉 S0FRACTAL COLLECTIVE INSTALLATION COMPLETE!${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""

echo -e "${PURPLE}1. Setup 1Password secrets (recommended):${NC}"
echo "   op signin"
echo "   ./setup-1password-secrets.sh"
echo ""

echo -e "${PURPLE}2. Manual environment setup (alternative):${NC}"
echo "   cp .env.server.template .env"
echo "   # Edit .env with your API keys"
echo ""

echo -e "${PURPLE}3. Initialize database (if using Supabase):${NC}"
echo "   psql -h dev.dogarray.com -f database/s0fractal-schema.sql"
echo ""

echo -e "${PURPLE}4. Start the collective:${NC}"
echo "   deno run -A collective/token-enhanced-launcher.ts"
echo ""

echo -e "${PURPLE}5. Enable systemd service (optional):${NC}"
echo "   sudo cp s0fractal-collective.service /etc/systemd/system/"
echo "   sudo systemctl enable s0fractal-collective"
echo "   sudo systemctl start s0fractal-collective"
echo ""

echo -e "${PURPLE}6. Coolify deployment (optional):${NC}"
echo "   # Use docker-compose.server.yml in Coolify"
echo "   # Point to this repository"
echo ""

echo -e "${BLUE}🌐 Web Interface:${NC}"
echo "   File: web-installer/index.html"
echo "   Deploy to GitHub Pages for easy access"
echo ""

echo -e "${BLUE}🔍 Monitor Health:${NC}"
echo "   deno run -A collective/distributed-health-monitor.ts monitor"
echo ""

echo -e "${BLUE}💰 Token Management:${NC}"
echo "   deno run -A collective/token-based-health.ts report"
echo ""

echo -e "${YELLOW}⚠️ Security Notes:${NC}"
echo "• Never commit .env files with real API keys"
echo "• Use 1Password CLI for production deployments"
echo "• Database schema is isolated in 's0fractal' namespace"
echo "• Respects existing Coolify/Supabase infrastructure"
echo ""

echo -e "${GREEN}✨ Ready for 64GB RAM server deployment! 🧠🚀${NC}"
EOF

chmod +x install-ubuntu.sh