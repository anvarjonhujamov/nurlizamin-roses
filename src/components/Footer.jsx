import Link from 'next/link';
import { FaTelegram, FaInstagram } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { SITE_CONTACTS } from '@/data/contacts';

export function Footer() {
  return (
    <footer id="contacts" className="bg-nursery-800 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-12 w-12 rounded-full bg-white/10 p-1" />
              <span className="font-display text-xl font-semibold text-white">Nurli Zamin</span>
            </div>
            <p className="text-sm leading-relaxed text-cream-200/90">
              Питомник премиум роз. Оптовые поставки саженцев
              с чётким классом сортировки для B2B-партнёров.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-white">Навигация</h3>
            <ul className="space-y-2 text-sm text-cream-200/90">
              <li><Link href="/catalog" className="hover:text-white">Каталог</Link></li>
              <li><Link href="/#about" className="hover:text-white">О питомнике</Link></li>
              <li><Link href="/zayavka" className="hover:text-white">Оставить заявку</Link></li>
              <li><Link href="/#videos" className="hover:text-white">Видео</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-white">Контакты</h3>
            <div className="space-y-3 text-sm">
              {SITE_CONTACTS.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={`tel:${phone.href}`}
                  className="flex items-center gap-2 text-cream-200/90 hover:text-white"
                >
                  <FiPhone className="h-4 w-4 shrink-0" />
                  {phone.display}
                </a>
              ))}
              <a
                href={SITE_CONTACTS.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200/90 hover:text-white"
              >
                <FaTelegram className="h-4 w-4" />
                @{SITE_CONTACTS.telegram.username}
              </a>
              <a
                href={SITE_CONTACTS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200/90 hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
                @{SITE_CONTACTS.instagram.username}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-cream-200/60">
          © {new Date().getFullYear()} Nurli Zamin. Каталог для ознакомления — заказ через заявку.
        </div>
      </div>
    </footer>
  );
}
