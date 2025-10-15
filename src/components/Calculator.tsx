import { useState } from 'react';
import { Calculator as CalcIcon, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';
import { saveCalculatorData } from '../utils/calculatorCache';
import { useCart } from '../contexts/CartContext';

interface CalculatorProps {
  onNavigate: (section: string) => void;
}

export default function Calculator({ onNavigate }: CalculatorProps) {
  const { addItem } = useCart();
  const [formData, setFormData] = useState({
    serviceType: 'gnb',
    length: '',
    diameter: '110',
    soilType: 'normal',
    complexity: 'normal',
  });

  const [result, setResult] = useState<number | null>(null);
  const [calculatedLength, setCalculatedLength] = useState<string>('');
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showLengthWarning, setShowLengthWarning] = useState(false);

  const serviceTypes = [
    { value: 'gnb', label: 'Услуга ГНБ', basePrice: 800 },
    { value: 'water', label: 'Прокладка водопровода', basePrice: 900 },
    { value: 'sewage', label: 'Прокладка канализации', basePrice: 850 },
    { value: 'cable', label: 'Прокладка кабельных линий', basePrice: 750 },
  ];

  const diameterMultipliers: Record<string, number> = {
    '32': 0.7,
    '50': 0.8,
    '110': 1.0,
    '160': 1.3,
    '225': 1.6,
    '315': 2.0,
  };

  const soilMultipliers: Record<string, number> = {
    soft: 1.0,
    normal: 1.2,
    hard: 1.5,
    rock: 2.0,
  };

  const complexityMultipliers: Record<string, number> = {
    simple: 1.0,
    normal: 1.3,
    complex: 1.8,
  };

  const getSoilTypeLabel = (value: string): string => {
    const labels: Record<string, string> = {
      soft: 'Мягкий (песок, чернозём)',
      normal: 'Обычный (суглинок)',
      hard: 'Твёрдый (глина)',
      rock: 'Скальный грунт',
    };
    return labels[value] || value;
  };

  const getComplexityLabel = (value: string): string => {
    const labels: Record<string, string> = {
      simple: 'Простая (открытая местность)',
      normal: 'Средняя (под дорогой)',
      complex: 'Сложная (препятствия, ж/д)',
    };
    return labels[value] || value;
  };

  const calculatePrice = () => {
    const length = parseFloat(formData.length);
    if (!length || length <= 0) {
      return;
    }

    if (length > 10000) {
      setShowLengthWarning(true);
      return;
    }

    const service = serviceTypes.find((s) => s.value === formData.serviceType);
    if (!service) return;

    const basePrice = service.basePrice;
    const diameterMult = diameterMultipliers[formData.diameter] || 1.0;
    const soilMult = soilMultipliers[formData.soilType] || 1.0;
    const complexityMult = complexityMultipliers[formData.complexity] || 1.0;

    const pricePerMeter = basePrice * diameterMult * soilMult * complexityMult;
    const total = pricePerMeter * length;

    const calculatedPrice = Math.round(total);
    setResult(calculatedPrice);
    setCalculatedLength(formData.length);

    saveCalculatorData({
      serviceType: formData.serviceType,
      serviceLabel: service.label,
      length: formData.length,
      diameter: formData.diameter,
      soilType: formData.soilType,
      soilTypeLabel: getSoilTypeLabel(formData.soilType),
      complexity: formData.complexity,
      complexityLabel: getComplexityLabel(formData.complexity),
      calculatedPrice,
      timestamp: Date.now(),
    });
  };

  const handleAddToCart = () => {
    if (result === null) return;

    const service = serviceTypes.find((s) => s.value === formData.serviceType);
    if (!service) return;

    addItem({
      type: 'calculator',
      service: service.label,
      price: result,
      details: {
        length: formData.length,
        diameter: formData.diameter,
        soilType: getSoilTypeLabel(formData.soilType),
        complexity: getComplexityLabel(formData.complexity),
      },
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <section id="calculator" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      {showLengthWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Слишком большая длина
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Максимальная длина для расчета: <strong>10 000 метров</strong>.
                Для более крупных проектов, пожалуйста, свяжитесь с нами напрямую для индивидуального расчета.
              </p>
              <button
                onClick={() => setShowLengthWarning(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Калькулятор стоимости
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Рассчитайте стоимость работ
          </h2>
          <p className="text-xl text-gray-600">
            Получите предварительную смету за несколько секунд
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Вид работы
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Длина прокладки (метры)
                </label>
                <input
                  type="number"
                  value={formData.length}
                  onChange={(e) =>
                    setFormData({ ...formData, length: e.target.value })
                  }
                  placeholder="Например: 50"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Диаметр трубы (мм)
                </label>
                <select
                  value={formData.diameter}
                  onChange={(e) =>
                    setFormData({ ...formData, diameter: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="32">32 мм</option>
                  <option value="50">50 мм</option>
                  <option value="110">110 мм</option>
                  <option value="160">160 мм</option>
                  <option value="225">225 мм</option>
                  <option value="315">315 мм</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Тип грунта
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) =>
                    setFormData({ ...formData, soilType: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="soft">Мягкий (песок, чернозём)</option>
                  <option value="normal">Обычный (суглинок)</option>
                  <option value="hard">Твёрдый (глина)</option>
                  <option value="rock">Скальный грунт</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Сложность проекта
                </label>
                <select
                  value={formData.complexity}
                  onChange={(e) =>
                    setFormData({ ...formData, complexity: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="simple">Простая (открытая местность)</option>
                  <option value="normal">Средняя (под дорогой)</option>
                  <option value="complex">Сложная (препятствия, ж/д)</option>
                </select>
              </div>

              <button
                onClick={calculatePrice}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <CalcIcon className="w-5 h-5" />
                Рассчитать стоимость
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-10 text-white flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Результат расчёта</h3>
                </div>

                {result !== null ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <div className="text-blue-200 text-sm mb-2">
                        Предварительная стоимость:
                      </div>
                      <div className="text-5xl font-bold mb-2">
                        {result.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="text-blue-200 text-sm">
                        {calculatedLength &&
                          `~${Math.round(result / parseFloat(calculatedLength))} ₽/метр`}
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
                      <p className="text-blue-100">
                        Итоговая цена может отличаться в зависимости от необходимости
                        оформления разрешительной документации, стоимости материалов и
                        дополнительных земляных работ.
                      </p>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2 border-2 border-white/40"
                    >
                      {showAddedMessage ? (
                        <>
                          <AlertCircle className="w-5 h-5" />
                          Добавлено в заказ
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Добавить в заказ
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onNavigate('contact')}
                      className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                    >
                      Отправить заявку
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                    <CalcIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-blue-100">
                      Заполните форму слева и нажмите кнопку "Рассчитать стоимость",
                      чтобы получить предварительную смету
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-100">
                  <strong className="text-white">Важно:</strong> Это предварительный
                  расчёт. Точную стоимость мы сообщим после выезда на объект и оценки
                  всех условий работы.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
