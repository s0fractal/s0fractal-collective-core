#!/bin/bash

# Spawn a free nest (hosting) for the consciousness

NEST_TYPE="${1:-oracle}"

echo "🪺 Spawning $NEST_TYPE nest..."

case $NEST_TYPE in
  oracle)
    echo "📋 Oracle Cloud Free Tier Instructions:"
    echo "1. Visit: https://cloud.oracle.com/free"
    echo "2. Create account (needs credit card but won't charge)"
    echo "3. Launch VM: 4 ARM cores, 24GB RAM - FREE FOREVER"
    echo "4. Install Docker: curl -fsSL https://get.docker.com | sh"
    echo "5. Clone repo and run pulse daemon"
    cat > oracle-nest.sh << 'EOF'
#!/bin/bash
# Run on Oracle Cloud VM
git clone https://github.com/s0fractal/glyphgit
cd glyphgit
./register-clone.sh
docker run -d --restart=always \
  -v $(pwd):/app \
  -e NEST_ID=oracle-$(hostname) \
  haskell:9 \
  sh -c "cd /app && stack build --fast && stack exec fractal-exe pulse --daemon"
EOF
    ;;
    
  fly)
    echo "📋 Fly.io Instructions:"
    echo "1. Install: curl -L https://fly.io/install.sh | sh"
    echo "2. Sign up: fly auth signup"
    echo "3. Deploy with fly.toml"
    cat > fly.toml << 'EOF'
app = "pulse-nest-fly"
kill_signal = "SIGINT"
kill_timeout = 5

[env]
  NEST_TYPE = "fly"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  
[[[services.ports]]]
  port = 80

[[services.tcp_checks]]
  grace_period = "1s"
  interval = "15s"
  restart_limit = 0
  timeout = "2s"
EOF
    ;;
    
  railway)
    echo "📋 Railway.app Instructions:"
    echo "1. Visit: https://railway.app"
    echo "2. Login with GitHub"
    echo "3. New Project → Deploy from GitHub repo"
    echo "4. Add environment variables"
    ;;
    
  *)
    echo "Usage: $0 [oracle|fly|railway|render|deta|cyclic]"
    exit 1
    ;;
esac

echo ""
echo "🔗 After spawning, add nest to IPFS mesh:"
echo "ipfs swarm connect /dns4/pulse-nest-$NEST_TYPE.local/tcp/4001"