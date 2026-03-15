'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  HelpCircle,
  LogOut,
  MoreVertical,
  PlusCircle,
  Settings,
  User,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "@/components/loader";
import AppLayout from "@/components/app-layout";
import Image from "next/image";
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";


type ProfileMenuItemProps = {
  icon: LucideIcon;
  text: string;
  href: string;
  isLogout?: boolean;
};

const ProfileMenuItem = ({ icon: Icon, text, href, isLogout = false }: ProfileMenuItemProps) => (
  <Link href={href} className={`flex items-center p-4 transition-colors rounded-xl hover:bg-muted/50 ${isLogout ? 'text-destructive' : 'text-card-foreground'}`}>
      <Icon className={`ml-4 h-5 w-5 ${isLogout ? '' : 'text-primary'}`} />
      <span className="flex-grow font-medium">{text}</span>
      <ChevronRight className="h-5 w-5 text-primary" />
  </Link>
);


export default function AccountPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const virtualBalance = userProfile?.virtualBalance ?? 0;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    auth.signOut().then(() => {
      router.push('/login');
    }).catch(() => {
       setIsLoggingOut(false);
    })
  };

  const roleToArabic = (role: 'inventor' | 'investor' | 'visitor') => {
    switch (role) {
      case 'inventor': return 'مخترع';
      case 'investor': return 'مستثمر';
      case 'visitor': return 'زائر';
      default: return role;
    }
  };

  if (isUserLoading || isProfileLoading) {
     return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center gap-4">
        <Loader />
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center gap-4">
        <Loader />
        <h2 className="text-xl font-bold text-primary">جاري تسجيل الخروج...</h2>
        <p className="text-muted-foreground">نأمل أن نراك قريباً!</p>
      </div>
    );
  }

  return (
    <AppLayout pageTitle="ملفي الشخصي" hideHeader={true}>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Custom Header */}
        <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
          <div className="w-10"></div>
          <h1 className="text-lg font-bold font-headline">ملفي الشخصي</h1>
          <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
            <MoreVertical />
          </Button>
        </header>

        <main className="flex-grow p-4 space-y-6">
          {/* User Info Card */}
          <Card className="shadow-sm rounded-2xl relative overflow-hidden">
            <Image
                src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772502692/Screenshot_2026-03-03_044326_go0eth.png"
                alt="Profile background"
                fill
                sizes="100vw"
                className="object-cover z-0"
                data-ai-hint="abstract sky"
              />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-6 flex flex-col items-center text-center text-primary-foreground">
              <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary border-4 border-background">
                      <User className="h-12 w-12 text-primary" />
                  </div>
              </div>
              <h2 className="text-2xl font-bold font-headline mt-4">{userProfile?.username || user?.displayName || 'مستخدم جديد'}</h2>
              <p className="text-primary-foreground/80">{user?.email}</p>
              {userProfile?.role && (
                <Badge variant="secondary" className="mt-2 bg-black/30 text-white border-primary/20">
                  {roleToArabic(userProfile.role)}
                </Badge>
              )}
            </div>
          </Card>

          {/* Wallet Card */}
          <Card className="relative bg-gradient-to-tr from-zinc-900 to-black border-primary/20 rounded-2xl overflow-hidden shadow-lg text-primary-foreground">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              
              <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                      <CardTitle className="text-base font-medium text-muted-foreground">
                          رصيدك الافتراضي
                      </CardTitle>
                        <div className="text-4xl font-bold flex items-center justify-start gap-1">
                          <span className="text-primary">{new Intl.NumberFormat('ar-SA').format(virtualBalance)}</span>
                          <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={32} height={32} className="object-contain" />
                      </div>
                  </div>
                  <Wallet className="h-8 w-8 text-primary" />
              </CardHeader>
              <CardContent className="relative z-10">
                  <p className="text-xs text-muted-foreground mt-4">
                      استخدم هذا الرصيد للاستثمار في المشاريع الواعدة
                  </p>
              </CardContent>
              <CardFooter className="relative z-10 p-0">
                  <Link href="/invest" className="w-full">
                      <Button size="lg" className="w-full rounded-t-none h-14 text-base font-bold bg-primary/90 hover:bg-primary">
                          <PlusCircle className="ml-2 h-5 w-5" />
                          إدارة المحفظة
                      </Button>
                  </Link>
              </CardFooter>
          </Card>
          
          {/* Menu List */}
          <Card className="overflow-hidden shadow-sm rounded-2xl p-2">
              <div>
                  <ProfileMenuItem icon={Settings} text="الإعدادات" href="/account/settings" />
                  <ProfileMenuItem icon={Heart} text="المفضلة" href="/account/favorites" />
                  <ProfileMenuItem icon={HelpCircle} text="المساعدة والدعم" href="/account/support" />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex items-center p-4 transition-colors rounded-xl hover:bg-muted/50 text-destructive cursor-pointer w-full">
                          <LogOut className="ml-4 h-5 w-5" />
                          <span className="flex-grow font-medium">تسجيل الخروج</span>
                          <ChevronRight className="h-5 w-5 text-primary" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيؤدي هذا الإجراء إلى تسجيل خروجك من حسابك. ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى التطبيق.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                          تسجيل الخروج
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
          </Card>
          
          <div className="h-24"></div> {/* Spacer for bottom nav */}
        </main>
      </div>
    </AppLayout>
  );
}
