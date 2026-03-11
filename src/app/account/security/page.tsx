'use client';

import { ArrowLeft, ChevronLeft, KeyRound, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

type SecurityItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: 'switch' | 'button';
};

const SecurityItem = ({ icon: Icon, title, description, action }: SecurityItemProps) => (
  <div className="flex items-center p-4">
    <Icon className="h-8 w-8 text-primary ml-4" />
    <div className="flex-grow">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {action === 'switch' ? (
        <Switch />
    ) : (
        <Button variant="ghost" size="icon" className="text-primary">
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )}
  </div>
);

export default function AccountSecurityPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">أمان الحساب</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4">
        <Card className="rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-0">
                <SecurityItem
                    icon={KeyRound}
                    title="تغيير كلمة المرور"
                    description="ينصح بتغيير كلمة المرور بشكل دوري"
                    action="button"
                />
                <Separator />
                <SecurityItem
                    icon={ShieldCheck}
                    title="المصادقة الثنائية"
                    description="زيادة أمان حسابك عبر ربطه برقم جوالك"
                    action="switch"
                />
                <Separator />
                <SecurityItem
                    icon={Smartphone}
                    title="الأجهزة المتصلة"
                    description="مراجعة وإدارة الأجهزة التي سجلت الدخول منها"
                    action="button"
                />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
