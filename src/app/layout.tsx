import type { Metadata } from 'next';
import { Syne } from 'next/font/google';
import './globals.css';
import { BUSINESS_CONFIG } from '@/lib/config/business';

const brandFont = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: BUSINESS_CONFIG.name,
    template: `%s | ${BUSINESS_CONFIG.name}`,
  },
  description: 'Paint Manufacturer in Lagos',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={brandFont.variable}>
      <body className="min-h-dvh bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
