'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Project } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Wallet, Terminal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type InvestDialogProps = {
  project: Project;
  balance: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

const quickAmounts = [500, 1000, 2500, 5000];

export default function InvestDialog({ project, balance, onClose, onConfirm }: InvestDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleConfirm = () => {
    if (amount <= 0) {
      setError('الرجاء إدخال مبلغ صحيح للاستثمار.');
      return;
    }
    if (amount > balance) {
      setError('رصيدك غير كاف لإتمام هذا الاستثمار.');
      return;
    }
    onConfirm(amount);
    toast({
        title: "تم الاستثمار بنجاح!",
        description: `لقد استثمرت ${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount)} في مشروع "${project.name}".`,
    });
  };

  const handleAmountChange = (value: number) => {
    if (value > balance) {
        setAmount(balance);
    } else {
        setAmount(value);
    }
    setError('');
  }

  const formatNumber = (value: number) => new Intl.NumberFormat('ar-SA').format(value);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>الاستثمار في "{project.name}"</DialogTitle>
          <DialogDescription>
            اختر المبلغ الذي ترغب في استثماره في هذا المشروع.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="text-sm text-center bg-secondary/50 p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Wallet className="h-5 w-5"/>
                    <p>رصيدك المتاح</p>
                </div>
                 <div className="font-bold text-2xl text-primary mt-1 flex items-center justify-center gap-1">
                    <span>{formatNumber(balance)}</span>
                    <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={28} height={28} className="object-contain" />
                </div>
            </div>

            <div>
                <Label htmlFor="amount" className="mb-2 block text-center font-bold">
                    حدد مبلغ الاستثمار
                </Label>
                <div className="relative">
                     <Image src="https://res.cloudinary.com/ddznxtb6f/image/upload/v1772742156/image-removebg-preview_53_qkvpjg.png" alt="SAR" width={28} height={28} className="absolute left-3 top-1/2 -translate-y-1/2 object-contain" />
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => handleAmountChange(Number(e.target.value))}
                        className="col-span-3 text-center text-lg font-bold h-14 pl-12 rounded-xl"
                        placeholder="0"
                    />
                </div>
                <Slider
                    value={[amount]}
                    onValueChange={(value) => handleAmountChange(value[0])}
                    max={balance > 0 ? balance : 100000}
                    step={100}
                    className="mt-4"
                />
            </div>
          
            <div>
                 <Label className="mb-2 block text-center font-bold text-sm">
                    أو اختر مبلغًا سريعًا
                </Label>
                <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map(quickAmount => (
                        <Button
                            key={quickAmount}
                            variant={amount === quickAmount ? "default" : "secondary"}
                            onClick={() => handleAmountChange(quickAmount)}
                            disabled={quickAmount > balance}
                            className="rounded-lg h-12 font-bold text-sm"
                        >
                            {formatNumber(quickAmount)}
                        </Button>
                    ))}
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="rounded-xl">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="w-full rounded-xl">إلغاء</Button>
          <Button onClick={handleConfirm} className="w-full rounded-xl">
            تأكيد الاستثمار
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
