'use client';

import { useProjects } from '@/context/ProjectsContext';
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  const { projects } = useProjects();
  // Get a variety of images for the background collage
  const collageImages = projects.slice(0, 9);

  return (
    <div className="relative flex flex-col items-center justify-end h-screen w-full bg-background overflow-hidden">
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
              />
            </div>
          ))}
        </div>
      </div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 w-full mb-8">
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
        <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-xs">
            <Link href="/onboarding" className="group relative py-2 text-2xl font-semibold text-foreground no-underline">
                ابدأ الآن
                <span className="absolute bottom-0 left-0 block h-0.5 w-full scale-x-0 transform bg-primary transition-transform duration-500 group-hover:scale-x-100"></span>
            </Link>
          <div className="text-center text-sm mt-2">
            <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
            <Link href="/login" className="underline text-primary font-semibold">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
