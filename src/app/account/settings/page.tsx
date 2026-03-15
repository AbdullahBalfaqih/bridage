
'use client';

import { ArrowLeft, ChevronLeft, Mail, MapPin, Phone, User as UserIcon, Lock, ShieldCheck, Smartphone, Bell, Palette, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

type SettingsItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: 'switch' | 'button';
  href?: string;
};

const SettingsItem = ({ icon: Icon, title, description, action, href }: SettingsItemProps) => {
    const content = (
        <div className="flex items-center p-4">
          <Icon className="h-6 w-6 text-primary ml-4 shrink-0" />
          <div className="flex-grow">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action === 'switch' ? (
              <Switch defaultChecked/>
          ) : (
              <div className="text-primary shrink-0">
                  <ChevronLeft className="h-5 w-5" />
              </div>
          )}
        </div>
    );

    if (href) {
        return <Link href={href} className="hover:bg-muted/50 transition-colors block rounded-xl">{content}</Link>;
    }
    
    return content;
};

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">الإعدادات</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4 space-y-6">
        <Card className="rounded-2xl shadow-sm overflow-hidden">
            <CardHeader><CardTitle>المعلومات الشخصية</CardTitle></CardHeader>
            <CardContent className="p-0">
                <SettingsItem 
                    icon={UserIcon} 
                    title="تعديل الملف الشخصي" 
                    description="تعديل اسمك، بريدك، جوالك، ومدينتك" 
                    action="button"
                    href="/account/details" 
                />
            </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm overflow-hidden">
            <CardHeader><CardTitle>الأمان</CardTitle></CardHeader>
            <CardContent className="p-0">
                <SettingsItem icon={Lock} title="تغيير كلمة المرور" description="لم يتم التغيير منذ فترة" action="button" href="/account/security"/>
                <Separator/>
                <SettingsItem icon={ShieldCheck} title="المصادقة الثنائية" description="زيادة أمان حسابك" action="switch" />
                <Separator/>
                <SettingsItem icon={Smartphone} title="الأجهزة المتصلة" description="مراجعة وإدارة الأجهزة" action="button" />
            </CardContent>
        </Card>

         <Card className="rounded-2xl shadow-sm overflow-hidden">
            <CardHeader><CardTitle>التفضيلات</CardTitle></CardHeader>
            <CardContent className="p-0">
                <SettingsItem icon={Bell} title="الإشعارات" description="إدارة التنبيهات" action="button" />
                <Separator/>
                <SettingsItem icon={Palette} title="المظهر" description="داكن" action="button" />
                <Separator/>
                <SettingsItem icon={Languages} title="اللغة" description="العربية" action="button" />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
