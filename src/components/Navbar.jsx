'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiSearch, FiX, FiPhone, FiMenu, FiShoppingCart, FiClock } from 'react-icons/fi';
import { FaTelegram, FaInstagram } from 'react-icons/fa';
import { SITE_CONTACTS } from '../data/contacts.js';
import { selectTotalItems } from '../store/basketSlice.js';
import { useOrderNotification } from '../context/OrderNotificationContext.jsx';
import { useStoreHydrated } from '../context/StoreHydrationContext.jsx';

const NAV_LINKS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/#about', label: 'О питомнике' },
  { href: '/zayavka', label: 'Заявка' },
  { href: '/#contacts', label: 'Контакты' },
];

function NavBadge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-nursery-600 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function Navbar({ searchValue, onSearchChange }) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const pathname = usePathname();
  const showSearch = typeof onSearchChange === 'function';
  const storeHydrated = useStoreHydrated();
  const basketCount = useSelector(selectTotalItems);
  const { unseenCount } = useOrderNotification();

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const isActive = (href) => {
    if (href === '/catalog') return pathname === '/catalog';
    if (href === '/zayavka') return pathname === '/zayavka';
    if (href === '/#about' || href === '/#contacts') return pathname === '/';
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cream-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <img src="/logo.png" alt="Nurli Zamin" className="h-11 w-11 object-contain" />
            <span className="hidden font-display text-lg font-semibold text-nursery-800 sm:inline">
              Nurli Zamin
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition ${
                  isActive(link.href)
                    ? 'text-nursery-700'
                    : 'text-slate-600 hover:text-nursery-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {showSearch && (
            <div className="hidden flex-1 max-w-xs xl:block">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Поиск роз..."
                  className="w-full rounded-full border border-cream-200 bg-cream-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-nursery-400 focus:ring-1 focus:ring-nursery-200"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={SITE_CONTACTS.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full p-2 text-slate-500 transition hover:bg-cream-100 hover:text-[#229ED9] sm:block"
              aria-label="Telegram"
            >
              <FaTelegram className="h-5 w-5" />
            </a>
            <a
              href={SITE_CONTACTS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full p-2 text-slate-500 transition hover:bg-cream-100 hover:text-pink-600 sm:block"
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href={`tel:${SITE_CONTACTS.phones[0].href}`}
              className="hidden rounded-full p-2 text-slate-500 transition hover:bg-cream-100 hover:text-nursery-700 md:block"
              aria-label="Позвонить"
            >
              <FiPhone className="h-5 w-5" />
            </a>

            <Link
              href="/history"
              className={`relative rounded-full p-2 transition hover:bg-cream-100 ${
                pathname === '/history' ? 'text-nursery-700' : 'text-slate-500 hover:text-nursery-700'
              }`}
              aria-label="История заказов"
            >
              <FiClock className="h-5 w-5" />
              <NavBadge count={unseenCount} />
            </Link>

            <Link
              href="/basket"
              className={`relative rounded-full p-2 transition hover:bg-cream-100 ${
                pathname === '/basket' ? 'text-nursery-700' : 'text-slate-500 hover:text-nursery-700'
              }`}
              aria-label="Корзина"
            >
              <FiShoppingCart className="h-5 w-5" />
              <NavBadge count={storeHydrated ? basketCount : 0} />
            </Link>

            {showSearch && (
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen((o) => !o)}
                className="rounded-full p-2 text-slate-500 hover:bg-cream-100 xl:hidden"
                aria-label="Поиск"
              >
                {isMobileSearchOpen ? <FiX className="h-5 w-5" /> : <FiSearch className="h-5 w-5" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="rounded-full p-2 text-slate-500 hover:bg-cream-100 lg:hidden"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="border-t border-cream-200 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-cream-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/basket"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-cream-100"
              >
                Корзина{storeHydrated && basketCount > 0 ? ` (${basketCount})` : ''}
              </Link>
              <Link
                href="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-cream-100"
              >
                История заказов{unseenCount > 0 ? ` (${unseenCount})` : ''}
              </Link>
            </div>
          </nav>
        )}

        {showSearch && isMobileSearchOpen && (
          <div className="border-t border-cream-200 px-1 py-3 xl:hidden">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Поиск роз..."
                className="w-full rounded-full border border-cream-200 bg-cream-50 py-2.5 pl-9 pr-4 text-sm outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
