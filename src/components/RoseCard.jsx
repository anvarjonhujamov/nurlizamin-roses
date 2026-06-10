'use client';

import { useInView } from '../hooks/useInView.js';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProductImageUrl } from '../lib/constants.js';
import { getRoseDisplayName, isRoseInStock } from '../utils/roseInfo.js';
import { addOne, selectQuantityById } from '../store/basketSlice.js';

export function RoseCard({ rose, onOpen, animationIndex = 0 }) {
  const dispatch = useDispatch();
  const basketQty = useSelector((state) => selectQuantityById(state, rose?.id));
  const [ref, isInView] = useInView();

  const images = rose?.images || [];
  const primaryImage = getProductImageUrl(images[0]);
  const hoverImage = images.length > 1 ? getProductImageUrl(images[1]) : null;
  const displayName = getRoseDisplayName(rose);
  const inStock = isRoseInStock(rose);
  const inBasket = basketQty > 0;

  const delayIndex = (animationIndex % 4) + 1;
  const delayClass = `animation-delay-${delayIndex * 100}`;

  const handleDetails = (e) => {
    e.stopPropagation();
    onOpen?.(rose);
  };

  const handleAddToBasket = (e) => {
    e.stopPropagation();
    if (!inStock || inBasket) return;
    dispatch(addOne(rose.id));
    toast.success('Добавлено в корзину');
  };

  return (
    <div
      ref={ref}
      className={`group flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm card-hover ${isInView ? `animate-fade-up ${delayClass}` : 'opacity-0'}`}
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <img
          src={primaryImage}
          alt={displayName}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = 'true';
              target.src = getProductImageUrl();
            }
          }}
          className={`h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${hoverImage ? 'opacity-100 group-hover:opacity-0' : ''}`}
        />

        {hoverImage && (
          <img
            src={hoverImage}
            alt={displayName}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = getProductImageUrl();
              }
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-1">
        <h3 className="line-clamp-2 font-rose text-sm font-medium leading-snug text-nursery-900 sm:text-base">
          {displayName}
        </h3>

        <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:flex-row sm:gap-2">
          <button
            type="button"
            onClick={handleDetails}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto sm:shrink-0 sm:px-2.5 sm:py-2 sm:text-sm"
          >
            Подробнее
          </button>

          {!inStock ? (
            <span className="flex w-full items-center justify-center rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5 text-sm font-medium text-red-500 sm:min-w-0 sm:flex-1 sm:py-1 sm:text-sm">
              Нет в наличии
            </span>
          ) : inBasket ? (
            <span className="flex w-full items-center justify-center gap-1.5 rounded-md bg-nursery-600 px-2 py-1.5 text-sm font-medium text-white sm:min-w-0 sm:flex-1 sm:py-2 sm:text-sm">
              <FiCheck className="h-4 w-4 shrink-0" />
              В корзине
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAddToBasket}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-teal-600 px-2 py-1.5 text-sm font-medium text-white transition hover:bg-teal-700 active:scale-[0.98] sm:min-w-0 sm:flex-1 sm:py-2 sm:text-sm"
            >
              <span className="sm:hidden">В корзину</span>
              <span className="hidden sm:inline">Добавить в корзину</span>
              <FiShoppingCart className="h-4 w-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
