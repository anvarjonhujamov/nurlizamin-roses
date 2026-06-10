import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Страница не найдена</h1>
      <p className="text-slate-600">Запрашиваемая страница не существует.</p>
      <Link
        href="/catalog"
        className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Перейти в каталог
      </Link>
    </div>
  );
}
