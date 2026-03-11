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
import type { Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


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
  const { projects, setProjects } = useProjects();
  const project = projects.find(p => p.id === params.id);
  const { toast } = useToast();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [virtualBalance, setVirtualBalance] = useState(50000);

  if (!project) {
    notFound();
  }

  const handleInvestClick = () => {
    setSelectedProject(project);
  };

  const handleConfirmInvestment = (amount: number) => {
    if (!selectedProject || amount <= 0) {
        toast({
            variant: "destructive",
            title: "خطأ",
            description: "الرجاء إدخال مبلغ استثمار صحيح.",
        });
        return;
    }
    if (amount > virtualBalance) {
        toast({
            variant: "destructive",
            title: "خطأ",
            description: "رصيدك غير كافٍ لإتمام هذا الاستثمار.",
        });
        return;
    }

    setVirtualBalance(prev => prev - amount);
    setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === selectedProject.id) {
            return {
                ...p,
                amountRaised: (p.amountRaised || 0) + amount,
                investors: (p.investors || 0) + 1,
            };
        }
        return p;
    }));
    setSelectedProject(null);
  };
  
  const fundingProgress = project.amountRaised && project.cost ? (project.amountRaised / project.cost) * 100 : 0;

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
                    <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat('ar-SA').format(project.amountRaised || 0)}</span>
                    <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={20} height={20} className="object-contain -mr-1" />
                    <span className="text-muted-foreground text-xs"> تم جمعه من {new Intl.NumberFormat('ar-SA').format(project.cost)}</span>
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
                        <span>{new Intl.NumberFormat('ar-SA').format(project.cost)}</span>
                        <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={20} height={20} className="object-contain -mr-1" />
                    </div>
                }
            />
            <StatCard 
                icon={Percent}
                title="الربح المتوقع"
                value={`${project.expectedProfit}%`}
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
                            {project.description}
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
      {selectedProject && (
        <InvestDialog
            project={selectedProject}
            balance={virtualBalance}
            onClose={() => setSelectedProject(null)}
            onConfirm={handleConfirmInvestment}
        />
      )}
    </AppLayout>
  );
}
