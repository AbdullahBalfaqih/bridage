'use client';
import { useState } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/context/ProjectsContext";
import { notFound, useParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, Percent, Clock, Tag, User, Users } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { InvestmentProgressChart } from "@/components/investment-progress-chart";
import InvestDialog from "@/components/invest-dialog";
import type { Project, UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, increment } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader } from "@/components/loader";

type StatCardProps = {
  icon: LucideIcon;
  title: string;
  value: ReactNode;
  description?: string;
};

const StatCard = ({ icon: Icon, title, value, description }: StatCardProps) => (
  <Card className="bg-secondary/50 rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const { projects, projectsLoading } = useProjects();
  const project = projects.find(p => p.id === params.id);
  const { toast } = useToast();
  
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const handleInvestClick = () => {
    setIsInvestDialogOpen(true);
  };
  
  const handleConfirmInvestment = (amount: number) => {
    if (!project || !user || !userProfile || !firestore) return;

    if (amount <= 0) {
        toast({ variant: "destructive", title: "خطأ", description: "الرجاء إدخال مبلغ استثمار صحيح." });
        return;
    }
    if (amount > userProfile.virtualBalance) {
        toast({ variant: "destructive", title: "خطأ", description: "رصيدك غير كافٍ لإتمام هذا الاستثمار." });
        return;
    }

    // 1. Create investment record
    const investmentsColRef = collection(firestore, 'users', user.uid, 'investments');
    addDocumentNonBlocking(investmentsColRef, {
      investorId: user.uid,
      projectId: project.id,
      amount: amount,
      investmentDate: new Date().toISOString(),
      status: 'Confirmed'
    });

    // 2. Decrement user balance
    if (userProfileRef) {
      updateDocumentNonBlocking(userProfileRef, { virtualBalance: increment(-amount) });
    }

    // 3. Increment project funding
    const projectDocRef = doc(firestore, 'public_projects', project.id);
    updateDocumentNonBlocking(projectDocRef, {
      currentFunding: increment(amount),
      investors: increment(1)
    });
    
    setIsInvestDialogOpen(false);
  };

  if (projectsLoading || isUserLoading || profileLoading) {
    return <AppLayout pageTitle="..."><Loader /></AppLayout>
  }
  
  if (!project) {
    notFound();
  }
  
  const fundingProgress = project.currentFunding && project.requiredCost ? (project.currentFunding / project.requiredCost) * 100 : 0;

  return (
    <AppLayout pageTitle={project.name} showBackButton={true}>
      <div className="p-4 space-y-6 flex flex-col items-center">
        <div className="w-full max-w-sm bg-black rounded-xl">
            <Image
                src={project.image}
                alt={project.name}
                width={400}
                height={200}
                className="rounded-2xl object-cover w-full aspect-video"
                data-ai-hint={project.imageHint}
            />
        </div>
        
        <Card className="w-full max-w-sm rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat('ar-SA').format(project.currentFunding || 0)}</span>
                    <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={20} height={20} className="object-contain -mr-1" />
                    <span className="text-muted-foreground text-xs"> تم جمعه من {new Intl.NumberFormat('ar-SA').format(project.requiredCost)}</span>
                </div>
                <span className="text-lg font-bold">{fundingProgress.toFixed(0)}%</span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
             <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{project.investors || 0} مستثمر</span>
                </div>
            </div>
        </Card>

        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
            <StatCard 
                icon={CircleDollarSign}
                title="الهدف"
                value={
                    <div className="flex items-center gap-1 justify-start">
                        <span>{new Intl.NumberFormat('ar-SA').format(project.requiredCost)}</span>
                        <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={20} height={20} className="object-contain -mr-1" />
                    </div>
                }
            />
            <StatCard 
                icon={Percent}
                title="الربح المتوقع"
                value={`${project.expectedProfits}%`}
            />
             <StatCard 
                icon={Clock}
                title="المدة"
                value={project.duration}
            />
             <StatCard 
                icon={Tag}
                title="التصنيف"
                value={<Badge variant="secondary" className="text-sm">{project.category}</Badge>}
            />
        </div>

        <InvestmentProgressChart />
        
        <Card className="w-full max-w-sm rounded-2xl">
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-6 text-lg font-bold">
                        عن المشروع
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed">
                            {project.briefDescription}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>

        <Card className="w-full max-w-sm rounded-2xl">
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">مقدم من</p>
                        <h3 className="font-bold text-lg">{project.inventor}</h3>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                        <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
            </CardHeader>
        </Card>

        <div className="w-full max-w-sm pt-4 pb-24">
             <button className="button-invest-now" onClick={handleInvestClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    fill="currentColor"
                >
                    <path fill="none" d="M0 0h48v48H0z"></path>
                    <path
                    d="M42 36v2c0 2.21-1.79 4-4 4H10c-2.21 0-4-1.79-4-4V10c0-2.21 1.79-4 4-4h28c2.21 0 4 1.79 4 4v2H24c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h18zm-18-4h20V16H24v16zm8-5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                    ></path>
                </svg>
                استثمر الآن
            </button>
        </div>
      </div>
      {isInvestDialogOpen && userProfile && (
        <InvestDialog
            project={project}
            balance={userProfile.virtualBalance}
            onClose={() => setIsInvestDialogOpen(false)}
            onConfirm={handleConfirmInvestment}
        />
      )}
    </AppLayout>
  );
}
