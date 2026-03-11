'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';


type HeaderProps = {
  title: string;
  showBackButton?: boolean;
};


export default function Header({ title, showBackButton = false }: HeaderProps) {
    const router = useRouter();

  return (
    <header className="fixed top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50 w-full max-w-3xl mx-auto">
        {showBackButton ? (
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
                <ArrowLeft />
            </Button>
        ) : <div className="w-10"></div> }

        <h1 className="text-lg font-bold font-headline">{title}</h1>
      
      <div className="w-10"></div>
    </header>
  );
}
