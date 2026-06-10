'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiCloud } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { getProductImageUrl } from '../lib/constants.js';
import { getCategoryNames, getAromaInfo } from '../utils/roseInfo.js';

export function RoseDetailModal({ rose, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mainSwiper, setMainSwiper] = useState(null);

  useEffect(() => {
    if (!rose) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [rose]);

  if (!rose) return null;

  const images = Array.isArray(rose.images) && rose.images.length > 0 ? rose.images : [null];
  const categoryDisplay = getCategoryNames(rose.category) || 'Роза';
  const aromaInfo = getAromaInfo(rose.smell);
  const displayName = rose.name_ru || rose.name || 'Роза';

  const specRows = [
    { label: 'Категория', value: categoryDisplay },
    ...(aromaInfo != null
      ? [{ label: 'Аромат', value: aromaInfo.label, clouds: aromaInfo.clouds }]
      : []),
    ...(rose.height ? [{ label: 'Высота', value: `${rose.height} см` }] : []),
    ...(rose.breeder ? [{ label: 'Селекционер', value: rose.breeder }] : []),
  ];

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      role="presentation"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:p-4 md:p-6 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rose-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-[min(100%,24rem)] max-h-[min(92dvh,40rem)] flex-col overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200/80 transition-all duration-200 sm:max-w-md md:max-w-3xl md:max-h-[min(92dvh,44rem)] lg:max-w-5xl lg:max-h-[min(94dvh,52rem)] ${isAnimating ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-[0.98] opacity-0'}`}
      >
        <header className="flex shrink-0 items-start gap-2 border-b border-slate-100 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0 flex-1 pr-1">
            <h2
              id="rose-modal-title"
              className="font-rose text-lg font-semibold leading-snug text-nursery-800 sm:text-xl md:text-2xl"
            >
              {displayName}
            </h2>
            {rose.name_en && (
              <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                {rose.name_en}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 active:scale-95 sm:p-2"
            aria-label="Закрыть"
          >
            <IoClose size={20} className="sm:h-6 sm:w-6" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-2 p-2.5 sm:gap-3 sm:p-3 md:grid md:grid-cols-2 md:gap-4 md:p-4 lg:gap-5 lg:p-5">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation={images.length > 1}
                  spaceBetween={0}
                  slidesPerView={1}
                  onSwiper={setMainSwiper}
                  onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                  className="h-full w-full modal-gallery-swiper"
                >
                  {images.map((img, idx) => {
                    const src = getProductImageUrl(img);
                    return (
                      <SwiperSlide key={idx}>
                        <img
                          src={src}
                          alt={displayName}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.fallback) {
                              target.dataset.fallback = 'true';
                              target.src = getProductImageUrl();
                            }
                          }}
                          className="h-full w-full object-cover"
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>

              {images.length > 1 && (
                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {images.map((img, idx) => {
                    const thumbSrc = getProductImageUrl(img);
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => mainSwiper?.slideTo(idx)}
                        className={`h-10 w-10 overflow-hidden rounded-md border-2 transition sm:h-12 sm:w-12 ${
                          isActive
                            ? 'border-emerald-500 ring-1 ring-emerald-200'
                            : 'border-slate-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={thumbSrc}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <dl className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 text-xs sm:text-sm">
                {specRows.map(({ label, value, clouds }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 sm:px-2.5 sm:py-2"
                  >
                    <dt className="shrink-0 text-slate-500">{label}</dt>
                    <dd className="flex items-center gap-1 text-right font-medium text-slate-900">
                      <span className="break-words">{value}</span>
                      {clouds != null && (
                        <span className="flex items-center gap-0.5" aria-hidden>
                          {Array.from({ length: clouds }).map((_, i) => (
                            <FiCloud key={i} className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          ))}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {rose.description && (
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm line-clamp-4 md:line-clamp-none">
                  {rose.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
