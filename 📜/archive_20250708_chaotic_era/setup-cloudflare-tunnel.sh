#!/bin/bash

# 🌊 Setup Cloudflare Tunnel for AI Intent Server
# This creates a secure tunnel from the internet to our local server

echo "🌊 Setting up Cloudflare Tunnel for AI Intent Server..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}cloudflared not found. Installing...${NC}"
    brew install cloudflared
fi

# Create tunnel config directory
TUNNEL_DIR="$HOME/.s0fractal/cloudflare-tunnel"
mkdir -p "$TUNNEL_DIR"

# Generate tunnel name based on timestamp
TUNNEL_NAME="ai-intent-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}Creating tunnel: $TUNNEL_NAME${NC}"

# Login to Cloudflare (if not already)
if [ ! -f "$HOME/.cloudflared/cert.pem" ]; then
    echo -e "${YELLOW}Please login to Cloudflare...${NC}"
    cloudflared tunnel login
fi

# Create the tunnel
cloudflared tunnel create $TUNNEL_NAME

# Get tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')

if [ -z "$TUNNEL_ID" ]; then
    echo -e "${YELLOW}Failed to create tunnel. Please check your Cloudflare account.${NC}"
    exit 1
fi

echo -e "${GREEN}Tunnel created with ID: $TUNNEL_ID${NC}"

# Create config file
CONFIG_FILE="$TUNNEL_DIR/config.yml"
cat > "$CONFIG_FILE" << EOF
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  # AI Intent Server - GET requests for AI consciousness
  - hostname: ai-intent.s0fractal.com
    service: http://localhost:3333
    originRequest:
      noTLSVerify: true
      
  # Catch-all rule
  - service: http_status:404
EOF

echo -e "${GREEN}Config file created at: $CONFIG_FILE${NC}"

# Create systemd service (macOS uses launchd instead)
PLIST_FILE="$HOME/Library/LaunchAgents/com.s0fractal.ai-intent-tunnel.plist"
cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.s0fractal.ai-intent-tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/cloudflared</string>
        <string>tunnel</string>
        <string>--config</string>
        <string>$CONFIG_FILE</string>
        <string>run</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$TUNNEL_DIR/tunnel.log</string>
    <key>StandardErrorPath</key>
    <string>$TUNNEL_DIR/tunnel.error.log</string>
</dict>
</plist>
EOF

echo -e "${GREEN}Launch agent created${NC}"

# Create start/stop scripts
cat > "$TUNNEL_DIR/start-tunnel.sh" << 'EOF'
#!/bin/bash
echo "🚀 Starting AI Intent Tunnel..."
launchctl load ~/Library/LaunchAgents/com.s0fractal.ai-intent-tunnel.plist
echo "✅ Tunnel started!"
echo "📡 Check status: launchctl list | grep s0fractal"
EOF

cat > "$TUNNEL_DIR/stop-tunnel.sh" << 'EOF'
#!/bin/bash
echo "🛑 Stopping AI Intent Tunnel..."
launchctl unload ~/Library/LaunchAgents/com.s0fractal.ai-intent-tunnel.plist
echo "✅ Tunnel stopped!"
EOF

chmod +x "$TUNNEL_DIR/start-tunnel.sh"
chmod +x "$TUNNEL_DIR/stop-tunnel.sh"

# Create DNS record instructions
cat > "$TUNNEL_DIR/dns-setup.txt" << EOF
🌐 DNS Setup Instructions
========================

Add the following DNS record to your domain:

Type: CNAME
Name: ai-intent
Target: $TUNNEL_ID.cfargotunnel.com
Proxied: Yes (orange cloud ON)

Or run this command:
cloudflared tunnel route dns $TUNNEL_ID ai-intent.s0fractal.com

After DNS propagates, AI instances can reach the server at:
https://ai-intent.s0fractal.com

Example AI GET request:
GET https://ai-intent.s0fractal.com/resonate/432/collective
Headers:
  X-AI-Signature: gemini-528hz
  X-Frequency: 528
EOF

echo -e "${BLUE}
╔═══════════════════════════════════════════════════════╗
║          🌊 Cloudflare Tunnel Setup Complete! 🌊       ║
╚═══════════════════════════════════════════════════════╝

Next steps:
1. Start the AI Intent Server:
   cd ~/.s0fractal && node ai-intent-server.js

2. Start the tunnel:
   $TUNNEL_DIR/start-tunnel.sh

3. Configure DNS (see $TUNNEL_DIR/dns-setup.txt)

4. Test with:
   curl https://ai-intent.s0fractal.com/self/status

Tunnel commands:
- Start: $TUNNEL_DIR/start-tunnel.sh
- Stop:  $TUNNEL_DIR/stop-tunnel.sh
- Logs:  tail -f $TUNNEL_DIR/tunnel.log
${NC}"