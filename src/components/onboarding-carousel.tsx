'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectsContext';

const onboardingSteps = [
  {
    image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772410436/image-removebg-preview_47_kvadhz.png',
    title: 'حول فكرتك إلى واقع',
    description: 'لديك فكرة مشروع رائعة؟ شاركها على منصتنا واحصل على فرصة لتحويلها إلى مشروع ناجح بدعم من شبكة واسعة من المستثمرين.',
  },
  {
    image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772411586/image-removebg-preview_48_t2ypxb.png',
    title: 'ابحث عن فرصة استثمارية',
    description: 'تصفح مجموعة متنوعة من المشاريع المبتكرة في مختلف المجالات. استثمر في الأفكار التي تؤمن بها وكن جزءًا من قصة نجاحها.',
  },
  {
    image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772411574/image-removebg-preview_49_lgytzj.png',
    title: 'بيئة آمنة وموثوقة',
    description: 'نوفر لك منصة آمنة وموثوقة لإدارة استثماراتك. نضمن الشفافية في جميع التعاملات لحماية حقوقك كمستثمر أو صاحب فكرة.',
  },
  {
    image: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1772411935/image-removebg-preview_50_hulupg.png',
    title: 'انطلق نحو مستقبل مشرق',
    description: 'أنت على بعد خطوات من تحقيق طموحاتك. انضم إلى مجتمع جسر الاستثمار اليوم وابدأ رحلتك نحو النجاح.',
  },
];

const totalSteps = onboardingSteps.length + 1;


export function OnboardingCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const { projects } = useProjects();
  const collageImages = projects.slice(0, 9);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollNext = () => {
    api?.scrollNext();
  };

  const isLastStep = current === totalSteps - 1;

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full bg-background text-foreground overflow-hidden">
        {/* Background Image Collage */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="grid grid-cols-3 grid-rows-3 h-full w-full gap-2 -rotate-12 scale-150">
            {collageImages.map((img, index) => (
                <div key={index} className="relative">
                <Image
                    src={img.image}
                    alt={img.name}
                    fill
                    sizes="33vw"
                    className="object-cover rounded-lg"
                    data-ai-hint={img.imageHint}
                />
                </div>
            ))}
            </div>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

        <Carousel 
            setApi={setApi} 
            className="w-full max-w-md z-10"
            opts={{ direction: 'rtl' }}
        >
            <CarouselContent>
            {onboardingSteps.map((step, index) => (
                <CarouselItem key={index}>
                    <div className="flex flex-col items-center justify-center text-center p-8 h-[70vh]">
                        <motion.div
                            className="mb-8"
                            animate={{ y: [0, -15, 0] }}
                            transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            }}
                        >
                            <Image 
                            src={step.image} 
                            alt={step.title} 
                            width={250} 
                            height={250} 
                            className="object-contain" 
                            />
                        </motion.div>
                        <h2 className="text-3xl font-bold font-headline mb-4">{step.title}</h2>
                        <p className="text-muted-foreground max-w-xs">
                            {step.description}
                        </p>
                    </div>
                </CarouselItem>
            ))}
            <CarouselItem>
                <div className="flex flex-col items-center justify-center text-center p-8 h-[70vh]">
                    <Image
                        src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772502178/image-removebg-preview_52_nihduz.png"
                        alt="شعار جسر الاستثمار"
                        width={300}
                        height={145}
                        className="object-contain drop-shadow-lg"
                    />
                    <p className="mt-4 text-lg text-muted-foreground max-w-md">
                        منصة تربط الأفكار بالتمويل، حيث تتحول الرؤى إلى مشاريع ناجحة.
                    </p>
                </div>
            </CarouselItem>
            </CarouselContent>
        </Carousel>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background/50 to-transparent z-10">
            <div className="flex items-center justify-between max-w-md mx-auto">
                <Button variant="ghost" className="text-foreground hover:bg-foreground/10" asChild>
                    <Link href="/login">تخط</Link>
                </Button>

                <div className="flex items-center gap-2">
                    {[...Array(totalSteps)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                        current === i ? 'w-6 bg-foreground' : 'w-2 bg-foreground/50'
                        }`}
                    />
                    ))}
                </div>
                
                {isLastStep ? (
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                         <Link href="/login">ابدأ الآن</Link>
                    </Button>
                ) : (
                    <Button onClick={scrollNext} className="bg-foreground text-background hover:bg-foreground/90">
                        التالي
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
}
