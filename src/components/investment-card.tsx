'use client';

import Image from 'next/image';
import type { Project } from '@/lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Users, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

type InvestmentCardProps = {
  project: Project;
  onInvestClick: () => void;
};

export default function InvestmentCard({ project, onInvestClick }: InvestmentCardProps) {
  const router = useRouter();
  const fundingProgress = project.amountRaised && project.cost ? (project.amountRaised / project.cost) * 100 : 0;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if invest button is clicked
    if ((e.target as HTMLElement).closest('button')) {
      e.stopPropagation();
      return;
    }
    router.push(`/projects/${project.id}`);
  };


  return (
    <Card
      onClick={handleCardClick}
      className="p-4 rounded-2xl space-y-4 transition-all hover:bg-muted/50 w-full cursor-pointer"
    >
        <div className="flex gap-4 items-start">
            <Image
                src={project.image}
                alt={project.name}
                width={90}
                height={90}
                className="rounded-xl object-cover aspect-square bg-black shrink-0"
                data-ai-hint={project.imageHint}
            />
            <div className="flex-grow space-y-1">
                <h3 className="font-bold text-lg">{project.name}</h3>
                <p className="text-xs text-muted-foreground">{project.inventor}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-primary">
                    {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(project.amountRaised || 0)}
                    <span className="text-muted-foreground text-xs"> / {new Intl.NumberFormat('ar-SA').format(project.cost)}</span>
                </span>
                <span className="text-xs font-bold">{fundingProgress.toFixed(0)}%</span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
             <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{project.investors || 0} مستثمرون</span>
                </div>
                <div className="flex items-center gap-1">
                    <Target size={12} />
                    <span>{project.duration}</span>
                </div>
            </div>
        </div>

        <Button onClick={(e) => { e.stopPropagation(); onInvestClick(); }} className="w-full">
            استثمر في هذا المشروع
        </Button>
    </Card>
  );
}
