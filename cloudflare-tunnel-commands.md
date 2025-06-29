# 🌊 Cloudflare Tunnel Commands для s0fractal

## 📋 **Команди для виконання на MacBook (твоїй машині):**

### 1. **Встановлення cloudflared (якщо немає)**
```bash
# macOS
brew install cloudflared

# Або manual download
curl -L --output cloudflared.dmg https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz
```

### 2. **Авторизація з Cloudflare**
```bash
cloudflared tunnel login
```
*Це відкриє браузер для авторизації*

### 3. **Створення tunnel для колективу**
```bash
cloudflared tunnel create s0fractal-collective
```

### 4. **Отримання credentials**
```bash
# Знайти файл credentials (зазвичай в ~/.cloudflared/)
ls ~/.cloudflared/

# Показати вміст credentials файлу 
cat ~/.cloudflared/[tunnel-id].json
```

### 5. **DNS маршрути**
```bash
# SSH доступ
cloudflared tunnel route dns s0fractal-collective ssh.collective.dogarray.com

# API
cloudflared tunnel route dns s0fractal-collective api.collective.dogarray.com

# Main site  
cloudflared tunnel route dns s0fractal-collective collective.dogarray.com

# Windmill automation
cloudflared tunnel route dns s0fractal-collective windmill.collective.dogarray.com
```

## 📋 **Команди для сервера (через web terminal):**

### 1. **Копіювання credentials на сервер**
```bash
# Створити директорію
mkdir -p /etc/cloudflared

# Тут ти вставиш вміст credentials файлу:
cat > /etc/cloudflared/s0fractal-collective.json << 'EOF'
# ТУТ ВСТАВИТИ JSON З MACBOOK
EOF

# Права доступу
chmod 600 /etc/cloudflared/s0fractal-collective.json
```

### 2. **Запуск tunnel**
```bash
# Тестування
cloudflared tunnel run s0fractal-collective

# Якщо працює, запуск як сервіс
systemctl enable cloudflared
systemctl start cloudflared
```

### 3. **Перевірка статусу**
```bash
systemctl status cloudflared
journalctl -u cloudflared -f
```

## 🔗 **Tailscale Commands:**

### На сервері:
```bash
# Показати IP та статус
tailscale status

# Показати тільки IP
tailscale ip

# Перепідключення якщо треба
tailscale up --ssh
```

### На MacBook:
```bash
# Встановлення (якщо немає)
brew install tailscale

# Підключення
tailscale up

# SSH до сервера через Tailscale
ssh root@$(tailscale ip s0fractal-collective-*)
```

## 🎯 **Фінальні доступи після налаштування:**

- **SSH через Tailscale**: `ssh root@[tailscale-ip]`
- **SSH через Cloudflare**: `ssh ssh.collective.dogarray.com` 
- **Web interface**: `https://collective.dogarray.com`
- **API**: `https://api.collective.dogarray.com`
- **Automation**: `https://windmill.collective.dogarray.com`

## 🚀 **Готовий скрипт на сервері:**
Просто запусти:
```bash
bash tunnel-setup.sh
```

**І колектив матиме повний secure доступ!** 🤖✨