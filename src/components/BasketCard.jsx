'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IoTrashOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { removeItem, setQuantity } from '../store/basketSlice.js';
import categories from '../data/categories.js';
import { getProductImageUrl } from '../lib/constants.js';

// Single basket row, inspired by the example you provided.
// Keeps its own input state but synchronizes to Redux on every valid change.
export function BasketCard({ item }) {
  const dispatch = useDispatch();
  const { id, quantity: initialQty, rose } = item;

  const [quantity, setQuantityLocal] = useState(initialQty);

  // Use stock from rose as the max; if not provided, default to 3000 as per design.
  const maxQuantity =
    typeof rose?.stock === 'number' && rose.stock > 0 ? rose.stock : 3000;

  useEffect(() => {
    setQuantityLocal(initialQty);
  }, [initialQty]);

  const handleQuantityChange = (e) => {
    // Keep only digits
    let value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      // Allow empty while typing
      setQuantityLocal('');
      return;
    }

    const numValue = Number(value);

    if (numValue > maxQuantity) {
      toast.error(`Максимальное доступное количество: ${maxQuantity}`);
      setQuantityLocal(maxQuantity);
      dispatch(setQuantity({ id, quantity: maxQuantity }));
    } else {
      setQuantityLocal(numValue);
      dispatch(setQuantity({ id, quantity: numValue }));
    }
  };

  const handleBlur = () => {
    if (quantity === '' || quantity <= 0) {
      // Enforce minimum of 1 on blur
      setQuantityLocal(1);
      dispatch(setQuantity({ id, quantity: 1 }));
    }
  };

  const displayMax = maxQuantity;
  const primaryImage = getProductImageUrl(rose?.images?.[0]);

  // Get category name(s) from category ID(s)
  const getCategoryNames = (categoryValue) => {
    if (!categoryValue) return null;
    
    // Handle comma-separated categories (e.g., "6,9")
    const categoryIds = String(categoryValue).split(',').map(id => {
      const numId = parseInt(id.trim(), 10);
      return isNaN(numId) ? null : numId;
    }).filter(Boolean);

    if (categoryIds.length === 0) return null;

    // Find matching category names
    const categoryNames = categoryIds
      .map(id => categories.find(c => c.id === id)?.nameRu)
      .filter(Boolean);

    return categoryNames.length > 0 ? categoryNames.join(', ') : null;
  };

  const categoryDisplay = rose?.category ? getCategoryNames(rose.category) : null;

  return (
    <li className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      {/* Left side: Image and Info */}
      <div className="flex flex-1 gap-4">
        {/* Image */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-28 sm:w-28">
          <img
            src={primaryImage}
            alt={rose?.name_ru || rose?.name || rose?.name_en || id}
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
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">
            {rose?.name_ru || rose?.name || rose?.name_en || id}
          </h2>
          {rose && categoryDisplay && (
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">Категория:</span>{' '}
              {categoryDisplay}
            </p>
          )}
          <p className="hidden mt-1 text-xs text-emerald-600">
            В наличии: <span className="font-medium">{displayMax}</span> шт
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-6">
        {/* Remove button */}
        <button
          type="button"
          onClick={() => dispatch(removeItem(id))}
          className="inline-flex items-center gap-1 text-xs text-slate-400 twitter-hover:text-red-600 hover:text-red-600 transition-colors"
        >
          <span>Удалить</span>
          <IoTrashOutline className="text-sm" />
        </button>

        {/* Quantity Input */}
        <div className="flex items-center gap-2">
          {displayMax != null && (
            <span className="hidden text-xs text-slate-400 sm:inline">
              Макс: {displayMax}
            </span>
          )}
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            className="h-10 w-20 rounded-md border border-slate-300 bg-white px-3 text-center text-base text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>
    </li>
  );
}


