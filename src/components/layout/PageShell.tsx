import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileContactBar } from './MobileContactBar';

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="h-dvh max-h-dvh min-h-dvh w-full flex flex-col justify-between bg-background text-on-background overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto flex flex-col justify-center px-4 py-4 max-w-7xl w-full mx-auto">
        {children}
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
