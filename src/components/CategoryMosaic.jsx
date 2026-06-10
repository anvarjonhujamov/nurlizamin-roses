import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_TILES } from '@/data/siteContent';

export function CategoryMosaic() {
  return (
    <section className="bg-cream-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold text-nursery-900 sm:text-3xl">
            Каталог
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Английские, чайно-гибридные, плетистые, спрей и другие розы.
            Просматривайте ассортимент и оставляйте заявку на опт.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm shadow-sm"
            >
              <Image
                src={cat.image}
                alt={cat.nameRu}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 rounded-sm bg-white/95 px-3 py-2 text-center text-xs font-semibold text-nursery-800 sm:text-sm">
                {cat.nameRu}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
