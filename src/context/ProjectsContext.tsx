'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { projects as initialProjects } from '@/lib/data';
import type { Project } from '@/lib/types';
import { z } from 'zod';

const formSchema = z.object({
  image: z.any(),
  name: z.string(),
  problem: z.string(),
  solution: z.string(),
  cost: z.number(),
  profit: z.number(),
  category: z.string(),
  duration: z.string(),
});

type NewProjectData = z.infer<typeof formSchema>;


type ProjectsContextType = {
  projects: Project[];
  addProject: (data: NewProjectData) => void;
  updateProject: (updatedProject: Project) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (data: NewProjectData) => {
    const imageFile = data.image[0];
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: data.name,
        inventor: 'نواف (أنت)',
        description: `${data.problem} - ${data.solution}`,
        cost: data.cost,
        expectedProfit: data.profit,
        duration: data.duration,
        category: data.category,
        image: e.target?.result as string,
        imageHint: 'custom project',
        amountRaised: 0,
        investors: 0,
        publishDate: new Date().toISOString(),
      };
      setProjects(prev => [newProject, ...prev]);
    };
    reader.readAsDataURL(imageFile);
  };
  
  const updateProject = (updatedProject: Project) => {
    setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
  }


  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
