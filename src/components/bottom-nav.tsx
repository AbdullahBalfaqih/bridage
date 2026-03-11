'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Lightbulb, User, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/home', label: 'الرئيسية', icon: Home },
  { href: '/projects', label: 'المشاريع', icon: LayoutGrid },
  { href: '/invest', label: 'استثماراتي', icon: TrendingUp },
  { href: '/add-idea', label: 'أضف فكرة', icon: Lightbulb },
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
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-20 h-16 rounded-full transition-all duration-300',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
