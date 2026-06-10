import Image from 'next/image';
import plantsImage from '@/assets/plants.webp';

const PLANT_CLASSES = [
  {
    title: 'Премиум-класс',
    emoji: '🌹',
    points: [
      'Более мощная корневая система.',
      'Большее количество побегов.',
      'Крепкие и хорошо развитые саженцы.',
      'Подходят для экспорта и профессионального выращивания.',
    ],
  },
  {
    title: 'Эконом-класс',
    emoji: '🌹',
    points: [
      'Стандартные качественные саженцы.',
      'Минимум 3 побега на каждом саженце.',
      'Более доступная цена.',
    ],
  },
];

export function PlantsSection() {
  return (
    <section className="bg-cream-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center font-display text-2xl font-semibold text-nursery-900 sm:text-3xl">
        Наши саженцы
        </h2>

        <div className="overflow-hidden rounded-sm border border-cream-200 bg-white shadow-sm">
          <Image
            src={plantsImage}
            alt="Саженцы роз — премиум и эконом класс"
            className="h-auto w-full"
            sizes="(max-width: 1200px) 100vw, 1152px"
            priority
          />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-8">
          {PLANT_CLASSES.map((item) => (
            <div
              key={item.title}
              className="rounded-sm border border-cream-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h3 className="font-display text-xl font-semibold text-nursery-900 sm:text-2xl">
                <span className="mr-2" aria-hidden>
                  {item.emoji}
                </span>
                {item.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nursery-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
