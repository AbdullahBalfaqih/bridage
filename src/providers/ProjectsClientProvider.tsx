'use client';

import { ProjectsProvider } from '@/context/ProjectsContext';

export default function ProjectsClientProvider({ children }: { children: React.ReactNode }) {
    return <ProjectsProvider>{children}</ProjectsProvider>;
}
