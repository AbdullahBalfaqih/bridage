'use client';

import AppLayout from "@/components/app-layout";
import { AddIdeaForm } from "./add-idea-form";

export default function AddIdeaPage() {
  return (
    <AppLayout pageTitle="أضف فكرة" hideHeader={true}>
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4">
        <div className="w-10" />
        <h1 className="text-lg font-bold font-headline">أضف فكرة</h1>
        <div className="w-10" />
      </header>
      <div className="p-4">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-headline">لديك فكرة مشروع؟</h2>
            <p className="text-muted-foreground">املأ النموذج التالي لإرسال فكرتك ومراجعتها من قبل فريقنا.</p>
        </div>
        <AddIdeaForm />
      </div>
    </AppLayout>
  );
}
