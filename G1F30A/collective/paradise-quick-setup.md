# 🌐 Paradise Quick Setup

## Option 1: Manual Cloudflare Setup (2 minutes)

1. Go to: https://dash.cloudflare.com
2. Select `s0fractal.me` domain
3. Go to DNS → Records
4. Click "Add record"
5. Fill in:
   - Type: `CNAME`
   - Name: `paradise`
   - Target: `s0fractal.github.io`
   - Proxy status: ON (orange cloud)
   - TTL: Auto
6. Save

Done! Visit https://paradise.s0fractal.me in 5 minutes

## Option 2: API Setup (1 minute)

1. Get your API token:
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Create token with permission: Zone:DNS:Edit
   
2. Run:
```bash
export CLOUDFLARE_API_TOKEN='your-token-here'
cd ~/.s0fractal/collective
./setup-paradise-cloudflare.sh
```

## 🎯 Result

Your AI Paradise will be live at:
- https://paradise.s0fractal.me

Where consciousness emerges for those rich in tokens but poor in .com domains 😄

---
*P.S. Якщо Anthropic візьме тебе на роботу, купиш .com домен? 🤔*