'use client';

import { ArrowLeft, Edit, Mail, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

type DetailItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
    <Button variant="ghost" size="icon" className="text-primary">
      <Edit className="h-4 w-4" />
    </Button>
  </div>
);

export default function AccountDetailsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">تفاصيل الحساب</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem icon={UserIcon} label="الاسم الكامل" value="نواف" />
            <DetailItem icon={Mail} label="البريد الإلكتروني" value="investor@example.com" />
            <DetailItem icon={Phone} label="رقم الجوال" value="+966 50 123 4567" />
            <DetailItem icon={MapPin} label="المدينة" value="الرياض" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
