import Image from 'next/image';
import Link from 'next/link';
import { WHY_US_ITEMS } from '@/data/siteContent';

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-nursery-900 sm:text-4xl">
            Почему именно мы?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Мы выращиваем и производим  розы — саженцы с любовью и вниманием к деталям.
            Каждый сорт проходит строгую сортировку для оптовых партнёров.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {WHY_US_ITEMS.map((item) => (
            <article key={item.title} className="text-center">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-nursery-900 sm:text-lg">
                {item.title}
              </h3>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/zayavka"
            className="inline-block border-2 border-nursery-700 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-nursery-700 transition hover:bg-nursery-700 hover:text-white"
          >
            Оставить заявку на опт
          </Link>
        </div>
      </div>
    </section>
  );
}
