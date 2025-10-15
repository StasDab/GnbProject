import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ShoppingCart, X } from 'lucide-react';
import { getCalculatorData } from '../utils/calculatorCache';
import { useCart } from '../contexts/CartContext';

// API URL для разных окружений
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-vercel-project.vercel.app' // Замените на ваш Vercel URL
    : 'http://localhost:3000'
  );

export default function Contact() {
  const { items: cartItems, removeItem, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    message: '',
    website: '', // 🍯 Honeypot поле - должно оставаться пустым!
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // 🍯 Honeypot проверка - если поле заполнено, это бот!
    if (formData.website) {
      console.log('🤖 Бот обнаружен! Honeypot поле заполнено.');
      // Делаем вид, что отправили успешно, чтобы обмануть бота
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    const calculatorData = getCalculatorData();

    try {
      // Теперь отправляем на НАШ сервер, а он уже общается с Telegram ✅
      const response = await fetch(`${API_URL}/api/send-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          serviceType: formData.serviceType,
          message: formData.message,
          cartItems: cartItems,
          calculatorData: calculatorData,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          serviceType: '',
          message: '',
        });
        clearCart();

        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        throw new Error(data.error || 'Ошибка отправки сообщения');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Не удалось отправить заявку. Попробуйте позже или позвоните нам.'
      );
      console.error('Error sending to Telegram:', error);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      details: ['+7 (3812) XXX-XXX', '+7 (913) XXX-XX-XX'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@gnb-omsk.ru'],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: MapPin,
      title: 'Адрес',
      details: ['г. Омск', 'Работаем по всей области'],
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Clock,
      title: 'Режим работы',
      details: ['Круглосуточно', '7 дней в неделю'],
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Контакты
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Свяжитесь с нами
          </h2>
          <p className="text-xl text-gray-600">
            Ответим на все вопросы и предоставим бесплатную консультацию
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-center"
              >
                <div
                  className={`bg-gradient-to-br ${item.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                {item.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">Оставьте заявку</h3>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Заполните форму, и наш специалист свяжется с вами в ближайшее время для
                уточнения деталей и расчёта стоимости работ.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Бесплатный выезд</h4>
                    <p className="text-blue-200 text-sm">
                      Специалист приедет на объект и проведёт замеры
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Точный расчёт</h4>
                    <p className="text-blue-200 text-sm">
                      Предоставим детальную смету с учётом всех условий
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Быстрый ответ</h4>
                    <p className="text-blue-200 text-sm">
                      Ответим на заявку в течение 15 минут
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-blue-500">
                <p className="text-blue-100 text-sm">
                  Работаем с физическими и юридическими лицами. Предоставляем все
                  необходимые документы и гарантию на выполненные работы.
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {cartItems.length > 0 && (
                <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Корзина заказа</h4>
                    </div>
                    <span className="text-sm text-gray-600">
                      {cartItems.length} {cartItems.length === 1 ? 'услуга' : 'услуги'}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl p-3 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm mb-1">
                            {item.service}
                          </div>
                          {item.details && (
                            <div className="text-xs text-gray-600 space-y-0.5">
                              {item.details.length && (
                                <div>Длина: {item.details.length} м</div>
                              )}
                              {item.details.diameter && (
                                <div>Диаметр: {item.details.diameter} мм</div>
                              )}
                            </div>
                          )}
                          <div className="text-sm font-bold text-blue-600 mt-1">
                            {item.priceLabel || `${item.price.toLocaleString('ru-RU')} ₽`}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          title="Удалить"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Итого:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {(() => {
                        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
                        const hasContractPrice = cartItems.some(item => item.priceLabel);
                        return total > 0 ? `${total.toLocaleString('ru-RU')} ₽${hasContractPrice ? ' + договорная' : ''}` : 'Договорная';
                      })()}
                    </span>
                  </div>
                </div>
              )}
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Заявка отправлена!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Спасибо за обращение. Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Отправить ещё одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="+7 (XXX) XXX-XX-XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="example@mail.ru"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Интересующая услуга
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Выберите услугу</option>
                      <option value="Прокладка водопровода">
                        Прокладка водопровода
                      </option>
                      <option value="Прокладка канализации">
                        Прокладка канализации
                      </option>
                      <option value="Прокладка газопровода">
                        Прокладка газопровода
                      </option>
                      <option value="Прокладка кабельных линий">
                        Прокладка кабельных линий
                      </option>
                      <option value="Другое">Другое</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Сообщение
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                      placeholder="Опишите ваш проект, примерную длину прокладки и другие детали..."
                    />
                  </div>

                  {/* 🍯 Honeypot поле - скрыто от людей, но видно ботам */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">Ваш сайт</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Отправить заявку
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой обработки персональных
                    данных
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
