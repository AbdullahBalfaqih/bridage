'use client';

import AppLayout from "@/components/app-layout";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/context/ProjectsContext";
import { ArrowLeft, Lightbulb, TrendingUp, ShieldCheck, Search, SlidersHorizontal, MapPin, User, Bell, CheckCircle, PartyPopper, Info } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import type { UserProfile, Notification as NotificationType } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import type { LucideIcon } from "lucide-react";

const promoItems = [
  {
    title: "حول فكرتك إلى واقع",
    description: "شارك فكرتك على منصتنا واحصل على فرصة لتحويلها إلى مشروع ناجح.",
    icon: Lightbulb,
    color: "from-primary/90 to-primary",
  },
  {
    title: "فرص استثمارية واعدة",
    description: "تصفح مشاريع مبتكرة واستثمر في الأفكار التي تؤمن بها.",
    icon: TrendingUp,
    color: "from-primary/90 to-primary",
  },
  {
    title: "بيئة آمنة وموثوقة",
    description: "نوفر منصة آمنة وشفافة لجميع التعاملات لحماية حقوقك.",
    icon: ShieldCheck,
    color: "from-primary/90 to-primary",
  },
];

export default function HomePage() {
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['الكل', ...new Set(projects.map(p => p.category))];
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const [sortOrder, setSortOrder] = useState('newest');
  const maxCost = Math.max(...projects.map(p => p.requiredCost), 0);
  const [costRange, setCostRange] = useState([0, maxCost]);
  
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const notificationsQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, 'users', user.uid, 'notifications'), orderBy('createdAt', 'desc'), limit(3)) : null),
    [firestore, user]
  );
  const { data: notificationsData } = useCollection<NotificationType>(notificationsQuery);
  const notifications = notificationsData || [];
  
  const getNotificationIcon = (type: NotificationType['type']): LucideIcon => {
    switch (type) {
        case 'investment_accepted':
            return CheckCircle;
        case 'project_update':
            return Info;
        case 'welcome':
            return PartyPopper;
        default:
            return Bell;
    }
  };


  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const filteredProjects = projects
    .filter(project => {
      const categoryMatch = activeCategory === 'الكل' || project.category === activeCategory;
      const searchMatch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.briefDescription || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.inventor.toLowerCase().includes(searchQuery.toLowerCase());
      const costMatch = project.requiredCost >= costRange[0] && project.requiredCost <= costRange[1];
      return categoryMatch && searchMatch && costMatch;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'highest-cost':
          return b.requiredCost - a.requiredCost;
        case 'lowest-cost':
          return a.requiredCost - b.requiredCost;
        case 'most-funded':
          return (b.currentFunding || 0) - (a.currentFunding || 0);
        default:
          return 0;
      }
    });

  return (
    <AppLayout pageTitle="الرئيسية" hideHeader={true}>
      {/* Custom Header for Home Page */}
      <header className="bg-primary text-primary-foreground pt-4 px-4 pb-4 flex flex-col gap-4 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">مرحباً، {userProfile?.firstName || '...'}</h1>
              <p className="text-xs text-primary-foreground/80 flex items-center gap-1"><MapPin size={12}/> {userProfile?.city || '...'}، السعودية</p>
            </div>
          </div>
            <Popover>
                <PopoverTrigger asChild>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary/80">
                        <Bell />
                        {notifications.some(n => !n.isRead) && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-primary"></span>}
                    </Button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-[22rem] rounded-3xl p-0" align="end">
                    <div className="p-4">
                        <h4 className="font-bold leading-none text-foreground">الإشعارات</h4>
                    </div>
                    <Separator />
                    <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
                        {notifications.map((notification) => {
                            const NotificationIcon = getNotificationIcon(notification.type);
                            return (
                            <Card key={notification.id} className={`flex items-start gap-3 p-3 rounded-2xl bg-secondary/50 border ${!notification.isRead ? 'border-primary/30' : 'border-transparent'}`}>
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background`}>
                                    <NotificationIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-foreground text-sm">{notification.title}</p>
                                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                                      {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: arSA }) : ''}
                                    </p>
                                </div>
                            </Card>
                        )})}
                    </div>
                    <Separator />
                    <div className="p-2">
                        <Button variant="ghost" size="sm" className="w-full text-primary">عرض كل الإشعارات</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
        <div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن مشاريع..." 
              className="bg-card/80 text-foreground border-none pr-10 h-12 rounded-full" 
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
      </header>

      <div className="p-4 space-y-8">

        <div className="flex justify-start">
            <Image
                src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772502178/image-removebg-preview_52_nihduz.png"
                alt="شعار جسر الاستثمار"
                width={300}
                height={145}
                className="object-contain"
            />
        </div>

        {/* Promo Carousel */}
        <div className="relative my-8">
            <Carousel setApi={setApi} className="w-full" opts={{ direction: 'rtl', loop: true }}>
            <CarouselContent>
                {promoItems.map((promo, index) => (
                <CarouselItem key={index}>
                    <Card className={`rounded-2xl bg-gradient-to-l ${promo.color} text-primary-foreground p-5 h-[150px] relative`}>
                        <promo.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-20 w-20 text-white/20" />
                        <div className="flex flex-col items-start text-right h-full">
                            <h2 className="font-bold text-xl">{promo.title}</h2>
                            <p className="text-xs opacity-80 mt-1 max-w-[calc(100%-5rem)]">{promo.description}</p>
                            <div className="flex-grow" />
                            <Button size="sm" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full !h-9 !w-9 !p-0" onClick={() => api?.scrollNext()}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {promoItems.map((_, i) => (
                <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                />
            ))}
            </div>
        </div>
        
        {/* Venom Promo Card */}
        <div className="my-8">
          <Link href="/venom">
            <Card className="rounded-2xl bg-zinc-900 border-primary/30 p-5 relative overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="flex justify-between items-center text-right">
                  <div className="z-10">
                      <h2 className="font-bold text-xl text-primary-foreground">مجتمع Venom للألعاب</h2>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[calc(100%-5rem)]">اكتشف فرص الاستثمار في عالم الرياضات الإلكترونية.</p>
                  </div>
                  <Image
                      src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1773446123/image-removebg-preview_61_jhnnbv.png"
                      alt="شعار فينوم"
                      width={80}
                      height={80}
                      className="object-contain z-10 -ml-4"
                  />
              </div>
               <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            </Card>
          </Link>
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
        <div>
          <h2 className="text-xl font-bold mb-4">أفضل المشاريع</h2>
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))
            ) : (
                <p className="text-muted-foreground text-center py-8">لا توجد مشاريع تطابق بحثك.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
