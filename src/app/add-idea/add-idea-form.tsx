'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, FileText, FlaskConical, CircleDollarSign, Percent, UploadCloud, Clock, Tag } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/context/ProjectsContext";

const categories = ['تقنية طبية', 'تقنية زراعية', 'صحة رقمية', 'الزراعة المستدامة', 'أجهزة منزلية', 'تجارة إلكترونية', 'أخرى'];

const formSchema = z.object({
  image: z.any().refine((files) => files?.length >= 1, { message: "صورة المشروع مطلوبة." }),
  name: z.string().min(1, 'اسم المشروع مطلوب'),
  problem: z.string().min(10, 'يرجى وصف المشكلة التي يحلها مشروعك.'),
  solution: z.string().min(10, 'يرجى وصف الحل الذي يقدمه مشروعك.'),
  cost: z.coerce.number().positive('التكلفة المطلوبة يجب أن تكون رقمًا صحيحًا.'),
  profit: z.coerce.number().min(0).max(100, 'الربح المتوقع يجب أن يكون بين 0 و 100%.'),
  category: z.string({ required_error: "الرجاء اختيار تصنيف." }),
  duration: z.string().min(1, 'مدة المشروع مطلوبة'),
});

export function AddIdeaForm() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addProject } = useProjects();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      name: "",
      problem: "",
      solution: "",
      cost: 0,
      profit: 0,
      category: undefined,
      duration: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addProject(values);
    toast({
      title: "تم إرسال الفكرة بنجاح!",
      description: `تمت إضافة مشروعك "${values.name}" وسيظهر في جميع الصفحات.`,
    });
    form.reset();
    setImagePreview(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>صورة المشروع</FormLabel>
              <FormControl>
                <div className="w-full">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-card border-2 border-dashed border-border focus-within:ring-2 focus-within:ring-primary rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-accent transition-colors aspect-video"
                    >
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain rounded-lg p-2" />
                                <div className="absolute bottom-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">تغيير الصورة</div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <UploadCloud className="h-10 w-10 text-primary" />
                                <p className="font-semibold text-foreground">اسحب وأفلت الصورة هنا</p>
                                <p className="text-sm">أو <span className="font-bold text-primary">تصفح الملفات</span></p>
                                <p className="text-xs mt-2">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                        <Input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onBlur={field.onBlur}
                            name={field.name}
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    field.onChange(files);
                                    const file = files[0];
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setImagePreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            ref={field.ref}
                        />
                    </label>
                </div>
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
                <div className="relative">
                  <Lightbulb className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input {...field} className="pr-10 bg-card border-border focus-visible:ring-primary rounded-xl" placeholder="مثال: تطبيق 'وصلني' الذكي" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تصنيف المشروع</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <div className="relative">
                        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <SelectTrigger className="pr-10 bg-card border-border focus:ring-primary rounded-xl">
                            <SelectValue placeholder="اختر تصنيف المشروع" />
                        </SelectTrigger>
                    </div>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشكلة</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea {...field} className="pr-10 bg-card border-border focus-visible:ring-primary !min-h-[120px] rounded-xl" placeholder="ما هي المشكلة التي يحلها مشروعك في السوق؟" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحل المقترح</FormLabel>
              <FormControl>
                <div className="relative">
                  <FlaskConical className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Textarea {...field} className="pr-10 bg-card border-border focus-visible:ring-primary !min-h-[120px] rounded-xl" placeholder="صف الحل الذي يقدمه مشروعك بالتفصيل." />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>التكلفة المطلوبة (SAR)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CircleDollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" {...field} className="pr-10 bg-card border-border focus-visible:ring-primary rounded-xl" placeholder="0" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="profit"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>الأرباح المتوقعة (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" {...field} className="pr-10 bg-card border-border focus-visible:ring-primary rounded-xl" placeholder="0" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مدة المشروع المتوقعة</FormLabel>
              <FormControl>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input {...field} className="pr-10 bg-card border-border focus-visible:ring-primary rounded-xl" placeholder="مثال: سنة واحدة" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full !mt-8 rounded-xl">إرسال الفكرة</Button>
      </form>
    </Form>
  )
}
