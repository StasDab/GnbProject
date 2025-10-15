/**
 * ПРОСТОЙ BACKEND PROXY ДЛЯ TELEGRAM API
 * 
 * Этот сервер скрывает токен Telegram бота от клиентского кода
 * 
 * УСТАНОВКА:
 * 1. Создайте папку для сервера: mkdir telegram-server && cd telegram-server
 * 2. Инициализируйте проект: npm init -y
 * 3. Установите зависимости: npm install express cors dotenv
 * 4. Создайте файл .env с токенами (см. .env.example)
 * 5. Запустите: node server.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Конфигурация Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Валидация конфигурации
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ ОШИБКА: Отсутствуют переменные окружения TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
  process.exit(1);
}

// 🛡️ Улучшенная защита от спама и DDoS
const requestCounts = new Map();
const blacklist = new Map(); // IP черный список
const suspiciousIPs = new Map(); // Подозрительные IP

const RATE_LIMIT = 3; // максимум 3 запроса
const RATE_WINDOW = 60 * 1000; // за 1 минуту
const BLACKLIST_DURATION = 60 * 60 * 1000; // бан на 1 час
const MAX_VIOLATIONS = 3; // 3 нарушения = бан

// Проверка IP в черном списке
function isBlacklisted(ip) {
  const blacklistTime = blacklist.get(ip);
  if (!blacklistTime) return false;
  
  if (Date.now() - blacklistTime > BLACKLIST_DURATION) {
    blacklist.delete(ip);
    return false;
  }
  
  return true;
}

// Добавление IP в черный список
function addToBlacklist(ip, reason = 'Rate limit exceeded') {
  blacklist.set(ip, Date.now());
  console.log(`🚫 IP ${ip} добавлен в черный список. Причина: ${reason}`);
}

// Улучшенный Rate Limiting с blacklist
function checkRateLimit(ip) {
  // Проверка черного списка
  if (isBlacklisted(ip)) {
    console.log(`🚫 Заблокированный IP пытается отправить запрос: ${ip}`);
    return { allowed: false, reason: 'blacklisted' };
  }

  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Удаляем старые запросы
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    // Увеличиваем счетчик нарушений
    const violations = (suspiciousIPs.get(ip) || 0) + 1;
    suspiciousIPs.set(ip, violations);
    
    console.log(`⚠️ Rate limit превышен для IP ${ip} (нарушение ${violations}/${MAX_VIOLATIONS})`);
    
    // Если слишком много нарушений - в черный список!
    if (violations >= MAX_VIOLATIONS) {
      addToBlacklist(ip, `${violations} превышений rate limit`);
    }
    
    return { allowed: false, reason: 'rate_limit' };
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return { allowed: true };
}

// Валидация телефона
function isValidPhone(phone) {
  // Базовая проверка: должны быть цифры, может быть +, -, (, ), пробелы
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

// Валидация email
function isValidEmail(email) {
  if (!email) return true; // email опциональный
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Проверка на спам (простая эвристика)
function isSpam(text) {
  if (!text) return false;
  
  const spamKeywords = [
    'casino', 'viagra', 'porn', 'xxx', 'bitcoin',
    'gambling', 'lottery', 'winner', 'congratulations',
    'click here', 'buy now', 'free money'
  ];
  
  const lowerText = text.toLowerCase();
  return spamKeywords.some(keyword => lowerText.includes(keyword));
}

// Endpoint для отправки сообщений в Telegram
app.post('/api/send-telegram', async (req, res) => {
  try {
    // 1️⃣ Rate limiting с blacklist
    const clientIp = req.ip || req.connection.remoteAddress;
    const rateLimitResult = checkRateLimit(clientIp);
    
    if (!rateLimitResult.allowed) {
      if (rateLimitResult.reason === 'blacklisted') {
        return res.status(403).json({ 
          error: 'Ваш IP заблокирован. Обратитесь в поддержку.' 
        });
      }
      return res.status(429).json({ 
        error: 'Слишком много запросов. Попробуйте через минуту.' 
      });
    }

    // 2️⃣ Honeypot проверка - если поле website заполнено, это бот!
    const { name, phone, email, serviceType, message, cartItems, calculatorData, website } = req.body;
    
    if (website) {
      console.log(`🤖 Бот обнаружен! Honeypot активирован. IP: ${clientIp}`);
      addToBlacklist(clientIp, 'Honeypot triggered');
      
      // Возвращаем success, чтобы обмануть бота
      return res.json({ success: true, message: 'OK' });
    }

    // 3️⃣ Валидация обязательных полей
    if (!name || !phone) {
      console.log(`⚠️ Отсутствуют обязательные поля. IP: ${clientIp}`);
      return res.status(400).json({ 
        error: 'Имя и телефон обязательны' 
      });
    }

    // 4️⃣ Валидация формата телефона
    if (!isValidPhone(phone)) {
      console.log(`⚠️ Неверный формат телефона: ${phone}. IP: ${clientIp}`);
      return res.status(400).json({ 
        error: 'Неверный формат номера телефона' 
      });
    }

    // 5️⃣ Валидация email (если указан)
    if (email && !isValidEmail(email)) {
      console.log(`⚠️ Неверный формат email: ${email}. IP: ${clientIp}`);
      return res.status(400).json({ 
        error: 'Неверный формат email' 
      });
    }

    // 6️⃣ Проверка на спам keywords
    const fullText = `${name} ${email} ${message}`.toLowerCase();
    if (isSpam(fullText)) {
      console.log(`🚫 Обнаружен спам! IP: ${clientIp}, Текст: ${fullText.substring(0, 50)}...`);
      addToBlacklist(clientIp, 'Spam detected');
      return res.status(400).json({ 
        error: 'Сообщение содержит недопустимый контент' 
      });
    }

    // 7️⃣ Санитизация данных
    const sanitize = (str) => String(str).substring(0, 500);

    // Формирование информации о корзине
    let cartInfo = '';
    if (cartItems && cartItems.length > 0) {
      cartInfo = `
🛒 Товары в корзине:
━━━━━━━━━━━━━━━━━━━
`;
      cartItems.forEach((item, index) => {
        cartInfo += `
${index + 1}. ${sanitize(item.service)}
💰 Стоимость: ${item.priceLabel || (item.price.toLocaleString('ru-RU') + ' ₽')}
`;
        if (item.details) {
          if (item.details.length) cartInfo += `📏 Длина: ${item.details.length} м\n`;
          if (item.details.diameter) cartInfo += `⚙️ Диаметр: ${item.details.diameter} мм\n`;
          if (item.details.soilType) cartInfo += `🌍 Грунт: ${sanitize(item.details.soilType)}\n`;
          if (item.details.complexity) cartInfo += `🏗 Сложность: ${sanitize(item.details.complexity)}\n`;
        }
      });

      const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
      const hasContractPrice = cartItems.some(item => item.priceLabel);
      cartInfo += `
━━━━━━━━━━━━━━━━━━━
💵 Общая стоимость: ${totalPrice > 0 ? totalPrice.toLocaleString('ru-RU') + ' ₽' : ''}${hasContractPrice ? ' (+ договорная)' : ''}
`;
    } else if (calculatorData) {
      cartInfo = `
📊 Данные из калькулятора:
━━━━━━━━━━━━━━━━━━━
🔧 Услуга: ${sanitize(calculatorData.serviceLabel)}
📏 Длина прокладки: ${calculatorData.length} м
⚙️ Диаметр трубы: ${calculatorData.diameter} мм
🌍 Тип грунта: ${sanitize(calculatorData.soilTypeLabel)}
🏗 Сложность: ${sanitize(calculatorData.complexityLabel)}
💰 Рассчитанная стоимость: ${calculatorData.calculatedPrice.toLocaleString('ru-RU')} ₽
━━━━━━━━━━━━━━━━━━━
`;
    }

    // Формирование сообщения для Telegram
    const telegramMessage = `
🔔 Новая заявка с сайта ГНБ

👤 Имя: ${sanitize(name)}
📞 Телефон: ${sanitize(phone)}
📧 Email: ${email ? sanitize(email) : 'Не указан'}
🔧 Услуга: ${serviceType ? sanitize(serviceType) : 'Не указана'}

💬 Сообщение:
${message ? sanitize(message) : 'Не указано'}
${cartInfo}
⏰ Дата: ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // Отправка в Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      throw new Error('Ошибка Telegram API');
    }

    // Успешная отправка
    console.log(`✅ Заявка отправлена от: ${name} (${phone})`);
    res.json({ 
      success: true, 
      message: 'Заявка успешно отправлена' 
    });

  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    res.status(500).json({ 
      error: 'Не удалось отправить заявку. Попробуйте позже.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Telegram Proxy Server запущен!');
  console.log(`📡 Порт: ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/send-telegram`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Получен сигнал SIGTERM, завершение работы...');
  process.exit(0);
});

