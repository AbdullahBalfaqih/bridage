'use client';

import { useState } from 'react';
import AppLayout from "@/components/app-layout";
import { useProjects } from "@/context/ProjectsContext";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import InvestmentCard from '@/components/investment-card';
import InvestDialog from '@/components/invest-dialog';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";


export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { projects, setProjects } = useProjects();
  const categories = ['الكل', ...new Set(projects.map(p => p.category))];
  const [activeCategory, setActiveCategory] = useState('الكل');
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [virtualBalance, setVirtualBalance] = useState(50000); // This should probably come from a shared context, but for now this is fine.
  const { toast } = useToast();

  const [sortOrder, setSortOrder] = useState('newest');
  const maxCost = Math.max(...projects.map(p => p.cost), 0);
  const [costRange, setCostRange] = useState([0, maxCost]);

  const handleInvestClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleConfirmInvestment = (amount: number) => {
    if (!selectedProject) return;
    
    if (amount <= 0) {
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

  const filteredProjects = projects
    .filter(project => {
      const categoryMatch = activeCategory === 'الكل' || project.category === activeCategory;
      const searchMatch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.inventor.toLowerCase().includes(searchQuery.toLowerCase());
      const costMatch = project.cost >= costRange[0] && project.cost <= costRange[1];
      return categoryMatch && searchMatch && costMatch;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'highest-cost':
          return b.cost - a.cost;
        case 'lowest-cost':
          return a.cost - b.cost;
        case 'most-funded':
          return (b.amountRaised || 0) - (a.amountRaised || 0);
        default:
          return 0;
      }
    });

  return (
    <AppLayout pageTitle="المشاريع">
      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن مشاريع..." 
              className="bg-card text-foreground border-border pr-10 h-12 rounded-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute left-1.5 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground">
                        <SlidersHorizontal className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-2xl" align="end">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">الفلاتر</h4>
                            <p className="text-sm text-muted-foreground">
                                خصص البحث عن المشاريع.
                            </p>
                        </div>
                        <Separator />
                        <div className="grid gap-4">
                            <div className="grid grid-cols-1 items-center gap-2">
                                <Label htmlFor="sort-by">ترتيب حسب</Label>
                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                    <SelectTrigger id="sort-by" className="w-full rounded-xl">
                                        <SelectValue placeholder="اختر الترتيب" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">الأحدث</SelectItem>
                                        <SelectItem value="oldest">الأقدم</SelectItem>
                                        <SelectItem value="highest-cost">الأعلى تكلفة</SelectItem>
                                        <SelectItem value="lowest-cost">الأقل تكلفة</SelectItem>
                                        <SelectItem value="most-funded">الأكثر تمويلاً</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 items-center gap-2 pt-2">
                                <Label htmlFor="cost-range">نطاق التكلفة</Label>
                                <Slider
                                    id="cost-range"
                                    min={0}
                                    max={maxCost}
                                    step={1000}
                                    value={costRange}
                                    onValueChange={setCostRange}
                                    className="pt-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <span>{new Intl.NumberFormat('ar-SA').format(costRange[0])}</span>
                                        <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={16} height={16} className="object-contain" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>{new Intl.NumberFormat('ar-SA').format(costRange[1])}</span>
                                        <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={16} height={16} className="object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <Button variant="ghost" onClick={() => {
                            setSortOrder('newest');
                            setCostRange([0, maxCost]);
                        }}>إعادة تعيين الفلاتر</Button>
                    </div>
                </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <Button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                variant={activeCategory === cat ? 'default' : 'secondary'}
                className="shrink-0 rounded-full px-5"
            >
                {cat}
            </Button>
          ))}
        </div>

        {/* Projects List */}
        <div className="flex flex-col items-center space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <InvestmentCard
                key={project.id}
                project={project}
                onInvestClick={() => handleInvestClick(project)}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">لا توجد مشاريع تطابق بحثك.</p>
          )}
        </div>

        {selectedProject && (
            <InvestDialog
                project={selectedProject}
                balance={virtualBalance}
                onClose={() => setSelectedProject(null)}
                onConfirm={handleConfirmInvestment}
            />
        )}
      </div>
    </AppLayout>
  );
}
