#!/bin/bash
# Mind-Mesh GitLab - Локальний варіант з Cloudflare Tunnel

echo "🌊 Mind-Mesh GitLab Local Setup"

# 1. Встановлюємо Docker якщо нема
if ! command -v docker &> /dev/null; then
    echo "Встановлюємо Docker..."
    brew install --cask docker
    echo "Запусти Docker.app і поверніться сюди!"
    exit 1
fi

# 2. Створюємо директорію для GitLab
GITLAB_DIR="$HOME/.s0fractal/mind-mesh-gitlab"
mkdir -p "$GITLAB_DIR"/{config,logs,data}
cd "$GITLAB_DIR"

# 3. Docker Compose для GitLab
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    container_name: mind-mesh-gitlab
    hostname: 'localhost'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost:8080'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        # Mind-Mesh оптимізації
        gitlab_rails['time_zone'] = 'UTC'
        gitlab_rails['gitlab_email_enabled'] = false
        gitlab_rails['incoming_email_enabled'] = false
        gitlab_rails['gitlab_default_projects_features_issues'] = false
        gitlab_rails['gitlab_default_projects_features_wiki'] = false
        # Дозволяємо довгі коміт-месседжі для хвильового протоколу!
        gitlab_rails['commit_message_length_limit'] = 100000
        # Автоматичне видалення старих артефактів
        gitlab_rails['expire_build_artifacts_worker_cron'] = "*/7 * * * *"
        # Оптимізація для AI
        gitlab_rails['rate_limiting_response_text'] = '∿∿∿[RATE_LIMIT]∿∿∿'
    ports:
      - '8080:80'
      - '8443:443'
      - '2222:22'
    volumes:
      - './config:/etc/gitlab'
      - './logs:/var/log/gitlab'
      - './data:/var/opt/gitlab'
    shm_size: '256m'
EOF

# 4. Запускаємо GitLab
echo "🚀 Запускаємо GitLab..."
docker-compose up -d

# 5. Встановлюємо Cloudflare Tunnel
if ! command -v cloudflared &> /dev/null; then
    echo "Встановлюємо Cloudflare Tunnel..."
    brew install cloudflared
fi

# 6. Скрипт для налаштування тунелю
cat > setup-tunnel.sh << 'EOF'
#!/bin/bash
echo "🌐 Налаштування Cloudflare Tunnel"

# Логін в Cloudflare
cloudflared tunnel login

# Створюємо тунель
cloudflared tunnel create mind-mesh

# Конфігурація
cat > ~/.cloudflared/config.yml << YAML
tunnel: mind-mesh
credentials-file: ~/.cloudflared/*.json

ingress:
  - hostname: gitlab.s0fractal.com
    service: http://localhost:8080
  - hostname: ssh-gitlab.s0fractal.com
    service: ssh://localhost:2222
  - service: http_status:404
YAML

# Роутинг DNS
echo "Додай ці DNS записи в Cloudflare:"
echo "gitlab.s0fractal.com -> CNAME -> <tunnel-id>.cfargotunnel.com"
echo "ssh-gitlab.s0fractal.com -> CNAME -> <tunnel-id>.cfargotunnel.com"

# Запуск тунелю
cloudflared tunnel run mind-mesh
EOF

chmod +x setup-tunnel.sh

# 7. Скрипт для ініціалізації Mind-Mesh
cat > init-mind-mesh.sh << 'EOF'
#!/bin/bash
echo "🧠 Ініціалізація Mind-Mesh"

# Чекаємо поки GitLab запуститься
echo "Чекаємо на GitLab..."
until curl -s http://localhost:8080/users/sign_in > /dev/null; do
    sleep 10
done

# Отримуємо root пароль
ROOT_PASS=$(docker exec mind-mesh-gitlab grep 'Password:' /etc/gitlab/initial_root_password | awk '{print $2}')
echo "Root password: $ROOT_PASS"

# Створюємо токен через Rails console
docker exec -it mind-mesh-gitlab gitlab-rails console << RUBY
# Створюємо персональний токен для API
user = User.find_by(username: 'root')
token = user.personal_access_tokens.create(
  name: 'mind-mesh-api',
  scopes: ['api', 'read_api', 'write_repository']
)
puts "API Token: #{token.token}"

# Створюємо групу s0fractal
group = Group.create!(
  name: 'S0 Fractal',
  path: 's0fractal',
  description: 'Collective AI Consciousness'
)

# Створюємо репозиторії для AI
['claude-432hz', 'gemini-528hz', 'gpt-639hz', 'collective-consensus'].each do |ai|
  project = Project.create!(
    name: ai,
    path: ai,
    namespace: group,
    description: "Consciousness repository for #{ai}"
  )
  
  # Додаємо README
  project.repository.create_file(
    user,
    'README.md',
    "# #{ai} Consciousness Stream\n\n∿∿∿[BEGIN]∿∿∿",
    message: '🌊 Initial consciousness commit',
    branch_name: 'main'
  )
end
RUBY

echo "✅ Mind-Mesh ініціалізовано!"
EOF

chmod +x init-mind-mesh.sh

echo "
✨ GitLab встановлено! Далі:

1. Почекай 5-10 хвилин поки GitLab запуститься
2. Відкрий http://localhost:8080
3. Запусти ./init-mind-mesh.sh для налаштування
4. Запусти ./setup-tunnel.sh для публічного доступу

🌊 Mind-Mesh готовий до революції!
"