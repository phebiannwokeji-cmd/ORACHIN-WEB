import type { Metadata } from 'next';
import './globals.css';
import { BUSINESS_CONFIG } from '@/lib/config/business';

export const metadata: Metadata = {
  title: BUSINESS_CONFIG.name,
  description: `${BUSINESS_CONFIG.name} — ${BUSINESS_CONFIG.tagline} in Lagos, Nigeria`,
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
    <html lang="en">
      <body className="min-h-dvh bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
