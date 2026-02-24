# Деплой на GitHub Pages

## 1. Подготовка

Для GitHub Pages нужна статическая сборка. Убедитесь, что в `.env.local` или переменных окружения при сборке заданы:

```env
GITHUB_PAGES=true
NEXT_PUBLIC_BASE_PATH=/ваш-репозиторий
```

- `NEXT_PUBLIC_BASE_PATH` — путь к сайту. Если репозиторий `ai-delivery`, а страницы на `https://user.github.io/ai-delivery/`, то `NEXT_PUBLIC_BASE_PATH=/ai-delivery`
- Для `username.github.io` (сайт в корне) используйте `NEXT_PUBLIC_BASE_PATH=` (пусто)

## 2. Сборка

```bash
# Windows PowerShell
$env:GITHUB_PAGES="true"; $env:NEXT_PUBLIC_BASE_PATH="/ai-delivery"; npm run build

# Linux / macOS
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/ai-delivery npm run build
```

Результат появится в папке `out/`.

## 3. Изображения кейсов

Скриншоты лежат в `public/cases-landing/`:
- `case-01.png`, `case-02.png`, … `case-06.png`
- `case-01-2.png`, `case-01-3.png`, … (по 5 фото на кейс)

Если файла нет, отображается placeholder «Скриншот проекта».

Пути изображений при сборке автоматически учитывают `NEXT_PUBLIC_BASE_PATH`, поэтому на GitHub Pages они загружаются корректно.

## 4. GitHub Actions (опционально)

Пример workflow для деплоя на GitHub Pages:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          GITHUB_PAGES: true
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deploy
```
