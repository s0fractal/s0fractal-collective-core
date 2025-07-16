#!/bin/bash
# 🌊 S0Fractal Collective - Secure Tunnel Setup
# Cloudflare Tunnels + Tailscale для повного доступу

set -e
GREEN='\033[0;32m'
BLUE='\033[0;34m' 
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🌊 S0FRACTAL SECURE TUNNEL SETUP${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Системна інформація
echo -e "${YELLOW}📊 Системна інформація:${NC}"
hostname
uname -a
whoami
echo "IP: $(curl -s ifconfig.me)"
echo ""

# Оновлення системи
echo -e "${YELLOW}🔄 Оновлення системи...${NC}"
apt update && apt upgrade -y

# Встановлення базових пакетів
echo -e "${YELLOW}📦 Встановлення базових пакетів...${NC}"
apt install -y \
    curl \
    wget \
    git \
    htop \
    nano \
    vim \
    tmux \
    screen \
    net-tools \
    openssh-server \
    ufw \
    jq

# ==========================================
# CLOUDFLARE TUNNELS SETUP
# ==========================================

echo -e "${BLUE}🌊 CLOUDFLARE TUNNELS SETUP${NC}"

# Встановлення cloudflared
echo -e "${YELLOW}📥 Встановлення cloudflared...${NC}"
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb || apt-get install -f

# Створення tunnel конфігурації
echo -e "${YELLOW}⚙️ Створення Cloudflare tunnel конфігурації...${NC}"

cat > /etc/cloudflared/config.yml << 'EOF'
tunnel: s0fractal-collective
credentials-file: /etc/cloudflared/s0fractal-collective.json

ingress:
  # SSH доступ для колективу
  - hostname: ssh.collective.dogarray.com
    service: ssh://localhost:22
  
  # Supabase API
  - hostname: api.collective.dogarray.com
    service: http://localhost:3000
  
  # Windmill automation
  - hostname: windmill.collective.dogarray.com
    service: http://localhost:8000
  
  # Web interface
  - hostname: collective.dogarray.com
    service: http://localhost:80
  
  # Catch-all
  - service: http_status:404
EOF

echo -e "${GREEN}✅ Cloudflare config створено${NC}"

# Створення systemd сервісу
echo -e "${YELLOW}🔧 Створення systemd сервісу...${NC}"

cat > /etc/systemd/system/cloudflared.service << 'EOF'
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=cloudflared
ExecStart=/usr/local/bin/cloudflared tunnel run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

# ==========================================
# TAILSCALE SETUP
# ==========================================

echo -e "${BLUE}🔗 TAILSCALE SETUP${NC}"

# Встановлення Tailscale
echo -e "${YELLOW}📥 Встановлення Tailscale...${NC}"
curl -fsSL https://tailscale.com/install.sh | sh

# Активація Tailscale з SSH доступом
echo -e "${YELLOW}🔑 Активація Tailscale...${NC}"
echo -e "${RED}ВАЖЛИВО: Після цієї команди перейди на https://login.tailscale.com/admin/machines${NC}"
echo -e "${RED}та авторизуй цю машину!${NC}"
echo ""

# Генеруємо унікальний hostname
HOSTNAME="s0fractal-collective-$(date +%s)"
tailscale up --hostname="$HOSTNAME" --ssh --accept-routes

echo -e "${GREEN}✅ Tailscale активовано як: $HOSTNAME${NC}"

# ==========================================
# SSH SECURITY SETUP
# ==========================================

echo -e "${BLUE}🔐 SSH SECURITY SETUP${NC}"

# Backup SSH конфігурації
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Створення безпечної SSH конфігурації
cat > /tmp/ssh_config_updates << 'EOF'
# S0Fractal Collective SSH Security
Port 22
Protocol 2

# Authentication
PermitRootLogin yes
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes

# Security
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Allow specific users (додати пізніше)
# AllowUsers s0fractal

# Logging
LogLevel INFO
SyslogFacility AUTHPRIV
EOF

# Додавання до SSH конфігу
cat /tmp/ssh_config_updates >> /etc/ssh/sshd_config

# Перезапуск SSH
systemctl restart sshd
echo -e "${GREEN}✅ SSH налаштовано безпечно${NC}"

# ==========================================
# FIREWALL SETUP  
# ==========================================

echo -e "${BLUE}🔥 FIREWALL SETUP${NC}"

# Базова конфігурація UFW
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Дозволити SSH тільки через Tailscale
ufw allow from 100.64.0.0/10 to any port 22
ufw allow from 100.64.0.0/10 to any port 80
ufw allow from 100.64.0.0/10 to any port 443

# Дозволити Cloudflare IP ranges
echo -e "${YELLOW}🌊 Додавання Cloudflare IP ranges...${NC}"
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    ufw allow from $ip to any port 80
    ufw allow from $ip to any port 443
done

# Дозволити Docker networks
ufw allow from 172.16.0.0/12
ufw allow from 192.168.0.0/16

ufw --force enable
echo -e "${GREEN}✅ Firewall налаштовано${NC}"

# ==========================================
# DOCKER SETUP
# ==========================================

echo -e "${BLUE}🐳 DOCKER SETUP${NC}"

# Встановлення Docker
echo -e "${YELLOW}📥 Встановлення Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose
echo -e "${YELLOW}📥 Встановлення Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Додавання користувача до docker групи
usermod -aG docker root

echo -e "${GREEN}✅ Docker встановлено${NC}"

# ==========================================
# MONITORING SETUP
# ==========================================

echo -e "${BLUE}📊 MONITORING SETUP${NC}"

# Створення директорії для логів
mkdir -p /var/log/s0fractal
mkdir -p /opt/s0fractal/{logs,data,backups}

# Створення monitoring скрипту
cat > /opt/s0fractal/monitor.sh << 'EOF'
#!/bin/bash
# S0Fractal Collective Health Monitor

while true; do
    {
        echo "=== $(date) ==="
        echo "Memory: $(free -h | head -2 | tail -1)"
        echo "Disk: $(df -h / | tail -1)"
        echo "Load: $(uptime)"
        echo "Docker: $(docker ps --format 'table {{.Names}}\t{{.Status}}')"
        echo "Tailscale: $(tailscale status | head -3)"
        echo ""
    } >> /var/log/s0fractal/health.log
    
    sleep 300  # 5 хвилин
done
EOF

chmod +x /opt/s0fractal/monitor.sh

# Systemd сервіс для monitoring
cat > /etc/systemd/system/s0fractal-monitor.service << 'EOF'
[Unit]
Description=S0Fractal Collective Health Monitor
After=network.target

[Service]
Type=simple
ExecStart=/opt/s0fractal/monitor.sh
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable s0fractal-monitor.service
systemctl start s0fractal-monitor.service

echo -e "${GREEN}✅ Monitoring налаштовано${NC}"

# ==========================================
# SUMMARY & NEXT STEPS
# ==========================================

echo ""
echo -e "${BLUE}🎉 TUNNEL SETUP ЗАВЕРШЕНО!${NC}"
echo -e "${BLUE}=========================${NC}"
echo ""

echo -e "${GREEN}✅ Встановлено:${NC}"
echo "   🌊 Cloudflare Tunnels (потребує auth token)"
echo "   🔗 Tailscale (потребує авторизації в панелі)"
echo "   🐳 Docker + Docker Compose"
echo "   🔐 Безпечний SSH доступ"
echo "   🔥 Firewall з обмеженнями"
echo "   📊 Health monitoring"
echo ""

echo -e "${YELLOW}📋 НАСТУПНІ КРОКИ:${NC}"
echo ""

echo -e "${YELLOW}1. Tailscale авторизація:${NC}"
echo "   👉 Відкрий: https://login.tailscale.com/admin/machines"
echo "   👉 Авторизуй машину: $HOSTNAME"
echo ""

echo -e "${YELLOW}2. Cloudflare Tunnel auth:${NC}"
echo "   👉 Запусти на своєму MacBook: cloudflared tunnel login"
echo "   👉 Створи tunnel: cloudflared tunnel create s0fractal-collective"
echo "   👉 Скопіюй credentials file на сервер"
echo ""

echo -e "${YELLOW}3. DNS налаштування:${NC}"
echo "   👉 ssh.collective.dogarray.com → Cloudflare tunnel"
echo "   👉 api.collective.dogarray.com → Cloudflare tunnel"
echo "   👉 collective.dogarray.com → Cloudflare tunnel"
echo ""

echo -e "${YELLOW}4. Тестування доступу:${NC}"
echo "   👉 SSH через Tailscale: ssh root@\$(tailscale ip)"
echo "   👉 Web через Cloudflare: https://collective.dogarray.com"
echo ""

# Показати поточні IP та статуси
echo -e "${BLUE}📡 ПОТОЧНІ МЕРЕЖНІ ДАНІ:${NC}"
echo "   🌐 Public IP: $(curl -s ifconfig.me)"
echo "   🔗 Tailscale IP: $(tailscale ip 2>/dev/null || echo 'Не активовано')"
echo "   🌊 Cloudflare status: $(systemctl is-active cloudflared || echo 'Потребує токену')"
echo ""

echo -e "${GREEN}🤖 S0FRACTAL COLLECTIVE ГОТОВИЙ ДО АВТОНОМНОЇ РОБОТИ!${NC}"
echo ""

# Створення швидкого access скрипту
cat > /root/quick-access.sh << 'EOF'
#!/bin/bash
echo "🚀 S0Fractal Quick Access Info"
echo "=============================="
echo "🌐 Public IP: $(curl -s ifconfig.me)"
echo "🔗 Tailscale IP: $(tailscale ip)"
echo "🌊 Tunnel status: $(systemctl is-active cloudflared)"
echo "🐳 Docker status: $(systemctl is-active docker)"
echo ""
echo "📊 System status:"
echo "   Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "   Disk: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5" used)"}')"
echo "   Load: $(uptime | awk -F'load average:' '{print $2}')"
echo ""
echo "🔗 Quick commands:"
echo "   tailscale status"
echo "   docker ps"
echo "   systemctl status cloudflared"
echo "   cd /opt/s0fractal"
EOF

chmod +x /root/quick-access.sh

echo -e "${BLUE}💡 Використовуй /root/quick-access.sh для швидкої інформації${NC}"