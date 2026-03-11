'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type AddFundsDialogProps = {
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

const fundAmounts = [1000, 5000, 10000, 25000];
const paymentMethods = [
    { value: 'visa', label: 'بطاقة فيزا', imageUrl: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773173698/image-removebg-preview_56_xehjpj.png', details: '**** 4321' },
    { value: 'mastercard', label: 'بطاقة ماستركارد', imageUrl: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773173687/image-removebg-preview_55_irqbpx.png', details: '**** 1234' },
    { value: 'bank', label: 'تحويل بنكي', imageUrl: 'https://res.cloudinary.com/ddznxtb6f/image/upload/v1773173679/image-removebg-preview_54_ldpagc.png', details: 'مصرف الراجحي' },
];

export default function AddFundsDialog({ onClose, onConfirm }: AddFundsDialogProps) {
  const [amount, setAmount] = useState<number>(fundAmounts[1]);
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0].value);
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm(amount);
    toast({
        title: "تم إضافة الرصيد بنجاح!",
        description: `تمت إضافة ${new Intl.NumberFormat('ar-SA').format(amount)} ريال إلى محفظتك.`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-background">
        <DialogHeader>
          <DialogTitle>إضافة رصيد إلى محفظتك</DialogTitle>
          <DialogDescription>
            اختر المبلغ وطريقة الدفع لإضافة رصيد لمحفظتك الافتراضية.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          <div>
            <Label className="mb-3 block font-bold text-base">اختر المبلغ (SAR)</Label>
            <div className="grid grid-cols-2 gap-3">
              {fundAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={amount === amt ? 'default' : 'secondary'}
                  onClick={() => setAmount(amt)}
                  className="rounded-xl h-14 text-lg font-bold"
                >
                  {new Intl.NumberFormat('ar-SA').format(amt)}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-3 block font-bold text-base">اختر طريقة الدفع</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-3">
              {paymentMethods.map(method => {
                return (
                    <Label
                        key={method.value}
                        htmlFor={method.value}
                        className={cn(
                            "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
                            paymentMethod === method.value
                                ? 'border-primary bg-primary/10'
                                : 'bg-white border-zinc-200 hover:bg-zinc-50'
                        )}
                    >
                        <RadioGroupItem value={method.value} id={method.value} className="sr-only"/>
                        <Image src={method.imageUrl} alt={method.label} width={40} height={40} className="h-8 w-10 object-contain" />
                        <div className='flex-grow text-zinc-900'>
                            <p className="font-bold">{method.label}</p>
                            <p className="text-sm text-zinc-500">{method.details}</p>
                        </div>
                    </Label>
                )
              })}
            </RadioGroup>
          </div>
           {(paymentMethod === 'visa' || paymentMethod === 'mastercard') && (
            <div className="mt-4 space-y-3 p-4 bg-secondary/50 rounded-xl border border-border">
                <h3 className="font-bold text-foreground">محاكاة تفاصيل البطاقة</h3>
                <div>
                    <Label htmlFor="cardNumber" className="text-sm text-muted-foreground">رقم البطاقة</Label>
                    <Input id="cardNumber" defaultValue="4242 4242 4242 4242" className="mt-1 bg-background border-border text-foreground" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="expiryDate" className="text-sm text-muted-foreground">تاريخ الانتهاء</Label>
                        <Input id="expiryDate" defaultValue="12/28" className="mt-1 bg-background border-border text-foreground" readOnly />
                    </div>
                    <div>
                        <Label htmlFor="cvc" className="text-sm text-muted-foreground">CVV</Label>
                        <Input id="cvc" defaultValue="123" className="mt-1 bg-background border-border text-foreground" readOnly />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2">هذه مجرد محاكاة لأغراض العرض التوضيحي.</p>
            </div>
        )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto rounded-xl">إلغاء</Button>
          <Button onClick={handleConfirm} className="w-full sm:w-auto rounded-xl">
            <CircleDollarSign className="ml-2 h-4 w-4" />
            إضافة {new Intl.NumberFormat('ar-SA').format(amount)} ريال
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
