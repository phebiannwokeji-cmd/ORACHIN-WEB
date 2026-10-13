import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileContactBar } from './MobileContactBar';

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-on-background">
      <Header />
      <main className="flex-1 px-4 py-6 sm:py-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
