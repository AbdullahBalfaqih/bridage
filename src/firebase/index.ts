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

export function initializeFirebase(): FirebaseSdks {
  // If already initialized, return the existing instances
  if (getApps().length) {
    const app = getApp();
    return getSdks(app);
  }
  
  let app: FirebaseApp;

  // 1. Try automatic initialization (for Firebase App Hosting)
  try {
    app = initializeApp();
    return getSdks(app);
  } catch (e) {
    // This is an expected failure when not in an App Hosting environment.
    // We will proceed to the fallback method.
  }

  // 2. Fallback: Use the firebaseConfig object from environment variables
  const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

  if (isConfigValid) {
    try {
      app = initializeApp(firebaseConfig);
      return getSdks(app);
    } catch (e) {
      // This would happen for other errors, e.g., malformed config values
      console.error("Firebase initialization with config object failed.", e);
      return { firebaseApp: null, auth: null, firestore: null };
    }
  } else {
    // This is the most likely error path in local dev if .env is not set up.
    // It prevents the app from crashing with an 'invalid-api-key' error.
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Firebase automatic initialization failed, and the fallback config is missing or invalid. Please ensure NEXT_PUBLIC_FIREBASE_* environment variables are set correctly in your .env.local file.");
    }
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

// Helper to get SDKs from an initialized app. Returns a non-null object.
export function getSdks(firebaseApp: FirebaseApp): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore; } {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

// Re-export other necessary modules
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
