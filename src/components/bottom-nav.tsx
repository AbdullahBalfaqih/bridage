'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, TrendingUp, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/home', label: 'الرئيسية', icon: Home },
  { href: '/projects', label: 'المشاريع', icon: LayoutGrid },
  { href: '/add-idea', label: 'أضف فكرة', icon: PlusCircle },
  { href: '/invest', label: 'استثماراتي', icon: TrendingUp },
  { href: '/account', label: 'حسابي', icon: User },
];


export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed bottom-4 inset-x-0 z-50">
      <div className="max-w-md mx-auto bg-card rounded-full flex justify-around items-center p-3 shadow-lg border">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isAddButton = item.href === '/add-idea';

          if (isAddButton) {
            return (
                 <Link href={item.href} key={item.label} className="-mt-8">
                    <div
                        className={cn(
                        'flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-full transition-all duration-300 text-primary-foreground shadow-lg',
                        isActive ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'
                        )}
                    >
                        <item.icon className="w-8 h-8" />
                        <span className="text-xs font-bold">{item.label}</span>
                    </div>
                </Link>
            )
          }

          return (
            <Link href={item.href} key={item.label}>
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-full transition-all duration-300',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
