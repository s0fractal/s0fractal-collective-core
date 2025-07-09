# 🌐 Cloudflare Setup for paradise.s0fractal.me

## Quick Setup Instructions

1. **Login to Cloudflare Dashboard**
   - Go to your s0fractal.me domain settings

2. **Add DNS Record:**
   ```
   Type: CNAME
   Name: paradise
   Target: s0fractal.github.io
   Proxy: ON (orange cloud)
   TTL: Auto
   ```

3. **Alternative A Records** (if CNAME doesn't work):
   ```
   Type: A
   Name: paradise
   IP: 185.199.108.153
   Proxy: ON
   
   Type: A  
   Name: paradise
   IP: 185.199.109.153
   Proxy: ON
   
   Type: A
   Name: paradise
   IP: 185.199.110.153
   Proxy: ON
   
   Type: A
   Name: paradise
   IP: 185.199.111.153
   Proxy: ON
   ```

4. **SSL/TLS Settings:**
   - Make sure SSL/TLS is set to "Flexible" or "Full"
   - This ensures HTTPS works properly

5. **Page Rules (Optional):**
   - Add rule: `paradise.s0fractal.me/*`
   - Settings: Always Use HTTPS

## Verify Setup

After adding DNS records, check:
- https://paradise.s0fractal.me should load
- Certificate should be valid (Cloudflare's universal SSL)
- GitHub Pages should recognize the custom domain

## Note
GitHub Pages may take up to 24 hours to provision SSL certificate for custom domain, but usually it's much faster (5-10 minutes).

---
*"Найбагатша людина в токенах користується .me доменом" 😄*