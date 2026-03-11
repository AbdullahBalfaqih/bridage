'use client';

import { ArrowLeft, Bot, Info, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
    {
        question: "ما هو جسر الاستثمار؟",
        answer: "جسر الاستثمار هو منصة رائدة تربط بين رواد الأعمال والمخترعين الذين يمتلكون أفكارًا واعدة، وبين المستثمرين الذين يبحثون عن فرص استثمارية مبتكرة. نحن نهدف إلى بناء جسر من الثقة والنجاح المشترك."
    },
    {
        question: "كيف يمكنني إضافة فكرة مشروع؟",
        answer: "يمكنك بسهولة إضافة فكرتك من خلال الضغط على أيقونة 'أضف فكرة' في الشريط السفلي، ثم ملء النموذج بالمعلومات المطلوبة. سيقوم فريقنا بمراجعة الفكرة وعرضها على المستثمرين."
    },
    {
        question: "كيف أستثمر في المشاريع؟",
        answer: "بعد شحن محفظتك الافتراضية، يمكنك تصفح المشاريع المتاحة في قسم 'المشاريع'. عند اختيار مشروع، يمكنك الضغط على 'استثمر الآن' وتحديد المبلغ الذي ترغب في استثماره."
    },
    {
        question: "هل استثماراتي آمنة؟",
        answer: "نعم، نحن نوفر بيئة آمنة وشفافة. جميع التعاملات تتم بشكل افتراضي داخل التطبيق لغرض المحاكاة والتعلم، ونحن نضمن وضوح جميع الإجراءات."
    }
]

export default function HelpAndSupportPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-primary/50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-bold font-headline">المساعدة والدعم</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4 space-y-6">
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-6 w-6 text-primary"/>
                    <span>الأسئلة الشائعة</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index+1}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary"/>
                    <span>تواصل معنا</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    لم تجد إجابة لسؤالك؟ فريق الدعم لدينا جاهز لمساعدتك.
                </p>
                <a href="https://wa.me/966000000000" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full rounded-xl" size="lg">
                        <Bot className="ml-2 h-5 w-5" />
                        تواصل عبر واتساب
                        <ExternalLink className="mr-auto h-4 w-4" />
                    </Button>
                </a>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
