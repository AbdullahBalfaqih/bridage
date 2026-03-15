'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader } from '@/components/loader';

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [initializationFailed, setInitializationFailed] = useState(false);


  useEffect(() => {
    const initializedServices = initializeFirebase();
    if (initializedServices.firebaseApp) {
        setServices(initializedServices as FirebaseServices);
    } else {
        setInitializationFailed(true);
    }
  }, []);
  
  if (initializationFailed) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4 text-center">
            <div className="rounded-xl border bg-card p-6 text-card-foreground max-w-md">
                <h1 className="text-xl font-bold text-destructive">خطأ في الإعداد</h1>
                <p className="mt-2">فشل الاتصال بخدمات Firebase.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    السبب الأكثر شيوعًا هو عدم تكوين متغيرات البيئة (environment variables) الخاصة بـ Firebase بشكل صحيح في خدمة الاستضافة (مثل Vercel أو Netlify).
                </p>
                 <p className="mt-4 text-xs text-muted-foreground">
                    (Error: Firebase initialization failed. Check hosting environment variables for `NEXT_PUBLIC_FIREBASE_*`)
                </p>
            </div>
        </div>
      );
  }


  if (!services) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader />
        </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
