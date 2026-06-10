import Link from 'next/link';
import Image from 'next/image';
import fonImage from '@/assets/fon.webp';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src={fonImage}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex min-h-[85vh] items-center justify-center px-4 pt-16">
        <div className="w-full max-w-2xl rounded-sm bg-white/90 px-8 py-10 text-center shadow-xl backdrop-blur-sm sm:px-12 sm:py-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-nursery-600">
            Питомник роз
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight text-nursery-900 sm:text-5xl">
            Nurli Zamin
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
          Профессиональное выращивание и оптовые поставки саженцев роз с гарантией сортового соответствия.
          </p>
          <Link
            href="/catalog"
            className="mt-8 inline-block bg-nursery-700 px-10 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-nursery-800"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </section>
  );
}
