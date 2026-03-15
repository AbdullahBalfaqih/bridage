'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User as UserIcon, Mail, MapPin, Phone } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Loader } from '@/components/loader';


const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "الاسم الأول مطلوب." }),
  lastName: z.string().min(2, { message: "الاسم الأخير مطلوب." }),
  city: z.string().min(2, { message: "المدينة مطلوبة." }),
  phone: z.string().regex(/^5[0-9]{8}$/, { message: "رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function AccountDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      city: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        city: userProfile.city || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile, form]);

  function onSubmit(data: ProfileFormValues) {
    if (!userProfileRef) return;
    
    const updatedData = {
      ...data,
      username: `${data.firstName} ${data.lastName}`,
    };
    
    updateDocumentNonBlocking(userProfileRef, updatedData);
    
    toast({
      title: "تم تحديث الملف الشخصي",
      description: "تم حفظ بياناتك بنجاح.",
    });
    router.back();
  }
  
  if (isUserLoading || isProfileLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-background items-center justify-center">
            <Loader />
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">تعديل الملف الشخصي</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
            <CardDescription>قم بتحديث معلوماتك الشخصية هنا.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>الاسم الأول</FormLabel>
                        <FormControl>
                            <Input placeholder="نواف" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>الاسم الأخير</FormLabel>
                        <FormControl>
                            <Input placeholder="الأحمد" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>رقم الجوال</FormLabel>
                        <div className="flex gap-2">
                            <div className="w-auto">
                                <div className="h-12 flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 border border-input">
                                    <span className="text-sm">🇸🇦</span>
                                    <span className="text-sm text-muted-foreground">+966</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <FormControl>
                                    <Input type="tel" maxLength={9} dir="ltr" {...field} />
                                </FormControl>
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة</FormLabel>
                       <div className="relative">
                           <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl>
                               <Input className="pr-10" placeholder="الرياض" {...field} />
                           </FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            value={userProfile?.email || ''}
                            readOnly
                            disabled
                            className="pr-10 bg-secondary/50"
                        />
                    </div>
                </div>

                <Button type="submit" size="lg" className="w-full !mt-8">
                  حفظ التغييرات
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
