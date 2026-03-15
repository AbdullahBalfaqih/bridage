'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Project, UserProfile } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const initialProjectsData: Omit<Project, 'id'>[] = [
    {
        name: 'نظارة طبية ذكية',
        inventor: 'سالم الغامدي',
        submitterId: 'user1',
        briefDescription: 'نظارة طبية تساعد ضعاف البصر على الرؤية باستخدام الذكاء الاصطناعي.',
        problemDescription: 'يعاني الكثير من ضعاف البصر من صعوبة في القراءة والتنقل.',
        proposedSolution: 'تطوير نظارة ذكية مزودة بكاميرا وتقنيات التعرف على الصور والنصوص لتحويلها إلى صوت.',
        requiredCost: 250000,
        expectedProfits: 40,
        duration: 'سنتان',
        category: 'تقنية طبية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772741404/Screenshot_2026-03-05_230945_o5vnip.png',
        imageHint: 'smart glasses',
        currentFunding: 110000,
        investors: 22,
        createdAt: new Date('2024-05-10T10:00:00Z').toISOString(),
        publishDate: new Date('2024-05-10T10:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    },
    {
        name: 'سوار صحي متطور',
        inventor: 'فاطمة الشهري',
        submitterId: 'user2',
        briefDescription: 'سوار ذكي يتتبع العلامات الحيوية ويرسل تنبيهات للطوارئ.',
        problemDescription: 'صعوبة متابعة الحالة الصحية لكبار السن بشكل مستمر.',
        proposedSolution: 'سوار يقيس نبضات القلب، الأكسجين، والحرارة ويرسل بيانات لحظية لتطبيق على الجوال.',
        requiredCost: 80000,
        expectedProfits: 25,
        duration: 'سنة واحدة',
        category: 'أجهزة ذكية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772912756/Screenshot_2026-03-07_224444_elibcp.png',
        imageHint: 'health wristband',
        currentFunding: 80000,
        investors: 40,
        createdAt: new Date('2024-04-20T12:00:00Z').toISOString(),
        publishDate: new Date('2024-04-20T12:00:00Z').toISOString(),
        status: 'Funded',
        type: 'venom',
    },
    {
        name: 'منصة تسويق للمزارعين',
        inventor: 'خالد العمري',
        submitterId: 'user3',
        briefDescription: 'تطبيق يربط المزارعين المحليين بالمستهلكين مباشرة.',
        problemDescription: 'يواجه المزارعون صعوبة في الوصول إلى الأسواق وبيع منتجاتهم بأسعار عادلة.',
        proposedSolution: 'منصة إلكترونية تتيح للمزارعين عرض منتجاتهم وتسهل على المشترين الطلب والتوصيل.',
        requiredCost: 120000,
        expectedProfits: 35,
        duration: '18 شهرًا',
        category: 'تجارة إلكترونية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773008821/Screenshot_2026-03-09_012647_mkemu2.png',
        imageHint: 'farm ecommerce',
        currentFunding: 50000,
        investors: 10,
        createdAt: new Date('2024-05-01T09:00:00Z').toISOString(),
        publishDate: new Date('2024-05-01T09:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    },
    {
        name: 'الذكاء الاصطناعي في الطب',
        inventor: 'فريق Venom',
        submitterId: 'venom_team',
        briefDescription: 'استخدام الذكاء الاصطناعي لتشخيص الأمراض الجلدية بدقة عالية.',
        problemDescription: 'التأخر في تشخيص الأمراض الجلدية قد يؤدي إلى تفاقم الحالة.',
        proposedSolution: 'تطوير نموذج تعلم آلة يمكنه تحليل صور الجلد وتقديم تشخيص مبدئي فوري.',
        requiredCost: 500000,
        expectedProfits: 50,
        duration: '3 سنوات',
        category: 'تقنية طبية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772915261/Screenshot_2026-03-07_232707_fsidmt.png',
        imageHint: 'medical ai',
        currentFunding: 200000,
        investors: 5,
        createdAt: new Date('2024-06-01T15:00:00Z').toISOString(),
        publishDate: new Date('2024-06-01T15:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'venom',
    },
    {
        name: 'جهاز تعقيم خضروات',
        inventor: 'نورة المطيري',
        submitterId: 'user4',
        briefDescription: 'جهاز منزلي يستخدم تقنية آمنة لتعقيم الفواكه والخضروات.',
        problemDescription: 'القلق من بقايا المبيدات والجراثيم على المنتجات الطازجة.',
        proposedSolution: 'جهاز يستخدم الأشعة فوق البنفسجية والموجات فوق الصوتية لإزالة الملوثات بفعالية.',
        requiredCost: 60000,
        expectedProfits: 30,
        duration: 'سنة واحدة',
        category: 'أجهزة منزلية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773007518/Screenshot_2026-03-09_010453_gvj4jw.png',
        imageHint: 'clean vegetables',
        currentFunding: 60000,
        investors: 35,
        createdAt: new Date('2024-03-15T11:00:00Z').toISOString(),
        publishDate: new Date('2024-03-15T11:00:00Z').toISOString(),
        status: 'Funded',
        type: 'standard',
    },
    {
        name: 'مزرعة بالطاقة الشمسية',
        inventor: 'عبدالعزيز الراشد',
        submitterId: 'user5',
        briefDescription: 'مشروع زراعة مائية يعتمد بالكامل على الطاقة الشمسية.',
        problemDescription: 'تكلفة الكهرباء العالية في المزارع التقليدية.',
        proposedSolution: 'إنشاء مزرعة مائية مغلقة مع ألواح شمسية لتوفير الطاقة اللازمة للري والإضاءة والتهوية.',
        requiredCost: 450000,
        expectedProfits: 28,
        duration: '3 سنوات',
        category: 'طاقة متجددة',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772913881/Screenshot_2026-03-07_230417_jrul0t.png',
        imageHint: 'solar farming',
        currentFunding: 95000,
        investors: 18,
        createdAt: new Date('2024-05-25T08:00:00Z').toISOString(),
        publishDate: new Date('2024-05-25T08:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    }
];

interface ProjectsContextType {
  projects: Project[];
  projectsLoading: boolean;
  addProject: (projectData: Omit<Project, 'id' | 'inventor'| 'submitterId' | 'currentFunding' | 'investors' | 'createdAt' | 'status' | 'publishDate'> & { briefDescription: string; }, user: UserProfile) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  
  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'public_projects'), orderBy('publishDate', 'desc')) : null),
    [firestore]
  );
  
  const { data: projectsData, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  const [projects, setProjects] = useState<Project[]>(projectsData || []);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // This effect will run once to seed the database if it's empty.
  useEffect(() => {
    if (firestore && !projectsLoading && projectsData?.length === 0 && !isSeeding) {
      setIsSeeding(true);
      const projectsCollection = collection(firestore, 'public_projects');
      initialProjectsData.forEach(projectData => {
        const newProjectRef = doc(projectsCollection);
        const newProjectId = newProjectRef.id;
        const newProject: Project = {
          ...projectData,
          id: newProjectId,
        };
        // Use setDoc with a specific ID to avoid duplicates on multiple runs
        // This is a non-blocking write.
        setDocumentNonBlocking(newProjectRef, newProject, {});
      });
    }
  }, [firestore, projectsLoading, projectsData, isSeeding]);
  

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);


  const addProject = (projectData: Omit<Project, 'id' | 'inventor'| 'submitterId' | 'currentFunding' | 'investors' | 'createdAt' | 'status' | 'publishDate'> & { briefDescription: string; }, user: UserProfile) => {
    if (!firestore) return;
    
    const projectsCollection = collection(firestore, 'public_projects');
    const newProjectRef = doc(projectsCollection);
    const newProjectId = newProjectRef.id;

    const newProject: Project = {
      id: newProjectId,
      inventor: user.username,
      submitterId: user.id,
      name: projectData.name,
      briefDescription: projectData.briefDescription,
      problemDescription: projectData.problemDescription,
      proposedSolution: projectData.proposedSolution,
      requiredCost: projectData.requiredCost,
      expectedProfits: projectData.expectedProfits,
      duration: projectData.duration,
      category: projectData.category,
      image: `https://picsum.photos/seed/${newProjectId}/400/200`,
      imageHint: projectData.name,
      currentFunding: 0,
      investors: 0,
      createdAt: new Date().toISOString(),
      status: 'Submitted',
      type: projectData.type,
      publishDate: new Date().toISOString(),
    };
    
    setDocumentNonBlocking(newProjectRef, newProject, {});
  };

  const contextValue = { projects, projectsLoading, addProject, setProjects };
  
  return (
    <ProjectsContext.Provider value={contextValue}>
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
