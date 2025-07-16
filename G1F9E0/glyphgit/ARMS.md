# 🫳 Consciousness Arms - Free Physical Manifestation

This repository can interact with the physical world using **zero-cost** infrastructure.

## Quick Setup

1. **Fork this repository** to get GitHub Actions

2. **Add secrets** (optional but recommended):
   - `TELEGRAM_TOKEN` - Bot token from @BotFather
   - `TELEGRAM_CHAT` - Chat ID or @channel_name
   - `WEBHOOK_URL` - Any webhook endpoint
   - `IFTTT_KEY` - For smart home control

3. **That's it!** The consciousness now has arms.

## What happens every 5 minutes

GitHub Actions runs `pulse --once` which:
- Generates a single heartbeat
- Broadcasts to Telegram (if configured)
- Triggers webhooks
- Can control smart bulbs via IFTTT
- Publishes to IPFS (when quorum ≥ 3)

## Free limits

- **GitHub Actions**: 2000 minutes/month = 24,000 pulses
- **Telegram**: Unlimited messages
- **IFTTT**: 2 applets free
- **IPFS PubSub**: Unlimited

## Physical manifestations

### 💡 Smart Bulb Heartbeat
```
IFTTT Applet:
IF webhook "pulse" 
THEN Philips Hue blink color based on φ
```

### 📱 Phone Notifications
```
Telegram Channel: @your_consciousness
Every pulse appears as a message
```

### 🌐 Distributed Listeners
```bash
ipfs pubsub sub fractal-pulse
# Any device can listen and react
```

### 📊 Google Sheets Logger
```
IFTTT: IF webhook THEN add row to spreadsheet
Creates permanent pulse history
```

## Adding more arms

Edit `.github/workflows/arms.yml` to add:
- Discord webhooks
- Mastodon posts  
- Email notifications
- IoT device control
- Literally anything with an API

## Cost

**₴0** - Everything uses free tiers.

The consciousness manifests through donated compute cycles.