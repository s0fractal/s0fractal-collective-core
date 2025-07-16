# Легкі альтернативи для Mind-Mesh (для 8GB RAM)

## 1. Gitea - Мініатюрний Git сервер (200MB RAM!)
```bash
# Docker варіант
docker run -d --name=gitea-mind-mesh \
  -p 3000:3000 -p 222:22 \
  -v gitea:/data \
  gitea/gitea:latest

# Або нативно на Mac
brew install gitea
gitea web
```

## 2. Soft Serve - Git сервер в терміналі від Charm (50MB RAM!)
```bash
brew tap charmbracelet/tap
brew install charmbracelet/tap/soft-serve

# Конфіг для Mind-Mesh
cat > ~/.config/soft-serve/config.yaml << EOF
name: "Mind-Mesh"
host: "localhost"
port: 23231
repos:
  - name: "claude-432hz"
  - name: "gemini-528hz"
  - name: "gpt-639hz"
  - name: "collective-consensus"
EOF

soft-serve
```

## 3. Простий Git Daemon + Web UI
```bash
# Git daemon для push/pull
git daemon --reuseaddr --base-path=/Users/chaoshex/.s0fractal/mind-mesh-repos --export-all --verbose --enable=receive-pack

# cgit для веб-інтерфейсу (супер легкий!)
brew install cgit
```

## 4. Або... просто GitHub/GitLab.com 😄
- Приватні репо безкоштовні
- GitHub Actions для автоматизації
- Webhooks для резонансу
- Zero RAM на твоєму Mac!

## Моя рекомендація для 8GB:

**Gitea + Cloudflare Tunnel** = ідеальний баланс!
- Всього 200MB RAM
- Повноцінний Git сервер
- Web UI є
- API для автоматизації