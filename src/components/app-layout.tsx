'use client';
import type { ReactNode } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';

type AppLayoutProps = {
  pageTitle: string;
  children: ReactNode;
  showNav?: boolean;
  hideHeader?: boolean;
  showBackButton?: boolean;
};

export default function AppLayout({ pageTitle, children, showNav = true, hideHeader = false, showBackButton = false }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto bg-background shadow-2xl">
        {!hideHeader && <Header title={pageTitle} showBackButton={showBackButton} />}
        <main className={`flex-grow relative ${showNav ? 'pb-24' : ''} ${!hideHeader ? 'pt-16' : ''}`}>
          {children}
        </main>
        {showNav && <BottomNav />}
    </div>
  );
}
