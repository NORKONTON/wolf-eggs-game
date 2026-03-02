#!/bin/bash
# Скрипт для деплою Wolf Pack Game на Render.com

echo "🚀 ПІДГОТОВКА ДО ДЕПЛОЮ WOLF PACK GAME НА RENDER.COM"
echo "=================================================="

# 1. Перевірка Git репозиторію
echo "1. 📦 Перевірка Git репозиторію..."
if [ ! -d ".git" ]; then
    echo "   ⚠️ Git репозиторій не ініціалізовано"
    echo "   💡 Ініціалізую..."
    git init
    git add .
    git commit -m "Initial commit: Wolf Pack Game v1.0"
else
    echo "   ✅ Git репозиторій готовий"
fi

# 2. Перевірка залежностей
echo "2. 📦 Перевірка залежностей бекенду..."
cd backend
if [ -f "package.json" ]; then
    echo "   ✅ package.json знайдено"
    echo "   📊 Залежності:"
    cat package.json | grep -A 20 '"dependencies"'
else
    echo "   ❌ package.json не знайдено"
    exit 1
fi
cd ..

# 3. Перевірка фронтенду
echo "3. 🎨 Перевірка фронтенду..."
cd frontend
if [ -f "index.html" ]; then
    echo "   ✅ Фронтенд готовий (HTML5 Canvas)"
    echo "   📁 Файли:"
    ls -la
else
    echo "   ⚠️ Фронтенд не знайдено"
fi
cd ..

# 4. Інструкції для деплою
echo "4. 📋 ІНСТРУКЦІЇ ДЛЯ ДЕПЛОЮ НА RENDER.COM:"
echo ""
echo "   КРОК 1: Створити акаунт на Render.com"
echo "   КРОК 2: Підключити GitHub репозиторій"
echo "   КРОК 3: Створити новий Web Service"
echo "   КРОК 4: Налаштувати за render.yaml"
echo "   КРОК 5: Додати environment variables:"
echo "     - TELEGRAM_BOT_TOKEN: '8634703769:AAGVECnXD_iD_bLa0gAoib6jCZjy42-uA1U'"
echo "     - TON_API_KEY: (отримати з console.ton.org)"
echo "   КРОК 6: Задеплоїти"
echo ""
echo "5. 🌐 ІНСТРУКЦІЇ ДЛЯ GITHUB PAGES (фронтенд):"
echo "   КРОК 1: Запушити фронтенд на GitHub"
echo "   КРОК 2: Увімкнути GitHub Pages в налаштуваннях"
echo "   КРОК 3: Обрати папку /frontend"
echo "   КРОК 4: Домен: https://norkonton.github.io/-wolf-pack-landing-/"
echo ""
echo "6. ⏰ РОЗКЛАД ЗАПУСКУ:"
echo "   - Завтра (28.02.2026) до 18:00 EET: Деплой"
echo "   - 20:00 EET: Офіційний запуск"
echo "   - Перші 24 години: Моніторинг та виправлення багів"
echo ""
echo "=================================================="
echo "✅ ПІДГОТОВКА ДО ДЕПЛОЮ ЗАВЕРШЕНА"
echo "💡 Порада: Почни деплой зараз, щоб встигнути до завтрашнього запуску"