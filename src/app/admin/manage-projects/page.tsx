
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/context/ProjectsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser, useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/app-layout';
import { Loader } from '@/components/loader';
import { Trash2, Shield, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';

// NOTE: In a real app, admin status should come from a secure source like custom claims.
// To make your user an admin, go to your Firebase Console -> Firestore Database,
// create a collection named `roles_admin`, and add a new document where the Document ID is your user's UID.
const ADMIN_UIDS = ['bxLju1r58WUjTrl9HAteyJwCnO72']; // Example UID

export default function ManageProjectsPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { projects, projectsLoading } = useProjects();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isUserAdmin = user && ADMIN_UIDS.includes(user.uid);
  
  if (isUserLoading || projectsLoading) {
    return <AppLayout pageTitle="إدارة المشاريع"><Loader /></AppLayout>;
  }

  if (!user || !isUserAdmin) {
    return (
      <AppLayout pageTitle="غير مصرح به" showBackButton={true}>
        <div className="flex flex-col items-center justify-center text-center p-8 gap-4 h-[70vh]">
            <Shield className="h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold">وصول غير مصرح به</h1>
            <p className="text-muted-foreground">هذه الصفحة متاحة للمشرفين فقط.</p>
            <Button onClick={() => router.push('/home')}>العودة للرئيسية</Button>
        </div>
      </AppLayout>
    );
  }
  
  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (!firestore) return;
    
    const projectRef = doc(firestore, 'public_projects', projectId);
    deleteDocumentNonBlocking(projectRef);
    
    toast({
      title: 'تم حذف المشروع',
      description: `تم حذف مشروع "${projectName}" بنجاح.`,
      variant: 'default',
    });
  };

  return (
    <AppLayout pageTitle="إدارة المشاريع" showBackButton={true}>
      <div className="p-4 space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>إدارة المشاريع</CardTitle>
            <CardDescription>
              هنا يمكنك تعديل أو حذف المشاريع. كن حذراً، لا يمكن التراجع عن الحذف.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div>
                      <p className="font-bold">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/projects/${project.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم حذف مشروع "{project.name}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProject(project.id, project.name)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">لا توجد مشاريع لعرضها.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
