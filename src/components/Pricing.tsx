import { Check, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface PricingProps {
  onNavigate: (section: string) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const { items: cartItems, addItem, removeItem } = useCart();
  
  // Проверяем, есть ли услуга в корзине
  const isInCart = (serviceName: string) => {
    return cartItems.some(item => item.service === serviceName && item.type === 'pricing');
  };

  // Находим ID элемента в корзине по имени услуги
  const getCartItemId = (serviceName: string) => {
    const item = cartItems.find(item => item.service === serviceName && item.type === 'pricing');
    return item?.id;
  };

  const pricingData = [
    {
      service: 'Услуга ГНБ',
      priceRange: 'от 600 ₽/м — от 1 000 ₽/м',
      note: 'Стоимость бурения',
      popular: true,
    },
    {
      service: 'Прокладка водопровода',
      priceRange: 'Цена договорная',
      note: 'Зависит от диаметра и длины',
      popular: false,
    },
    {
      service: 'Прокладка канализации',
      priceRange: 'от 10 000 ₽',
      note: 'Работы под ключ',
      popular: false,
    },
    {
      service: 'Прокол канализации',
      priceRange: 'Цена договорная',
      note: 'Индивидуальный расчёт',
      popular: false,
    },
    {
      service: 'Проведение коммуникаций под землей',
      priceRange: '40 000 ₽',
      note: 'Комплексное решение',
      popular: false,
    },
  ];

  const includedServices = [
    'Сварка ПЭ труб',
    'Монтаж запорной арматуры',
    'Врезки в магистрали',
    'Обвязка и монтаж колодцев',
    'Испытания систем',
    'Гарантия на работы',
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Расценки
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Цены на услуги ГНБ в Омске
          </h2>
          <p className="text-xl text-gray-600">
            Прозрачное ценообразование и честные условия сотрудничества
          </p>
        </div>

        <div className="grid gap-4 mb-12">
          {pricingData.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 ${
                item.popular
                  ? 'border-blue-500 relative'
                  : 'border-gray-100'
              }`}
            >
              {item.popular && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Популярное
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {item.service}
                    </h3>
                    <p className="text-sm text-gray-600">{item.note}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {item.priceRange}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        // Для "Услуга ГНБ" (index 0) - переход на калькулятор
                        if (index === 0) {
                          onNavigate('calculator');
                          return;
                        }

                        // Для остальных - добавление/удаление из корзины
                        const itemInCart = isInCart(item.service);
                        
                        if (itemInCart) {
                          // Если уже в корзине - удаляем
                          const cartItemId = getCartItemId(item.service);
                          if (cartItemId) {
                            removeItem(cartItemId);
                          }
                        } else {
                          // Если нет в корзине - добавляем
                          const priceStr = item.priceRange.match(/\d[\d\s]*/);
                          const price = priceStr ? parseInt(priceStr[0].replace(/\s/g, '')) : 0;
                          const priceLabel = price === 0 ? 'Договорная' : undefined;

                          addItem({
                            type: 'pricing',
                            service: item.service,
                            price: price,
                            priceLabel: priceLabel,
                          });
                        }
                      }}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        index === 0
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                          : isInCart(item.service)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {index === 0 
                        ? 'Рассчитать' 
                        : isInCart(item.service) 
                        ? 'Добавлено ✓' 
                        : 'Заказать'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="bg-amber-200 rounded-full p-3 flex-shrink-0">
              <Info className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Важная информация о ценах
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Итоговая цена рассчитывается индивидуально и может зависеть от
                необходимости оформления разрешительной документации, стоимости труб и
                материалов, а также проведения дополнительных земляных работ. Точную
                стоимость мы озвучим после выезда специалиста на объект и оценки всех
                условий.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Что входит в стоимость работ
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {includedServices.map((service, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{service}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">Бесплатно</div>
                <div className="text-gray-600">Выезд и консультация</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2 года</div>
                <div className="text-gray-600">Гарантия на работы</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Техническая поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
