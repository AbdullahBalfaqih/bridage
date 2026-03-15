import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { PageTransition } from '@/components/page-transition';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ProjectsProvider } from '@/context/ProjectsContext';

export const metadata: Metadata = {
  title: 'جسر الاستثمار',
  description: 'منصة تربط الأفكار بالتمويل، حيث تتحول الرؤى إلى مشاريع ناجحة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
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
