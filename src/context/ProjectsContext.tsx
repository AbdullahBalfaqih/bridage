'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Project, UserProfile } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const initialProjectsData: Project[] = [
    {
        id: 'smart-glasses',
        name: 'نظارة طبية ذكية',
        inventor: 'سالم الغامدي',
        submitterId: 'user1',
        briefDescription: 'نظارة طبية ذكية للكشف المبكر عن مؤشرات الأمراض الوراثية عبر تحليل البكتيريا في الفم باستخدام مستشعرات دقيقة متصلة بتطبيق.',
        problemDescription: 'يمثل هذا المشروع ثورة في عالم التشخيص المبكر، حيث يقدم نظارة طبية أنيقة مزودة بتقنية استشعار متقدمة. تقوم هذه المستشعرات بتحليل دقيق ومستمر للبيئة البكتيرية في الفم، وترسل البيانات لاسلكيًا إلى تطبيق متخصص على الهاتف. يستخدم التطبيق خوارزميات الذكاء الاصطناعي لتحديد الأنماط التي قد تشير إلى وجود استعداد وراثي لأمراض معينة، مما يفتح الباب للوقاية والعلاج المبكر قبل ظهور الأعراض بشكل كامل.',
        proposedSolution: 'تستخدم المستشعرات لتحليل العلامات الحيوية في اللعاب وإرسالها للتطبيق.',
        requiredCost: 20000,
        expectedProfits: 20,
        duration: 'سنة',
        category: 'تقنية طبية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772741404/Screenshot_2026-03-05_230945_o5vnip.png',
        imageHint: 'smart glasses',
        currentFunding: 8000,
        investors: 5,
        createdAt: new Date('2024-05-10T10:00:00Z').toISOString(),
        publishDate: new Date('2024-05-10T10:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    },
    {
        id: 'health-wristband',
        name: 'سوار صحي ذكي',
        inventor: 'فاطمة الشهري',
        submitterId: 'user2',
        briefDescription: 'سوار صحي ذكي لمرضى السكري يقيس التغيرات الجلدية الدقيقة المرتبطة بمستوى السكر دون وخز، ويرتبط بتطبيق تنبيهات فورية.',
        problemDescription: 'وداعًا للوخز اليومي المؤلم. هذا السوار الصحي المبتكر مصمم خصيصًا لمرضى السكري، حيث يستخدم تقنية استشعار بصرية غير جراحية لقياس التغيرات الطفيفة في خصائص الجلد المرتبطة مباشرةً بمستويات الجلوكوز في الدم. يتصل السوار بتطبيق على الهاتف الذكي يوفر قراءات لحظية، سجلات تاريخية، وتنبيهات ذكية عند ارتفاع أو انخفاض مستوى السكر، مما يمنح المستخدم راحة البال والقدرة على إدارة حالته الصحية بفعالية وسهولة.',
        proposedSolution: 'يقيس السوار التغيرات الجلدية ويرسل البيانات للتطبيق لتنبيه المستخدم.',
        requiredCost: 30000,
        expectedProfits: 25,
        duration: 'سنة ونصف',
        category: 'أجهزة ذكية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772912756/Screenshot_2026-03-07_224444_elibcp.png',
        imageHint: 'health wristband',
        currentFunding: 15000,
        investors: 12,
        createdAt: new Date('2024-04-20T12:00:00Z').toISOString(),
        publishDate: new Date('2024-04-20T12:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'venom',
    },
    {
        id: 'smart-farming-device',
        name: 'جهاز زراعي صغير',
        inventor: 'خالد العمري',
        submitterId: 'user3',
        briefDescription: 'جهاز زراعي صغير يعمل بالطاقة الشمسية لقياس رطوبة التربة وتحديد الري المثالي تلقائيًا للمزارع الصغيرة.',
        problemDescription: 'استجابةً لتحديات ندرة المياه والاستدامة، يقدم هذا المشروع جهازًا زراعيًا صغيرًا ومستقلاً يعمل بالكامل بالطاقة الشمسية. يتم وضع الجهاز في التربة ليقوم بقياس مستويات الرطوبة والعناصر الغذائية بشكل مستمر. بناءً على هذه البيانات، يتخذ الجهاز قرارًا ذكيًا بشأن الكمية والتوقيت المثاليين للري، ويقوم بتشغيل نظام الري تلقائيًا. هذا الحل مثالي للمزارع الصغيرة والحدائق المنزلية، حيث يضمن الاستخدام الأمثل للمياه ويزيد من إنتاجية المحاصيل.',
        proposedSolution: 'يعتمد الجهاز على حساسات لتحديد حاجة التربة للماء والري بشكل تلقائي.',
        requiredCost: 25000,
        expectedProfits: 22,
        duration: 'سنة',
        category: 'تقنية زراعية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772913881/Screenshot_2026-03-07_230417_jrul0t.png',
        imageHint: 'smart farming',
        currentFunding: 10000,
        investors: 8,
        createdAt: new Date('2024-05-01T09:00:00Z').toISOString(),
        publishDate: new Date('2024-05-01T09:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    },
    {
        id: 'medical-ai-app',
        name: 'تطبيق طبي بالذكاء الاصطناعي',
        inventor: 'فريق Venom',
        submitterId: 'venom_team',
        briefDescription: 'تطبيق طبي يعتمد على الذكاء الاصطناعي لتحليل أعراض النساء المبكرة وربطها بأقرب تخصص طبي مناسب.',
        problemDescription: 'يهدف هذا التطبيق إلى تمكين المرأة من فهم صحتها بشكل أفضل. من خلال واجهة سهلة الاستخدام، يمكن للمرأة إدخال الأعراض الصحية التي تواجهها. يقوم نظام ذكاء اصطناعي متطور بتحليل هذه الأعراض، ومقارنتها بقاعدة بيانات طبية واسعة، ومن ثم تقديم توجيهات أولية حول التخصص الطبي الأنسب لحالتها. لا يقدم التطبيق تشخيصًا نهائيًا، بل يعمل كأداة فرز ذكية ومساعد شخصي يوجه المستخدمة إلى الطبيب المختص المناسب، مما يوفر الوقت ويقلل من القلق.',
        proposedSolution: 'يستخدم التطبيق الذكاء الاصطناعي لتحليل الأعراض وتقديم توصيات طبية.',
        requiredCost: 40000,
        expectedProfits: 30,
        duration: 'سنتان',
        category: 'تقنية طبية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772915261/Screenshot_2026-03-07_232707_fsidmt.png',
        imageHint: 'medical ai',
        currentFunding: 25000,
        investors: 15,
        createdAt: new Date('2024-06-01T15:00:00Z').toISOString(),
        publishDate: new Date('2024-06-01T15:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'venom',
    },
    {
        id: 'organic-soil-capsules',
        name: 'كبسولات عضوية للتربة',
        inventor: 'نورة المطيري',
        submitterId: 'user4',
        briefDescription: 'كبسولات عضوية لتحسين خصوبة التربة تعتمد على بكتيريا نافعة محلية، تقلل استخدام الأسمدة الكيميائية بنسبة 40%.',
        problemDescription: 'يقدم هذا المشروع حلاً بيئيًا ومستدامًا للزراعة الحديثة. هذه الكبسولات العضوية تحتوي على سلالات منتقاة بعناية من البكتيريا النافعة المحلية، والتي تعمل على تثبيت النيتروجين في التربة وتحليل المواد العضوية، مما يزيد من خصوبتها بشكل طبيعي. استخدام هذه الكبسولات يقلل بشكل كبير من الحاجة إلى الأسمدة الكيميائية الضارة، ويحسن من بنية التربة وقدرتها على الاحتفاظ بالماء، مما يؤدي إلى محاصيل صحية ونظام بيئي أكثر توازنًا.',
        proposedSolution: 'تعتمد الكبسولات على بكتيريا نافعة لتحسين جودة التربة بشكل طبيعي.',
        requiredCost: 18000,
        expectedProfits: 28,
        duration: 'سنة',
        category: 'تقنية زراعية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773007104/Screenshot_2026-03-09_005806_fqst7h.png',
        imageHint: 'organic farming',
        currentFunding: 18000,
        investors: 20,
        createdAt: new Date('2024-03-15T11:00:00Z').toISOString(),
        publishDate: new Date('2024-03-15T11:00:00Z').toISOString(),
        status: 'Funded',
        type: 'standard',
    },
    {
        id: 'smart-sterilizer',
        name: 'جهاز منزلي ذكي لتعقيم الخضار والفواكه',
        inventor: 'عبدالعزيز الراشد',
        submitterId: 'user5',
        briefDescription: 'جهاز منزلي ذكي لتعقيم الخضار والفواكه بالأوزون الطبيعي دون مواد كيميائية، مخصص للعائلات.',
        problemDescription: 'في عالم يزداد فيه الوعي بأهمية سلامة الغذاء، يأتي هذا الجهاز المنزلي الذكي ليوفر راحة البال لكل عائلة. يستخدم الجهاز تقنية الأوزون الطبيعي (O3)، وهو عامل مؤكسد قوي وآمن، لتعقيم الخضار والفواكه والقضاء على 99.9% من البكتيريا والمبيدات الحشرية والفيروسات دون ترك أي بقايا كيميائية. يتميز الجهاز بتصميم أنيق وسهولة في الاستخدام، مما يجعله إضافة أساسية لكل مطبخ عصري يهتم بالصحة.',
        proposedSolution: 'يستخدم الجهاز الأوزون لتعقيم الخضار والفواكه بشكل آمن وفعال.',
        requiredCost: 22000,
        expectedProfits: 24,
        duration: 'سنة',
        category: 'أجهزة منزلية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773007518/Screenshot_2026-03-09_010453_gvj4jw.png',
        imageHint: 'clean vegetables',
        currentFunding: 5000,
        investors: 10,
        createdAt: new Date('2024-05-25T08:00:00Z').toISOString(),
        publishDate: new Date('2024-05-25T08:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    },
    {
        id: 'agri-marketing-platform',
        name: 'منصة إلكترونية لتسويق المنتجات الزراعية',
        inventor: 'علي الأحمد',
        submitterId: 'user6',
        briefDescription: 'منصة إلكترونية لتسويق المنتجات الزراعية المحلية مباشرة من المزارع إلى المستهلك مع نظام تتبع جودة.',
        problemDescription: 'تهدف هذه المنصة إلى بناء جسر مباشر بين المزارعين المحليين والمستهلكين، مما يلغي الوسطاء ويضمن حصول المزارع على سعر عادل والمستهلك على منتجات طازجة وصحية. تتيح المنصة للمزارعين عرض محاصيلهم وتحديد أسعارهم، بينما يمكن للمستهلكين تصفح المنتجات والطلب مباشرة. تتضمن المنصة نظام تتبع متكامل يسمح بمعرفة مصدر المنتج ومراحل زراعته، مما يعزز الثقة والشفافية في سلسلة التوريد الغذائي.',
        proposedSolution: 'تتيح المنصة للمزارعين عرض منتجاتهم مباشرة للمستهلكين.',
        requiredCost: 35000,
        expectedProfits: 27,
        duration: 'سنة ونصف',
        category: 'تجارة إلكترونية',
        image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773008821/Screenshot_2026-03-09_012647_mkemu2.png',
        imageHint: 'farm ecommerce',
        currentFunding: 12000,
        investors: 9,
        createdAt: new Date('2024-06-10T08:00:00Z').toISOString(),
        publishDate: new Date('2024-06-10T08:00:00Z').toISOString(),
        status: 'Funding Open',
        type: 'standard',
    }
];

interface ProjectsContextType {
  projects: Project[];
  projectsLoading: boolean;
  addProject: (projectData: Omit<Project, 'id' | 'inventor'| 'submitterId' | 'currentFunding' | 'investors' | 'createdAt' | 'status' | 'publishDate'> & { briefDescription: string; image?: string; imageHint?: string; }, user: UserProfile) => void;
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
  
  // This effect will run once to seed the database if it's empty.
  useEffect(() => {
    const seedDatabase = async () => {
        if (!firestore || projectsLoading) return;

        // Check a flag to see if seeding has been done.
        const seedingFlagRef = doc(firestore, 'internal', 'seeding');
        
        onSnapshot(seedingFlagRef, (snapshot) => {
            if (!snapshot.exists() || !snapshot.data().completed) {
                console.log("Seeding initial project data...");
                const promises = initialProjectsData.map(projectData => {
                    const projectRef = doc(firestore, 'public_projects', projectData.id);
                    // Use setDoc with merge:true to create or update.
                    return setDoc(projectRef, projectData, { merge: true });
                });

                Promise.all(promises).then(async () => {
                    // Set the flag to prevent re-seeding.
                    await setDoc(seedingFlagRef, { completed: true });
                    console.log("Seeding completed successfully.");
                }).catch((error) => {
                    console.error("Error during seeding:", error);
                })
            }
        });
    };

    seedDatabase();
  }, [firestore, projectsLoading]);
  

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);


  const addProject = (projectData: Omit<Project, 'id' | 'inventor'| 'submitterId' | 'currentFunding' | 'investors' | 'createdAt' | 'status' | 'publishDate'> & { briefDescription: string; image?: string; imageHint?: string; }, user: UserProfile) => {
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
      image: projectData.image || `https://picsum.photos/seed/${newProjectId}/400/200`,
      imageHint: projectData.imageHint || projectData.name,
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
