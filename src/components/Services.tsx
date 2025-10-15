import { Droplets, CircleDot, Fuel, Cable, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Service {
  icon: typeof Droplets;
  title: string;
  description: string;
  features: string[];
  gradient: string;
}

export default function Services() {
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  const services: Service[] = [
    {
      icon: Droplets,
      title: 'Прокладка водопровода',
      description: 'Монтаж водопроводных систем любой сложности с использованием современных технологий ГНБ',
      features: [
        'Диаметр труб от 32 до 315 мм',
        'Глубина прокладки до 10 метров',
        'Сварка полиэтиленовых труб',
        'Монтаж запорной арматуры',
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CircleDot,
      title: 'Прокладка канализации',
      description: 'Установка канализационных систем с соблюдением всех санитарных норм и уклонов',
      features: [
        'Трубы диаметром от 110 до 630 мм',
        'Прокол под дорогами',
        'Монтаж смотровых колодцев',
        'Врезка в магистральные сети',
      ],
      gradient: 'from-gray-600 to-gray-800',
    },
    {
      icon: Fuel,
      title: 'Прокладка газопровода',
      description: 'Безопасная прокладка газовых коммуникаций с получением всех необходимых разрешений',
      features: [
        'Работа с трубами любого диаметра',
        'Испытания на герметичность',
        'Оформление документации',
        'Сертифицированные специалисты',
      ],
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Cable,
      title: 'Прокладка кабельных линий',
      description: 'Установка защитных футляров для электрических, телефонных и оптоволоконных кабелей',
      features: [
        'Защитные футляры до 200 мм',
        'Прокладка под препятствиями',
        'Безопасность кабельных линий',
        'Быстрые сроки выполнения',
      ],
      gradient: 'from-yellow-500 to-amber-600',
    },
  ];

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Наши услуги
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Профессиональная прокладка коммуникаций
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выполняем полный комплекс работ по прокладке инженерных сетей методом ГНБ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isExpanded = expandedIndexes.has(index);

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div
                    className={`bg-gradient-to-br ${service.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <button
                    onClick={() => {
                      setExpandedIndexes(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(index)) {
                          newSet.delete(index);
                        } else {
                          newSet.add(index);
                        }
                        return newSet;
                      });
                    }}
                    className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all mb-4"
                  >
                    {isExpanded ? 'Скрыть детали' : 'Узнать больше'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Что входит в работу:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Работаем под ключ</h3>
          <p className="text-xl text-blue-100 mb-6">
            Выполняем все виды сопутствующих работ: сварка труб, монтаж арматуры,
            врезки в магистрали, обвязка колодцев
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-blue-200 text-sm">Круглосуточно</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-blue-200 text-sm">Гарантия</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">15+</div>
              <div className="text-blue-200 text-sm">Лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-blue-200 text-sm">Проектов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
