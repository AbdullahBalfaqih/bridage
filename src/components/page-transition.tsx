'use client';

import { ReactNode } from 'react';

// Animation is now handled within AppLayout to allow for static headers/footers.
// This component simply passes its children through.
export const PageTransition = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
