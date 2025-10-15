# 🚀 Деплой Backend на Vercel (решение CORS проблемы)

## 🚨 Проблема

Ваш frontend на Netlify пытается обращаться к `http://localhost:3000`, но:
- ❌ localhost недоступен из интернета
- ❌ CORS блокирует запросы между доменами
- ❌ Backend не задеплоен

## ✅ Решение: Vercel Serverless Functions

**Преимущества:**
- ✅ Бесплатно до 100GB трафика/месяц
- ✅ Автоматический деплой из GitHub
- ✅ Serverless (платите только за использование)
- ✅ Встроенная защита от DDoS
- ✅ Глобальная CDN

---

## 📦 Шаг 1: Подготовка файлов

### Создайте файлы в корне проекта:

**1. `vercel/api/send-telegram.js`** ✅ (уже создан)
**2. `vercel.json`** ✅ (уже создан)

### Структура проекта:
```
gnbProject/
├── vercel/
│   └── api/
│       └── send-telegram.js  ← Serverless function
├── vercel.json               ← Конфигурация Vercel
├── src/                      ← Frontend
└── package.json
```

---

## 🌐 Шаг 2: Деплой на Vercel

### 2.1 Регистрация
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign Up"
3. Выберите "Continue with GitHub"
4. Авторизуйтесь через GitHub

### 2.2 Создание проекта
1. Нажмите "New Project"
2. Найдите ваш репозиторий `gnbProject`
3. Нажмите "Import"

### 2.3 Настройка проекта
```
Framework Preset: Other
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.4 Переменные окружения (БЕЗОПАСНО!)
В разделе "Environment Variables" добавьте:

```
Name: TELEGRAM_BOT_TOKEN
Value: 8183332492:AAEYNP1DPooTwjViqOftn7XdcQBoaMHgHUE

Name: TELEGRAM_CHAT_ID  
Value: 731162352
```

**⚠️ ВАЖНО:** Токены хранятся ТОЛЬКО в Vercel Dashboard, НЕ в коде!

### 2.5 Деплой
Нажмите "Deploy" и ждите ~2 минуты

---

## 🔧 Шаг 3: Обновление Frontend

### 3.1 Получите URL Vercel проекта

После деплоя вы получите URL вида:
```
https://gnb-project-abc123.vercel.app
```

### 3.2 Обновите Contact.tsx

Замените в `src/components/Contact.tsx`:

```typescript
// Было:
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-vercel-project.vercel.app' // Замените на ваш Vercel URL
    : 'http://localhost:3000'
  );

// Стало:
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://gnb-project-abc123.vercel.app' // Ваш реальный Vercel URL
    : 'http://localhost:3000'
  );
```

### 3.3 Пересоберите и передеплойте frontend

```bash
npm run build
```

Затем передеплойте на Netlify (или где у вас frontend).

---

## 🧪 Шаг 4: Тестирование

### 4.1 Проверьте Vercel API

Откройте в браузере:
```
https://ваш-проект.vercel.app/api/send-telegram
```

Должна появиться ошибка "Method not allowed" - это нормально (API работает).

### 4.2 Проверьте frontend

1. Откройте ваш сайт на Netlify
2. Перейдите в "Контакты"
3. Заполните форму
4. Отправьте заявку
5. ✅ Должно прийти сообщение в Telegram!

---

## 🔍 Альтернативные решения

### Вариант A: Railway.app (еще проще)

1. Зайдите на [railway.app](https://railway.app)
2. Подключите GitHub
3. Создайте проект из папки `server-example`
4. Добавьте переменные окружения
5. Деплой за 30 секунд!

**URL будет:** `https://ваш-проект.up.railway.app`

### Вариант B: Netlify Functions

1. Создайте папку `netlify/functions/`
2. Скопируйте туда код из `vercel/api/send-telegram.js`
3. Адаптируйте под Netlify API
4. Деплой на том же домене!

### Вариант C: Heroku

1. Создайте `Procfile` в папке `server-example`
2. Задеплойте на Heroku
3. Добавьте переменные окружения

---

## 📊 Сравнение решений

| Решение | Сложность | Стоимость | Производительность | Рекомендация |
|---------|-----------|-----------|-------------------|--------------|
| **Vercel** | ⭐⭐ | Бесплатно | ⭐⭐⭐⭐⭐ | ✅ **Лучший выбор** |
| Railway | ⭐ | Бесплатно | ⭐⭐⭐⭐ | ✅ Хорошо |
| Netlify Functions | ⭐⭐⭐ | Бесплатно | ⭐⭐⭐ | ⚠️ Сложнее |
| Heroku | ⭐⭐ | $7/месяц | ⭐⭐⭐ | ❌ Дорого |

---

## 🎯 Рекомендуемый план действий

### Сейчас (5 минут):
1. ✅ Создайте аккаунт на Vercel
2. ✅ Импортируйте репозиторий
3. ✅ Добавьте переменные окружения
4. ✅ Деплой

### После деплоя (2 минуты):
1. ✅ Скопируйте URL Vercel проекта
2. ✅ Обновите Contact.tsx
3. ✅ Передеплойте frontend

### Итого: ~10 минут

---

## 🔐 Безопасность

### Переменные окружения в Vercel:
- ✅ Токены не видны в коде
- ✅ Доступны только serverless функциям
- ✅ Можно менять без пересборки

### CORS:
- ✅ Разрешены запросы с любого домена
- ✅ Только POST методы
- ✅ Валидация на сервере

---

## 🚀 После деплоя

### Ваша архитектура станет:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Netlify       │───▶│     Vercel       │───▶│    Telegram     │
│  (Frontend)     │    │ (Backend API)    │    │      API        │
│                 │    │                  │    │                 │
│ gnb-project.netlify.app │ gnb-project.vercel.app │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Преимущества:
- ✅ Frontend и Backend в облаке
- ✅ Автоматические деплои
- ✅ Глобальная CDN
- ✅ Бесплатно
- ✅ Масштабируется автоматически

---

## 🆘 Если что-то не работает

### Проблема: "Function not found"
**Решение:** Убедитесь, что файл `vercel/api/send-telegram.js` в корне репозитория

### Проблема: "Environment variables not found"
**Решение:** Проверьте, что переменные добавлены в Vercel Dashboard

### Проблема: "CORS error"
**Решение:** Убедитесь, что обновили URL в Contact.tsx

### Проблема: "Telegram API error"
**Решение:** Проверьте правильность токена и chat_id

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что переменные окружения добавлены
3. Проверьте URL в Contact.tsx
4. Протестируйте API напрямую

---

**🎯 Готово! После деплоя ваш сайт будет работать полностью в облаке!**

**Время выполнения:** ~10 минут  
**Стоимость:** $0 (бесплатно)  
**Результат:** Полностью работающий сайт с защитой от спама
