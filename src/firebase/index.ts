'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Define a consistent return type for initialization attempts
interface FirebaseSdks {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Helper to get SDKs from an initialized app. Returns a non-null object.
export function getSdks(firebaseApp: FirebaseApp): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore; } {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}


export function initializeFirebase(): FirebaseSdks {
  // If already initialized, return the existing instances
  if (getApps().length) {
    const app = getApp();
    return getSdks(app);
  }
  
  const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

  if (!isConfigValid) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Firebase config is missing or invalid. Please ensure NEXT_PUBLIC_FIREBASE_* environment variables are set correctly.");
    }
    return { firebaseApp: null, auth: null, firestore: null };
  }

  try {
    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  } catch (e) {
    console.error("Firebase initialization with config object failed.", e);
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

// Re-export other necessary modules
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
