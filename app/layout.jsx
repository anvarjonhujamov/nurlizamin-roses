import { Cormorant_Garamond, Inter, Source_Sans_3 } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-source',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rose',
  display: 'swap',
});

export const metadata = {
  title: 'Nurli Zamin - Питомник роз оптом',
  description:
    'Nurli Zamin — премиум розы и саженцы оптом. Каталог сортов для B2B-клиентов.',
  keywords: 'розы, саженцы, опт, Узбекистан, Nurli Zamin, питомник роз, каталог роз',
  author: 'Nurli Zamin',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nurlizamin.uz'),
  openGraph: {
    type: 'website',
    title: 'Nurli Zamin - Питомник роз оптом',
    description: 'Каталог премиум роз и саженцев для оптовых клиентов',
    images: ['/logo.png'],
  },
};

export const viewport = {
  themeColor: '#3d6b3d',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${cormorant.variable} ${sourceSans.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
