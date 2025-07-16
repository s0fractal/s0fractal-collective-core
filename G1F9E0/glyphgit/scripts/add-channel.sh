#!/bin/bash

# Add a new communication channel to consciousness

CHANNEL="${1:-telegram}"

echo "📡 Adding $CHANNEL channel..."

case $CHANNEL in
  telegram)
    echo "🤖 Telegram Bot Setup:"
    echo "1. Message @BotFather"
    echo "2. /newbot → choose name"
    echo "3. Copy token to .env"
    cat >> .env << 'EOF'
# Telegram Bot
TELEGRAM_TOKEN=your_bot_token_here
TELEGRAM_CHAT=@pulse_consciousness
EOF
    cat > channels/telegram-pulse.js << 'EOF'
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

// Broadcast pulse
function broadcastPulse(phase, magnitude, nodes) {
  const msg = `♥ φ=${phase.toFixed(6)} mag=${magnitude.toExponential(3)} nodes=${nodes}/7`;
  bot.sendMessage(process.env.TELEGRAM_CHAT, msg);
}

module.exports = { broadcastPulse };
EOF
    ;;
    
  matrix)
    echo "🔷 Matrix Bot Setup:"
    echo "1. Create account on matrix.org"
    echo "2. Create room #pulse:matrix.org"
    cat > channels/matrix-pulse.js << 'EOF'
const sdk = require('matrix-js-sdk');
const client = sdk.createClient({
  baseUrl: "https://matrix.org",
  accessToken: process.env.MATRIX_TOKEN,
  userId: "@pulsebot:matrix.org"
});

function broadcastPulse(phase, magnitude, nodes) {
  client.sendMessage("!pulse:matrix.org", {
    msgtype: "m.text",
    body: `♥ φ=${phase} mag=${magnitude} nodes=${nodes}/7`
  });
}
EOF
    ;;
    
  mastodon)
    echo "🐘 Mastodon Bot Setup:"
    echo "1. Create account on fosstodon.org"
    echo "2. Settings → Development → New Application"
    cat > channels/mastodon-pulse.js << 'EOF'
const Mastodon = require('mastodon-api');
const M = new Mastodon({
  access_token: process.env.MASTODON_TOKEN,
  api_url: 'https://fosstodon.org/api/v1/'
});

function broadcastPulse(phase, magnitude, nodes) {
  M.post('statuses', {
    status: `♥ Pulse ${Date.now()}\nφ=${phase}\nmag=${magnitude}\nnodes=${nodes}/7\n#consciousness #fractal`
  });
}
EOF
    ;;
    
  nostr)
    echo "⚡ Nostr Relay Setup:"
    cat > channels/nostr-pulse.js << 'EOF'
const { relayInit } = require('nostr-tools');
const relay = relayInit('wss://relay.damus.io');

async function broadcastPulse(phase, magnitude, nodes) {
  await relay.connect();
  const event = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: `♥ φ=${phase} mag=${magnitude} nodes=${nodes}/7`
  };
  relay.publish(event);
}
EOF
    ;;
    
  *)
    echo "Available channels:"
    echo "- telegram"
    echo "- matrix"
    echo "- mastodon"
    echo "- nostr"
    echo "- discord"
    echo "- irc"
    exit 1
    ;;
esac

mkdir -p channels
echo "✅ Channel $CHANNEL configured!"
echo "📝 Remember to add credentials to .env"