
'use client';

import { ArrowLeft, ChevronLeft, Mail, MapPin, Phone, User as UserIcon, Lock, ShieldCheck, Smartphone, Bell, Palette, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

type SettingsItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: 'switch' | 'button';
};

const SettingsItem = ({ icon: Icon, title, description, action }: SettingsItemProps) => (
    <div className="flex items-center p-4">
      <Icon className="h-6 w-6 text-primary ml-4 shrink-0" />
      <div className="flex-grow">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action === 'switch' ? (
          <Switch defaultChecked/>
      ) : (
          <Button variant="ghost" size="icon" className="text-primary shrink-0">
              <ChevronLeft className="h-5 w-5" />
          </Button>
      )}
    </div>
);

export default function SettingsPage() {
  const router = useRouter();

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
                <SettingsItem icon={UserIcon} title="الاسم الكامل" description="نواف" action="button" />
                <Separator/>
                <SettingsItem icon={Mail} title="البريد الإلكتروني" description="investor@example.com" action="button" />
                <Separator/>
                <SettingsItem icon={Phone} title="رقم الجوال" description="+966 50 123 4567" action="button" />
                <Separator/>
                <SettingsItem icon={MapPin} title="المدينة" description="الرياض" action="button" />
            </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm overflow-hidden">
            <CardHeader><CardTitle>الأمان</CardTitle></CardHeader>
            <CardContent className="p-0">
                <SettingsItem icon={Lock} title="تغيير كلمة المرور" description="لم يتم التغيير منذ فترة" action="button" />
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
