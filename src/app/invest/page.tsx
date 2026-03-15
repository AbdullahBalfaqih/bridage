'use client';

import { useState } from "react";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useProjects } from "@/context/ProjectsContext";
import type { Investment, UserProfile } from "@/lib/types";
import { Wallet, PlusCircle, TrendingUp } from "lucide-react";
import Image from "next/image";
import InvestmentTracker from "@/components/investment-tracker";
import AddFundsDialog from "@/components/add-funds-dialog";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader } from "@/components/loader";


export default function InvestPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { projects, projectsLoading } = useProjects();
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

    const userProfileRef = useMemoFirebase(
      () => (user ? doc(firestore, 'users', user.uid) : null),
      [user, firestore]
    );
    const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    const investmentsQuery = useMemoFirebase(
      () => (user ? collection(firestore, 'users', user.uid, 'investments') : null),
      [user, firestore]
    );
    const { data: investments, isLoading: investmentsLoading } = useCollection<Investment>(investmentsQuery);

    const virtualBalance = userProfile?.virtualBalance ?? 0;

    const handleAddFunds = (amount: number) => {
        if (!userProfileRef) return;
        const newBalance = (userProfile?.virtualBalance || 0) + amount;
        updateDocumentNonBlocking(userProfileRef, { virtualBalance: newBalance });
        setIsAddFundsOpen(false);
    };
    
    if (isUserLoading || profileLoading || investmentsLoading || projectsLoading) {
      return <AppLayout pageTitle="استثماراتي"><Loader /></AppLayout>;
    }

    return (
        <AppLayout pageTitle="استثماراتي">
            <div className="p-4 space-y-6">
                <Card className="relative mb-6 bg-gradient-to-tr from-zinc-900 to-black border-primary/20 rounded-2xl overflow-hidden shadow-lg text-primary-foreground">
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    
                    <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-medium text-muted-foreground">
                                رصيدك الافتراضي
                            </CardTitle>
                             <div className="text-4xl font-bold flex items-center justify-start gap-1">
                                <span className="text-primary">{new Intl.NumberFormat('ar-SA').format(virtualBalance)}</span>
                                <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={32} height={32} className="object-contain" />
                            </div>
                        </div>
                        <Wallet className="h-8 w-8 text-primary" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-xs text-muted-foreground mt-4">
                            استخدم هذا الرصيد للاستثمار في المشاريع الواعدة
                        </p>
                    </CardContent>
                    <CardFooter className="relative z-10 p-0">
                            <Button onClick={() => setIsAddFundsOpen(true)} size="lg" className="w-full rounded-t-none h-14 text-base font-bold bg-primary/90 hover:bg-primary">
                            <PlusCircle className="ml-2 h-5 w-5" />
                            إضافة رصيد للمحفظة
                        </Button>
                    </CardFooter>
                </Card>

                {investments && investments.length > 0 ? (
                    <InvestmentTracker investments={investments} projects={projects} />
                ) : (
                     <Card className="text-center p-8 rounded-2xl">
                        <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">لم تقم بأي استثمارات بعد</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            تصفح المشاريع وابدأ رحلتك الاستثمارية.
                        </p>
                        <Link href="/projects">
                            <Button className="mt-6">تصفح المشاريع</Button>
                        </Link>
                    </Card>
                )}
                
                {isAddFundsOpen && (
                    <AddFundsDialog
                        onClose={() => setIsAddFundsOpen(false)}
                        onConfirm={handleAddFunds}
                    />
                )}
            </div>
        </AppLayout>
    );
}
