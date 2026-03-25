import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { PageTransition } from '@/components/page-transition';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProjectsProvider } from '@/context/ProjectsContext';

export const metadata: Metadata = {
  title: 'جسر الاستثمار',
  description: 'منصة تربط الأفكار بالتمويل',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ProjectsProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster />
          </ProjectsProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

    
