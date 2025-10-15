import { Gauge, Radio, Wrench, CheckCircle2 } from 'lucide-react';

export default function Team() {
  const team = [
    {
      icon: Gauge,
      role: 'Оператор буровой установки',
      description: 'Управляет всем процессом бурения и контролирует работу оборудования',
      responsibilities: [
        'Управление буровым комплексом',
        'Мониторинг показателей на экране',
        'Контроль процесса бурения пилотной скважины',
        'Координация работы всей бригады',
      ],
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      icon: Radio,
      role: 'Локаторщик',
      description: 'Обеспечивает точность прокладки с помощью локационной системы',
      responsibilities: [
        'Отслеживание траектории буровой головки',
        'Работа с локационной системой',
        'Передача данных о местоположении и глубине',
        'Контроль угла наклона бура',
      ],
      gradient: 'from-green-600 to-emerald-700',
    },
    {
      icon: Wrench,
      role: 'Помбурщик / Монтажники',
      description: 'Готовят трубопровод и выполняют все монтажные работы',
      responsibilities: [
        'Подготовка плети трубопровода',
        'Сварка труб в единую секцию',
        'Подключение к буровой установке',
        'Монтаж запорной арматуры и колодцев',
      ],
      gradient: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <section id="team" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Наша команда
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Профессионалы своего дела
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Слаженная работа специалистов обеспечивает высокое качество и точность
            выполнения проектов любой сложности
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {team.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div
                  className={`bg-gradient-to-br ${member.gradient} p-8 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{member.role}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      Основные задачи:
                    </h4>
                    {member.responsibilities.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Почему выбирают нас
            </h3>
            <p className="text-gray-600 text-lg">
              Опыт, профессионализм и современное оборудование
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-700 font-medium">Лет на рынке</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-700 font-medium">Выполненных проектов</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-700 font-medium">Довольных клиентов</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Круглосуточная работа</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
