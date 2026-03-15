
'use client';

import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/project-card';
import { useProjects } from '@/context/ProjectsContext';
import { Card } from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader } from '@/components/loader';
import type { Favorite } from '@/lib/types';

export default function FavoritesPage() {
  const router = useRouter();
  const { projects: allProjects } = useProjects(); // All projects from context
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const favoritesQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'favorites') : null),
    [user, firestore]
  );
  
  const { data: favorites, isLoading: favoritesLoading } = useCollection<Favorite>(favoritesQuery);
  
  const favoriteProjectIds = favorites ? new Set(favorites.map(f => f.id)) : new Set();
  
  const favoriteProjects = allProjects.filter(p => favoriteProjectIds.has(p.id));

  if (isUserLoading || favoritesLoading) {
      return (
          <div className="flex flex-col min-h-screen bg-background">
             <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
                    <ArrowLeft />
                </Button>
                <h1 className="text-lg font-bold font-headline">المفضلة</h1>
                <div className="w-10"></div>
            </header>
            <div className="flex flex-grow items-center justify-center">
                <Loader />
            </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">المفضلة</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4 space-y-4">
        {favoriteProjects.length > 0 ? (
          favoriteProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center rounded-2xl shadow-sm bg-card">
              <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-bold">لا توجد مشاريع مفضلة</h3>
              <p className="text-muted-foreground">أضف المشاريع التي تعجبك إلى المفضلة لتجدها هنا لاحقًا.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
