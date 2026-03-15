'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useProjects } from '@/context/ProjectsContext';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/loader';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(3, { message: 'يجب أن يكون اسم المشروع 3 أحرف على الأقل.' }),
  briefDescription: z.string().min(10, { message: 'الرجاء كتابة وصف مختصر كافٍ.' }),
  problemDescription: z.string().min(10, { message: 'الرجاء وصف المشكلة بشكل كافٍ.' }),
  proposedSolution: z.string().min(10, { message: 'الرجاء وصف الحل بشكل كافٍ.' }),
  requiredCost: z.coerce.number().min(1, { message: 'الرجاء إدخال تكلفة صالحة.' }),
  expectedProfits: z.coerce.number().min(0, { message: 'الرجاء إدخال نسبة ربح صالحة.' }),
  category: z.string().min(2, { message: 'الرجاء إدخال تصنيف.' }),
  duration: z.string().min(2, { message: 'الرجاء إدخال مدة المشروع.' }),
  type: z.enum(['standard', 'venom'], { required_error: 'الرجاء تحديد نوع المشروع.' }),
  image: z.string().optional(),
  imageHint: z.string().optional(),
});

export default function AddIdeaPage() {
  const router = useRouter();
  const { addProject } = useProjects();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      briefDescription: '',
      problemDescription: '',
      proposedSolution: '',
      requiredCost: 0,
      expectedProfits: 0,
      category: '',
      duration: '',
      type: 'standard',
      image: '',
      imageHint: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userProfile) {
        toast({
            variant: 'destructive',
            title: 'خطأ',
            description: 'يجب تسجيل الدخول لإضافة مشروع.',
        });
        return;
    }
    setIsLoading(true);
    try {
      addProject(values, userProfile);
      toast({
        title: 'تمت إضافة فكرتك بنجاح!',
        description: `مشروع "${values.name}" قيد المراجعة الآن.`,
      });
      setTimeout(() => {
        router.push('/projects');
      }, 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'حدث خطأ',
        description: 'لم نتمكن من إضافة مشروعك. الرجاء المحاولة مرة أخرى.',
      });
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
        <AppLayout pageTitle="جاري الإضافة...">
            <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
                <Loader />
                <h2 className="text-xl font-bold text-primary">جاري إضافة مشروعك...</h2>
                <p className="text-muted-foreground">سيتم تحويلك بعد قليل.</p>
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="أضف فكرة مشروعك">
      <div className="p-4 space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>مشروع جديد</CardTitle>
            <CardDescription>املأ النموذج أدناه لإضافة فكرتك وجذب المستثمرين.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>نوع المشروع</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                                <RadioGroupItem value="standard" id="standard" className="sr-only" />
                            </FormControl>
                            <Label htmlFor="standard" className={cn("flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'standard' && 'border-primary')}>
                                <Lightbulb className="mb-3 h-6 w-6" />
                                مشروع عام
                            </Label>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                                <RadioGroupItem value="venom" id="venom" className="sr-only" />
                            </FormControl>
                            <Label htmlFor="venom" className={cn("flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'venom' && 'border-primary')}>
                                <Rocket className="mb-3 h-6 w-6" />
                                خاص بـ Venom
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>صورة المشروع</FormLabel>
                  <FormControl>
                    <div>
                      {imagePreview && (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border bg-secondary">
                          <Image
                            src={imagePreview}
                            alt="معاينة الصورة"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        className="file:text-foreground"
                        onChange={handleFileChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="imageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمات دلالية للصورة (للذكاء الاصطناعي)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: tech startup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المشروع</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: نظارة طبية ذكية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="briefDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف مختصر للمشروع</FormLabel>
                      <FormControl>
                        <Textarea placeholder="وصف من سطرين للمشروع..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="problemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المشكلة التي يحلها المشروع</FormLabel>
                      <FormControl>
                        <Textarea placeholder="صف المشكلة التي تعالجها..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proposedSolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحل الذي يقدمه المشروع</FormLabel>
                      <FormControl>
                        <Textarea placeholder="صف كيف يحل مشروعك هذه المشكلة..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="requiredCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>التكلفة المطلوبة (ر.س)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="20000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="expectedProfits"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>الربح المتوقع (%)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>التصنيف</FormLabel>
                        <FormControl>
                            <Input placeholder="تقنية طبية" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>المدة المتوقعة</FormLabel>
                        <FormControl>
                            <Input placeholder="سنة ونصف" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  إضافة المشروع
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
