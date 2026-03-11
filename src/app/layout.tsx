import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { PageTransition } from '@/components/page-transition';
import ProjectsClientProvider from '@/providers/ProjectsClientProvider';

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
        <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ProjectsClientProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster />
        </ProjectsClientProvider>
      </body>
    </html>
  );
}
