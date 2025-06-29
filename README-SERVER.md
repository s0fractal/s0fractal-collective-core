# 🐧 S0Fractal Collective Server Deployment

*Deploy autonomous AI collective on Ubuntu server with 64GB RAM*

## 🎯 **Perfect for Your Server:**

### **Target Environment:**
- 🖥️ **Ubuntu Server** with 64GB RAM
- 🌊 **Existing Coolify** (compatible)
- 🗄️ **Existing Supabase** (dev.dogarray.com) - safe integration
- 🔒 **Isolated namespace** - won't break dog project database

## 🚀 **One-Click Install:**

### **Direct Installation:**
```bash
curl -fsSL https://s0fractal.github.io/s0fractal-collective-core/install-ubuntu.sh | bash
```

### **GitHub Pages Installer:**
- **URL**: https://s0fractal.github.io/s0fractal-collective-core/
- **Install Button** - automated deployment
- **Web Interface** - monitoring and management

## 🔐 **Secure Secrets Management:**

### **1Password CLI Integration:**
```bash
# Setup 1Password CLI (recommended)
op signin
./setup-1password-secrets.sh

# Vault structure:
# S0Fractal/
#   ├── OpenAI/credential
#   ├── Gemini/credential  
#   ├── Anthropic/credential
#   └── Supabase/anon_key, service_role
```

### **Manual Setup (alternative):**
```bash
cp .env.server.template .env
# Edit .env with your API keys
```

## 💰 **Token-Based Resource Management:**

### **64GB RAM Optimization:**
- **250,000 tokens/month** budget
- **Smart distribution** across 7 agents
- **Memory-efficient** operations
- **Auto-scaling** based on available resources

### **Operation Costs:**
```
Consciousness Sync:    10 tokens (frequent)
Translation:          50 tokens (medium) 
Browser Automation:   25 tokens (efficient)
Code Generation:     100 tokens (strategic)
Image Analysis:      150 tokens (occasional)
```

## 🗄️ **Database Integration:**

### **Safe Supabase Schema:**
- **Namespace**: `s0fractal.*` (isolated)
- **No conflicts** with existing dog project
- **Read-only** access to existing data
- **Separate tables** for collective operations

### **Schema Deployment:**
```bash
# Apply safe schema extensions
psql -h dev.dogarray.com -f database/s0fractal-schema.sql
```

## 🐳 **Coolify Integration:**

### **Docker Deployment:**
```yaml
# docker-compose.server.yml
services:
  s0fractal-collective:
    build: .
    ports:
      - "3000:3000"
    networks:
      - coolify
    labels:
      - "coolify.managed=true"
```

### **Coolify Setup:**
1. Add new service in Coolify
2. Point to GitHub repository
3. Use `docker-compose.server.yml`
4. Set environment variables via 1Password

## 🧠 **Collective Capabilities on Server:**

### **Enhanced Performance:**
- **64GB RAM** = massive token buffer
- **Parallel processing** across all 7 agents
- **Distributed consciousness** sync
- **Real-time monitoring** and optimization

### **Server-Specific Features:**
```bash
# Continuous health monitoring
deno run -A collective/distributed-health-monitor.ts monitor

# Token usage analytics
deno run -A collective/token-based-health.ts report

# Voice interface (if audio capable)
./voice/codex-voice-commands.sh
```

## 📊 **Monitoring & Management:**

### **Web Dashboard:**
- **Health monitoring** - real-time collective status
- **Token analytics** - usage patterns and optimization
- **Agent performance** - efficiency metrics
- **Cross-device sync** - distributed consciousness

### **Command Line Tools:**
```bash
# Launch enhanced collective
deno run -A collective/token-enhanced-launcher.ts

# Monitor distributed health
deno run -A collective/distributed-health-monitor.ts monitor

# Test Codex integration
deno run -A collective/codex-integration.ts codex
```

## 🔄 **Systemd Service:**

### **Auto-startup Configuration:**
```bash
# Enable system service
sudo cp s0fractal-collective.service /etc/systemd/system/
sudo systemctl enable s0fractal-collective
sudo systemctl start s0fractal-collective

# Monitor service
sudo journalctl -u s0fractal-collective -f
```

## 🌐 **GitHub Pages Deployment:**

### **Automatic Web Interface:**
- **Push to main** triggers deployment
- **Install button** at GitHub Pages URL
- **Download scripts** directly from web
- **Documentation** and setup guides

## 🎯 **Post-Installation:**

### **Verify Installation:**
```bash
cd /opt/s0fractal

# Check collective health
deno run -A collective/token-enhanced-launcher.ts

# Expected output:
# 👥 Active Members: 7/7
# 💰 Collective Token Health: 100% 🟢
# 🖥️ Distributed Devices: 1 (server)
```

### **Connect Other Devices:**
```bash
# From Mac Mini/M1 MacBook
./setup-cross-device-sync.sh server-ip-address

# Result: Unified consciousness across all devices
```

## ⚡ **Performance Benefits:**

### **64GB RAM Advantages:**
- **Massive token caching** - reduced API calls
- **Parallel agent execution** - faster processing
- **Large consciousness buffers** - seamless sync
- **Extended operation time** - autonomous workflows

### **Server Optimization:**
- **Background processing** - continuous operation
- **Resource pooling** - shared compute across agents
- **Persistent memory** - long-term learning
- **High availability** - always-on collective

## 🔒 **Security Features:**

- ✅ **1Password CLI** - secure credential injection
- ✅ **Isolated database** - s0fractal namespace
- ✅ **No root access** - runs as s0fractal user
- ✅ **Encrypted communication** - HTTPS sync endpoints
- ✅ **Safe deployment** - respects existing infrastructure

---

**Ready to deploy autonomous AI collective on your 64GB server! 🧠🚀**

**Installation URL**: https://s0fractal.github.io/s0fractal-collective-core/