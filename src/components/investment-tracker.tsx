'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Investment, Project } from "@/lib/types";
import { TrendingUp, Calendar } from 'lucide-react';
import Image from "next/image";

type InvestmentTrackerProps = {
    investments: Investment[];
    projects: Project[];
};

const ClientSideDate = ({ dateString }: { dateString: string }) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        // This effect runs only on the client, after the component has mounted.
        setFormattedDate(new Date(dateString).toLocaleDateString('ar-SA'));
    }, [dateString]);

    // Return a placeholder during server-side rendering and initial client-side render.
    // The actual date will be rendered on the client after hydration.
    return <span>{formattedDate}</span>;
}


export default function InvestmentTracker({ investments, projects }: InvestmentTrackerProps) {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <Card className="bg-accent/30 border-primary/50 rounded-2xl">
            <CardHeader>
                <CardTitle className="text-lg font-headline font-medium">
                    تتبع استثماراتك
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 text-center">
                    <p className="text-sm text-muted-foreground">إجمالي المبلغ المستثمر</p>
                    <div className="text-4xl font-bold text-primary flex items-center justify-center gap-1 mt-1">
                        <span>{new Intl.NumberFormat('ar-SA').format(totalInvested)}</span>
                         <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={28} height={28} className="object-contain" />
                    </div>
                </div>
                
                <Separator className="my-4 bg-border/50" />

                <h4 className="font-bold text-base mb-4">المشاريع المستثمر بها:</h4>
                <div className="space-y-4">
                    {investments.map((investment, index) => {
                        const project = projects.find(p => p.id === investment.projectId);
                        if (!project) return null;

                        return (
                            <div key={index} className="flex items-center gap-4 bg-background/30 p-3 rounded-xl">
                                 <Image
                                    src={project.image}
                                    alt={project.name}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover aspect-square bg-black shrink-0"
                                />
                                <div className="flex-grow space-y-1">
                                    <p className="font-bold text-base">{project.name}</p>
                                    <div className="text-2xl text-primary font-bold flex items-center">
                                        <span>{new Intl.NumberFormat('ar-SA').format(investment.amount)}</span>
                                        <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={28} height={28} className="object-contain" />
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground text-left space-y-2">
                                     <div className="flex items-center gap-1.5 justify-end">
                                        <Calendar size={14} />
                                        <ClientSideDate dateString={investment.investmentDate} />
                                    </div>
                                    <div className="flex items-center gap-1.5 justify-end text-primary font-medium">
                                        <TrendingUp size={14} />
                                        <span>عائد {project.expectedProfits}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
