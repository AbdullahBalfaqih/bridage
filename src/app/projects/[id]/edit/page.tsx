'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams, notFound } from 'next/navigation';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { useProjects } from '@/context/ProjectsContext';
import { doc } from 'firebase/firestore';
import type { Project } from '@/lib/types';
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
  image: z.string().optional(),
  imageHint: z.string().optional(),
});

const ADMIN_UIDS = ['bxLju1r58WUjTrl9HAteyJwCnO72']; // Example UID

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { projects, projectsLoading } = useProjects();

  const project = useMemo(() => projects.find(p => p.id === params.id), [projects, params.id]);

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
      image: '',
      imageHint: '',
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        briefDescription: project.briefDescription || '',
        problemDescription: project.problemDescription,
        proposedSolution: project.proposedSolution,
        requiredCost: project.requiredCost,
        expectedProfits: project.expectedProfits,
        category: project.category,
        duration: project.duration,
        image: project.image,
        imageHint: project.imageHint,
      });
      setImagePreview(project.image);
    }
  }, [project, form]);
  
  useEffect(() => {
    // Wait for everything to load
    if (isUserLoading || projectsLoading) {
      return;
    }

    // If project is still not found, 404
    if (!project) {
      notFound();
      return;
    }

    const isUserAdmin = user && ADMIN_UIDS.includes(user.uid);
    const isOwner = user && user.uid === project.submitterId;

    // If not admin and not owner, redirect
    if (!isUserAdmin && !isOwner) {
      toast({ variant: 'destructive', title: 'غير مصرح لك', description: 'لا يمكنك تعديل هذا المشروع.' });
      router.push(`/projects/${project.id}`);
    }
  }, [user, project, isUserLoading, projectsLoading, router, toast]);

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
    if (!project) return;
    const projectRef = doc(firestore, 'public_projects', project.id);
    
    setIsLoading(true);
    updateDocumentNonBlocking(projectRef, values);
    toast({
      title: 'تم تحديث المشروع بنجاح!',
      description: `تم حفظ التغييرات على مشروع "${values.name}".`,
    });
    setTimeout(() => {
      router.push(`/projects/${project.id}`);
      setIsLoading(false);
    }, 1500);
  }

  if (isUserLoading || projectsLoading || isLoading) {
    return (
        <AppLayout pageTitle="جاري التحميل...">
            <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
                <Loader />
            </div>
        </AppLayout>
    );
  }

  if (!project) {
      // This case is handled by the useEffect, but this prevents rendering with no data
      return <AppLayout pageTitle="جاري التحميل..."><Loader /></AppLayout>;
  }

  return (
    <AppLayout pageTitle="تعديل المشروع" showBackButton>
      <div className="p-4 space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>تعديل مشروع: {project.name}</CardTitle>
            <CardDescription>قم بتحديث تفاصيل مشروعك هنا.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
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
                  حفظ التغييرات
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
