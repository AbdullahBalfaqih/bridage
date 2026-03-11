'use client';
import type { ReactNode } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

type AppLayoutProps = {
  pageTitle: string;
  children: ReactNode;
  showNav?: boolean;
  hideHeader?: boolean;
  showBackButton?: boolean;
};

export default function AppLayout({ pageTitle, children, showNav = true, hideHeader = false, showBackButton = false }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto bg-background shadow-2xl">
        {!hideHeader && <Header title={pageTitle} showBackButton={showBackButton} />}
        <main className={`flex-grow relative ${showNav ? 'pb-24' : ''} ${!hideHeader ? 'pt-16' : ''}`}>
           <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 20,
                        mass: 1.1
                    }}
                    className="h-full w-full"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
        {showNav && <BottomNav />}
    </div>
  );
}
