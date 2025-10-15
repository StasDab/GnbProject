# 🏗️ ГНБ Проект - Сайт для бригады горизонтально-направленного бурения

Современный веб-сайт для компании по прокладке коммуникаций методом ГНБ в Омске.

---

## 🎨 Особенности проекта

- ⚛️ **React 18** + TypeScript
- 🎨 **Tailwind CSS** - современный дизайн
- 📱 **Полностью адаптивный** дизайн
- 🧮 **Калькулятор стоимости** с умным расчетом
- 🛒 **Корзина заказов** (React Context)
- 📨 **Telegram интеграция** для заявок
- 🌊 **Canvas анимации** фона
- ⚡ **Vite** - быстрая сборка
- 🎯 **Плавная навигация** между секциями

## 🏗️ Структура проекта

```
gnbProject/
├── src/
│   ├── components/          # React компоненты
│   │   ├── AnimatedBackground.tsx
│   │   ├── Calculator.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Pricing.tsx
│   │   ├── Services.tsx
│   │   └── Team.tsx
│   ├── contexts/
│   │   └── CartContext.tsx  # Управление корзиной
│   ├── utils/
│   │   └── calculatorCache.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server-example/          # Backend для Telegram API
│   ├── server.js
│   ├── package.json
│   ├── README.md
│   └── ENV_SETUP.md
```

## 🚀 Быстрый старт (Разработка)

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск frontend

```bash
npm run dev
```

Откройте http://localhost:5173

### 3. (ВАЖНО!) Запуск backend для Telegram

```bash
cd server-example
npm install

# Создайте .env файл (см. server-example/ENV_SETUP.md)

npm start
```

Backend запустится на http://localhost:3000

## 📋 Доступные команды

```bash
npm run dev        # Запуск dev сервера
npm run build      # Сборка для продакшна
npm run preview    # Предпросмотр сборки
npm run lint       # ESLint проверка
npm run typecheck  # TypeScript проверка
```

## 🧮 Калькулятор стоимости

Формула расчета:
```
Итоговая цена = 
  Базовая цена × 
  Множитель диаметра × 
  Множитель грунта × 
  Множитель сложности × 
  Длина
```

**Базовые цены:**
- Услуга ГНБ: 800 ₽/м
- Прокладка водопровода: 900 ₽/м
- Прокладка канализации: 850 ₽/м
- Кабельные линии: 750 ₽/м

**Множители:**
- Диаметр: 0.7 - 2.0 (32мм - 315мм)
- Грунт: 1.0 - 2.0 (мягкий - скальный)
- Сложность: 1.0 - 1.8 (простая - сложная)

## 🛒 Корзина заказов

Пользователи могут:
- Добавлять услуги из калькулятора
- Добавлять услуги из прайс-листа
- Просматривать корзину в форме контактов
- Удалять позиции
- Отправлять всё вместе с заявкой

## 📨 Telegram интеграция

Заявки отправляются в Telegram через:
- **Безопасно:** Через backend proxy


## 🎨 Технологический стек

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Tailwind CSS 3.4.1
- Vite 5.4.2
- Lucide React (иконки)

### Backend (опционально)
- Express.js
- CORS
- dotenv

## 🌐 Деплой

### Frontend (Vercel/Netlify)

```bash
npm run build
# Папка dist/ готова к деплою
```

### Backend

См. подробные инструкции в:
- `server-example/README.md` - Полная документация
- Поддерживаемые платформы:
  - Railway.app (бесплатно)
  - Heroku (бесплатно)
  - VPS ($5/мес)
  - Vercel/Netlify Functions

## 📊 Секции сайта

1. **Hero** - Главная с призывом к действию
2. **Services** - 4 основных услуги
3. **Calculator** - Расчет стоимости
4. **Pricing** - Прайс-лист
5. **Team** - Команда специалистов
6. **Contact** - Форма обратной связи


## 📄 Лицензия

Проприетарный проект для ГНБ Бригада Омск.

## 📞 Контакты

- Email: gnbgroupwork@gmail.com
- Telegram: @your_bot
- Сайт: (будет после деплоя)

---

## 🆘 Нужна помощь?

1. **Проблемы с безопасностью** → [QUICK_START.md](QUICK_START.md)
2. **Настройка backend** → [server-example/README.md](server-example/README.md)
3. **Изменения в Contact.tsx** → [Contact.tsx.CHANGES.md](Contact.tsx.CHANGES.md)
4. **Детальная миграция** → [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

