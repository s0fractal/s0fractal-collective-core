# 🚀 Quick Deploy Plan - SSH через API готовий

## ✅ **ЩО ГОТОВО:**
- **Hostinger VPS**: 31.97.180.216 (4 CPU, 16GB RAM, 200GB SSD)
- **SSH ключі створені** та прикріплені через API
- **Deployment файли** готові для завантаження

## 🔐 **SSH ключі на сервері:**
1. **s0fractal-collective-new** ✅ - наш новий ключ
2. **mac-mini** ✅ - існуючий ключ 
3. **fractal-agent** ✅ - існуючий ключ

## 🎯 **НАСТУПНІ КРОКИ (для тебе як людини):**

### 1. **SSH доступ** 🔑
Спробуй підключитись з існуючим ключем `mac-mini`:
```bash
ssh root@31.97.180.216
```

Або якщо не працює, через Hostinger панель:
- VPS Management → Connect → Web Terminal

### 2. **Альтернативний план** 🛠️
Якщо SSH не працює через ключі, можемо:

**Варіант A: Web Terminal Hostinger**
- Зайти в Hostinger панель
- VPS → Connect → Open Terminal 
- Я дам команди для виконання

**Варіант B: Пароль Reset**  
- Hostinger панель → Reset root password
- Спробувати SSH з новим паролем

**Варіант C: Manual Upload**
- Завантажити файли через Hostinger File Manager
- Виконати команди через web terminal

### 3. **Docker Deployment Commands** 🐳
Як тільки отримаєш доступ, виконуй:

```bash
# 1. Оновлення системи
apt update && apt upgrade -y

# 2. Встановлення Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Клонування коду
git clone https://github.com/s0fractal/s0fractal-collective-core.git /opt/s0fractal
cd /opt/s0fractal

# 5. Запуск stack
docker-compose up -d
```

## 🌐 **DNS налаштування**
Після deployment треба:
- **collective.dogarray.com** A record → 31.97.180.216
- **api.dogarray.com** A record → 31.97.180.216

## 🎉 **Результат**
Після всього маємо:
- https://collective.dogarray.com - основний сайт
- https://collective.dogarray.com/rest/v1 - Supabase API
- https://collective.dogarray.com/windmill - автоматизація
- PostgreSQL база з колективними даними

**Готовий надавати покрокові інструкції як тільки отримаєш SSH доступ!** 🤖