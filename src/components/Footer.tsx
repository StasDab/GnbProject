import { Drill, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const services = [
    'Прокладка водопровода',
    'Прокладка канализации',
    'Прокладка газопровода',
    'Прокладка кабельных линий',
  ];

  const quickLinks = [
    { label: 'Главная', section: 'hero' },
    { label: 'Услуги', section: 'services' },
    { label: 'Калькулятор', section: 'calculator' },
    { label: 'Цены', section: 'pricing' },
    { label: 'Команда', section: 'team' },
    { label: 'Контакты', section: 'contact' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <Drill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Бригада ГНБ</h3>
                <p className="text-sm text-gray-400">Омск</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Профессиональная прокладка коммуникаций методом горизонтально-направленного
              бурения. Более 15 лет опыта и 500+ успешных проектов.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
              <span>Работаем круглосуточно</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Наши услуги</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Позвоните нам:</p>
                  <a
                    href="tel:+73812000000"
                    className="hover:text-blue-400 transition-colors"
                  >
                    +7 (3812) XXX-XXX
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email:</p>
                  <a
                    href="mailto:info@gnb-omsk.ru"
                    className="hover:text-blue-400 transition-colors"
                  >
                    gnbgroupwork@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Адрес:</p>
                  <p>г. Омск, Россия</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Бригада ГНБ Омск. Все права защищены.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">
                Политика конфиденциальности
              </button>
              <button className="hover:text-white transition-colors">
                Условия использования
              </button>
            </div>
          </div>

          <p className="text-gray-500 text-xs text-center mt-4">
            ИНН: XXXXXXXXXXXX | ОГРН: XXXXXXXXXXXXX | Лицензия на проведение работ
          </p>
        </div>
      </div>
    </footer>
  );
}
