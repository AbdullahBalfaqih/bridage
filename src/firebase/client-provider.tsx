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

  useEffect(() => {
    // This effect only runs on the client-side, after the component has mounted.
    // This safely avoids running Firebase initialization during server-side build.
    const initializedServices = initializeFirebase();
    if (initializedServices.firebaseApp) {
        setServices(initializedServices as FirebaseServices);
    }
  }, []);

  if (!services) {
    // While waiting for client-side mount and Firebase initialization,
    // show a loader to prevent hydration mismatch and indicate loading.
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader />
        </div>
    );
  }

  // Once initialized on the client, provide the services to the rest of the app.
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
