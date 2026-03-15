'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, User, Lightbulb, HandCoins, Phone, MapPin, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/loader';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { getFirestore, doc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const signupFormSchema = z.object({
  accountType: z.enum(['inventor', 'investor', 'visitor']),
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل.'),
  phone: z.string().regex(/^5[0-9]{8}$/, 'رقم الجوال غير صالح.'),
  city: z.string().min(2, 'الرجاء إدخال اسم المدينة.'),
  email: z.string().email('البريد الإلكتروني غير صالح.'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.'),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const { control, register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      accountType: 'inventor',
      fullName: '',
      phone: '',
      city: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: data.fullName });

      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      
      const [firstName, ...lastNameParts] = data.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const userProfile = {
        id: firebaseUser.uid,
        username: data.fullName,
        email: data.email,
        firstName: firstName,
        lastName: lastName,
        phone: data.phone,
        role: data.accountType,
        virtualBalance: data.accountType === 'investor' ? 50000 : 0,
        city: data.city,
      };

      setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
      
      const notificationsColRef = collection(firestore, 'users', firebaseUser.uid, 'notifications');
      addDocumentNonBlocking(notificationsColRef, {
          userId: firebaseUser.uid,
          title: "مرحبًا بك في جسر الاستثمار",
          description: "شكرًا لانضمامك إلينا. استكشف المشاريع الآن!",
          createdAt: new Date().toISOString(),
          isRead: false,
          type: 'welcome',
      });

      toast({
        title: 'تم إنشاء الحساب بنجاح!',
        description: 'جاري تسجيل الدخول...',
      });
      // The useEffect will handle the redirection
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'هذا البريد الإلكتروني مسجل بالفعل.'
        : 'حدث خطأ أثناء إنشاء الحساب.';
      toast({
        variant: 'destructive',
        title: 'فشل إنشاء الحساب',
        description: errorMessage,
      });
    }
  };

  if (isLoading || isUserLoading || user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <Loader />
        <p className="text-xl font-bold text-primary mt-8">جاري إنشاء الحساب...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="relative h-80 w-full">
        <Link href="/login" className="absolute top-8 right-8 z-10">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/20 text-foreground hover:bg-black/40 hover:text-foreground">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
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
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold font-headline text-center text-primary mt-2">إنشاء حساب جديد</h2>
              </div>
              
              <form onSubmit={handleSubmit(handleSignup)} className="space-y-3">
                  <Controller
                    name="accountType"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-muted-foreground">نوع الحساب</label>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 gap-2">
                            <label htmlFor="inventor" className={cn("relative flex flex-col items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors hover:bg-accent", field.value === 'inventor' ? 'border-primary bg-primary/10' : 'border-border')}>
                                <RadioGroupItem value="inventor" id="inventor" className="sr-only" />
                                <Lightbulb className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">مخترع</span>
                            </label>
                            <label htmlFor="investor" className={cn("relative flex flex-col items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors hover:bg-accent", field.value === 'investor' ? 'border-primary bg-primary/10' : 'border-border')}>
                                <RadioGroupItem value="investor" id="investor" className="sr-only" />
                                <HandCoins className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">مستثمر</span>
                            </label>
                            <label htmlFor="visitor" className={cn("relative flex flex-col items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors hover:bg-accent", field.value === 'visitor' ? 'border-primary bg-primary/10' : 'border-border')}>
                                <RadioGroupItem value="visitor" id="visitor" className="sr-only" />
                                <User className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">زائر</span>
                            </label>
                        </RadioGroup>
                      </div>
                    )}
                  />
                  
                  <div className="space-y-1.5">
                      <label htmlFor="full-name" className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                      <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="full-name" className="pr-10 bg-secondary border-none" {...register('fullName')} />
                      </div>
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">رقم الجوال</label>
                      <div className="flex gap-2">
                          <div className="w-auto">
                              <div className="h-12 flex items-center justify-center gap-2 rounded-md bg-secondary px-3">
                                  <span className="text-sm">🇸🇦</span>
                                  <span className="text-sm text-muted-foreground">+966</span>
                              </div>
                          </div>
                          <div className="flex-1">
                              <Input id="phone" type="tel" maxLength={9} className="bg-secondary border-none w-full" dir="ltr" {...register('phone')} />
                          </div>
                      </div>
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                      <label htmlFor="city" className="text-sm font-medium text-muted-foreground">المدينة</label>
                      <div className="relative">
                          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="city" className="pr-10 bg-secondary border-none" {...register('city')} />
                      </div>
                       {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                      <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="email" type="email" dir="ltr" className="pr-10 bg-secondary border-none" {...register('email')}/>
                      </div>
                       {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  
                  <div className="space-y-1.5">
                      <label htmlFor="password" className="text-sm font-medium text-muted-foreground">كلمة المرور</label>
                      <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input id="password" type={showPassword ? "text" : "password"} dir="ltr" className="pr-10 pl-10 bg-secondary border-none" {...register('password')} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground">
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                      </div>
                       {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>


                  <Button type="submit" className="w-full !mt-8" size="lg" disabled={isLoading}>
                      إنشاء حساب
                  </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                  <span>لديك حساب بالفعل؟ </span>
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                      تسجيل الدخول
                  </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
