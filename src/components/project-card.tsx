
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Project } from '@/lib/types';
import { Card } from './ui/card';
import { LikeButton } from './like-button';

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if the click is on the like button container
    if ((e.target as HTMLElement).closest('.heart-container')) {
        e.stopPropagation();
        return;
    }
    router.push(`/projects/${project.id}`);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="flex items-center justify-between gap-4 p-3 transition-all hover:bg-muted/50 border-transparent hover:border-primary rounded-2xl w-full cursor-pointer"
    >
      <Image
        src={project.image}
        alt={project.name}
        width={80}
        height={80}
        className="rounded-xl object-cover aspect-square bg-black shrink-0"
        data-ai-hint={project.imageHint}
      />
      <div className="flex-grow space-y-2 overflow-hidden">
        <h3 className="font-bold truncate">{project.name}</h3>
        <p className="text-xs text-muted-foreground truncate h-8">{project.briefDescription}</p>
        <div className="flex items-center justify-between">
          <div className="font-bold text-primary flex items-center text-2xl">
              <span>{new Intl.NumberFormat('ar-SA').format(project.requiredCost)}</span>
              <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={28} height={28} className="object-contain" />
          </div>
          <LikeButton projectId={project.id} />
        </div>
      </div>
    </Card>
  );
}
