'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M17.6402 9.20455C17.6402 8.60227 17.5835 8.04545 17.4818 7.5H9.4502V10.7045H14.0722C13.8403 11.8466 13.1676 12.8182 12.1818 13.4489V15.5455H14.8625C16.5966 14.0057 17.6402 11.8011 17.6402 9.20455Z" fill="#4285F4"/>
        <path d="M9.4502 18C11.7585 18 13.7205 17.2273 15.1761 15.9318L12.5511 13.8352C11.7585 14.3409 10.7148 14.6591 9.4502 14.6591C7.14205 14.6591 5.17997 13.0682 4.41761 11.0227H1.64205V13.1193C3.125 15.983 6.03523 18 9.4502 18Z" fill="#34A853"/>
        <path d="M4.41756 11.0227C4.22153 10.4773 4.10795 9.88068 4.10795 9.27273C4.10795 8.66477 4.22153 8.06818 4.41756 7.52273V5.42614H1.64205C0.957386 6.84091 0.539773 8.38068 0.539773 10C0.539773 11.6193 0.957386 13.1591 1.64205 14.5739L4.41756 12.5284V11.0227Z" fill="#FBBC05"/>
        <path d="M9.4502 3.84091C10.8252 3.84091 11.9 4.31818 12.8295 5.19886L15.2343 2.79412C13.7787 1.4375 11.7585 0.5 9.4502 0.5C6.03523 0.5 3.125 2.51705 1.64205 5.38068L4.41761 7.47727C5.17997 5.43182 7.14205 3.84091 9.4502 3.84091Z" fill="#EA4335"/>
    </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Facebook</title><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153Zm-1.653 19.57h2.608L5.421 2.56h-2.78l14.632 18.163Z"/></svg>
);

const loginFormSchema = z.object({
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
  password: z.string().min(1, { message: 'الرجاء إدخال كلمة المرور.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // On success, the useEffect hook will redirect.
      // We can leave isLoading as true to show the loader until redirect.
    } catch (error) {
      setIsLoading(false);
      toast({
          variant: 'destructive',
          title: 'فشل تسجيل الدخول',
          description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      });
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <Loader />
        <p className="text-xl font-bold text-primary mt-8">جاري تسجيل الدخول</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <Loader />
        <p className="text-xl font-bold text-primary mt-8">جاري تسجيل الدخول</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="relative h-80 w-full">
        <Image
          src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772502692/Screenshot_2026-03-03_044326_go0eth.png"
          alt="Abstract background"
          fill
          sizes="100vw"
          className="object-cover"
          data-ai-hint="abstract sky"
        />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-start px-4 -mt-20 pb-8">
        <div className="w-full max-w-sm bg-card rounded-3xl shadow-2xl p-8">
          <div className="w-full">
              <div className="flex justify-center mb-4">
                <Image
                    src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772502178/image-removebg-preview_52_nihduz.png"
                    alt="شعار جسر الاستثمار"
                    width={200}
                    height={97}
                    className="object-contain"
                />
              </div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline text-center text-primary mt-2">مرحبًا بعودتك</h2>
              </div>
              
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                      <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                          <Input id="email" type="email" dir="ltr" className="pr-10 bg-secondary border-none" {...form.register('email')} />
                      </div>
                       {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                      <label htmlFor="password" className="text-sm font-medium text-muted-foreground">كلمة المرور</label>
                      <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                          <Input id="password" type={showPassword ? "text" : "password"} dir="ltr" className="pr-10 pl-10 bg-secondary border-none" {...form.register('password')} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground">
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                      </div>
                      {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
                  </div>


                  <div className="flex items-center justify-between">
                      <label className="container text-sm font-normal" htmlFor="remember-me">
                          <input id="remember-me" type="checkbox" />
                          <div className="checkmark"></div>
                          <span>تذكرني</span>
                      </label>
                      <Link href="#" className="text-sm text-primary hover:underline">
                          هل نسيت كلمة المرور؟
                      </Link>
                  </div>
                  
                  <div className='pt-4'>
                    <Button type="submit" size="lg" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl shadow-lg" disabled={isLoading}>
                        تسجيل الدخول
                    </Button>
                  </div>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">أو سجل الدخول باستخدام</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="h-12 w-12 border-2">
                      <FacebookIcon className="h-6 w-6 fill-current" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 border-2">
                      <GoogleIcon className="h-6 w-6" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 border-2">
                      <XIcon className="h-6 w-6 fill-current" />
                  </Button>
              </div>

               <div className="mt-8 text-center text-sm">
                  <span>ليس لديك حساب؟ </span>
                  <Link href="/signup" className="font-semibold text-primary hover:underline">
                      إنشاء حساب
                  </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
