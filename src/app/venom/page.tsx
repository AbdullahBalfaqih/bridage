
'use client';

import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Handshake, Rocket } from "lucide-react";
import Image from "next/image";
import { useProjects } from "@/context/ProjectsContext";
import ProjectCard from "@/components/project-card";


export default function VenomPage() {
    const { projects } = useProjects();
    const venomProjects = projects.filter(p => p.type === 'venom');

    return (
        <AppLayout pageTitle="Venom Esports" hideHeader={true}>
            <div className="venom-theme">
                <div className="relative h-48 w-full">
                    <Image
                        src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1773448497/Screenshot_2026-03-14_033431_c9r4ci.png"
                        alt="Venom background"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        data-ai-hint="abstract gaming"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-background p-2">
                            <Image
                                src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1773446123/image-removebg-preview_61_jhnnbv.png"
                                alt="شعار فينوم"
                                width={100}
                                height={100}
                                className="object-contain rounded-full bg-black p-2"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-20 p-4 space-y-6 text-center">
                    <h1 className="text-3xl font-bold font-headline text-primary">Venom Esports Team</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        فريق رياضي إلكتروني طموح يهدف إلى المنافسة على أعلى المستويات في عالم الألعاب والرياضات الإلكترونية.
                    </p>
                    
                    <Separator />

                    <Card className="rounded-2xl text-left">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Handshake className="h-6 w-6 text-primary"/>
                                <span>تفاصيل الاستثمار</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/50 space-y-2">
                                <p className="text-sm text-muted-foreground">نسبة المستثمر</p>
                                <p className="text-2xl font-bold text-primary">60% - 70%</p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/50 space-y-2">
                                <p className="text-sm text-muted-foreground">نسبة Venom</p>
                                <p className="text-2xl font-bold text-foreground">30% - 40%</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl text-left">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Rocket className="h-6 w-6 text-primary"/>
                                <span>مشاريع Venom</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-2">
                            {venomProjects.length > 0 ? (
                                venomProjects.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground p-8">
                                    <p>لا توجد مشاريع خاصة بـ Venom حاليًا.</p>
                                    <p className="text-sm">يمكنك إضافة فكرة مشروع من تبويب "أضف فكرة".</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>


                    <div className="h-20"></div>
                </div>
            </div>
        </AppLayout>
    );
}
