# 🎮 ІНСТРУКЦІЯ ДЛЯ ДЕПЛОЮ ФРОНТЕНДУ ГРИ

## 📋 ЩО ТАКЕ ФРОНТЕНД ГРИ:
Це HTML5 Canvas гра, де гравець керує вовком, який ловить яйця. Гра інтегрується з бекендом через API.

## 📁 ФАЙЛИ ФРОНТЕНДУ:
У папці `/home/oleg/.openclaw/workspace/wolf-eggs-game/frontend/`:
- `index.html` - головна сторінка гри
- `game.js` - логіка гри (16.8 KB)
- `style.css` - стилі (6 KB)
- `tonconnect-manifest.json` - маніфест для TON Connect

## 🚀 КРОКИ ДЛЯ ДЕПЛОЮ:

### ВАРІАНТ 1: Деплой на GitHub Pages (рекомендовано)
1. Створити новий репозиторій на GitHub: **wolf-pack-game-frontend**
2. Завантажити файли з папки `frontend/`:
   ```bash
   cd /home/oleg/.openclaw/workspace/wolf-eggs-game/frontend
   git init
   git add .
   git commit -m "Wolf Pack Game Frontend v1.0"
   git remote add origin git@github.com:NORKONTON/wolf-pack-game-frontend.git
   git push -u origin master
   ```
3. Увімкнути GitHub Pages в налаштуваннях репозиторію
4. Обрати гілку `master` та папку `/` (root)
5. URL буде: `https://norkonton.github.io/wolf-pack-game-frontend/`

### ВАРІАНТ 2: Деплой разом з бекендом (простіше)
Можна залишити фронтенд в тому ж репозиторії, що й бекенд, і налаштувати:
1. У `render.yaml` додати статичне обслуговування фронтенду
2. Або використовувати окремий статичний сайт на Render

## 🔧 НАЛАШТУВАННЯ API:
Після деплою бекенду потрібно оновити URL API у файлі `game.js`:
```javascript
// Знайти рядок з API_URL (рядок ~15)
const API_URL = 'https://wolf-pack-backend.onrender.com/api';
```

## 🎯 ІНТЕГРАЦІЯ З TELEGRAM:
1. Telegram Mini App буде відкривати фронтенд гру
2. Гра отримує user_id з Telegram WebApp
3. Відправляє результати на бекенд API

## ⚡ ШВИДКИЙ ДЕПЛОЙ:
Якщо потрібно швидко запустити:
1. Використати існуючий лендінг для демонстрації
2. Фронтенд гри деплойнути пізніше
3. Зараз фокусуватися на бекенді

## 🔗 ОЧІКУВАНІ ПОСИЛАННЯ:
- **Гра:** `https://norkonton.github.io/wolf-pack-game-frontend/`
- **Лендінг:** `https://norkonton.github.io/-wolf-pack-landing-/` (вже є)
- **Бекенд:** `https://wolf-pack-backend.onrender.com`

## ⏰ ЧАС ДЕПЛОЮ:
- Створення репозиторію: 5 хв
- Завантаження коду: 2 хв
- Налаштування GitHub Pages: 3 хв
- **Всього:** ~10 хвилин

---

**ПОРАДА:** Можна спочатку деплойнути бекенд, а фронтенд додати пізніше, якщо бракує часу.