/**
 * Vercel Serverless Function для отправки заявок в Telegram
 * 
 * ДЕПЛОЙ:
 * 1. Зарегистрируйтесь на vercel.com
 * 2. Создайте новый проект
 * 3. Подключите ваш GitHub репозиторий
 * 4. Добавьте переменные окружения в Settings → Environment Variables
 * 5. Deploy!
 */

export default async function handler(req, res) {
  // CORS headers для разрешения запросов с любых доменов
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем переменные окружения (БЕЗОПАСНО - только на сервере!)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Проверяем наличие токенов
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Отсутствуют переменные окружения в Vercel Dashboard');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact administrator.' 
      });
    }

    // Получаем данные из запроса
    const { 
      name, 
      phone, 
      email, 
      serviceType, 
      message, 
      cartItems, 
      calculatorData,
      website // Honeypot поле
    } = req.body;

    // 1️⃣ Honeypot проверка
    if (website) {
      console.log('🤖 Бот обнаружен! Honeypot активирован');
      // Возвращаем success, чтобы обмануть бота
      return res.json({ success: true, message: 'OK' });
    }

    // 2️⃣ Валидация обязательных полей
    if (!name || !phone) {
      console.log('⚠️ Отсутствуют обязательные поля');
      return res.status(400).json({ 
        error: 'Имя и телефон обязательны' 
      });
    }

    // 3️⃣ Валидация формата телефона
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone)) {
      console.log('⚠️ Неверный формат телефона');
      return res.status(400).json({ 
        error: 'Неверный формат номера телефона' 
      });
    }

    // 4️⃣ Валидация email (если указан)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('⚠️ Неверный формат email');
        return res.status(400).json({ 
          error: 'Неверный формат email' 
        });
      }
    }

    // 5️⃣ Проверка на спам
    const spamKeywords = [
      'casino', 'viagra', 'porn', 'xxx', 'bitcoin',
      'gambling', 'lottery', 'winner', 'congratulations',
      'click here', 'buy now', 'free money'
    ];
    
    const fullText = `${name} ${email} ${message}`.toLowerCase();
    if (spamKeywords.some(keyword => fullText.includes(keyword))) {
      console.log('🚫 Обнаружен спам!');
      return res.status(400).json({ 
        error: 'Сообщение содержит недопустимый контент' 
      });
    }

    // 6️⃣ Санитизация данных
    const sanitize = (str) => String(str || '').substring(0, 500);

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
}
