"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

const WavyBorder = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    className={className}
    viewBox="0 0 16 96"
    preserveAspectRatio="none"
  >
    <path
      strokeLinecap="round"
      strokeWidth="2"
      stroke="currentColor"
      fill="currentColor"
      d="M 8 0 Q 4 4.8, 8 9.6 T 8 19.2 Q 4 24, 8 28.8 T 8 38.4 Q 4 43.2, 8 48 T 8 57.6 Q 4 62.4, 8 67.2 T 8 76.8 Q 4 81.6, 8 86.4 T 8 96 L 0 96 L 0 0 Z"
    ></path>
  </svg>
)

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isDestructive = variant === 'destructive';
        const colorClass = isDestructive ? 'text-destructive' : 'text-primary';
        
        return (
          <Toast key={id} {...props} variant={variant} className="p-0 h-24 w-full max-w-sm rounded-xl shadow-lg bg-card border-none items-stretch justify-start space-x-0 pr-0">
            <div className="flex h-full w-full">
              <WavyBorder className={`h-full ${colorClass}`} />
              <div className="mx-2.5 overflow-hidden w-full py-1.5 flex-grow">
                {title && <ToastTitle className={`mt-1.5 text-xl font-bold leading-8 mr-3 overflow-hidden text-ellipsis whitespace-nowrap ${colorClass}`}>{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="overflow-hidden leading-5 break-all text-muted-foreground max-h-10 ml-3">
                    {description}
                  </ToastDescription>
                )}
              </div>
              <div className="w-16 flex-shrink-0 flex items-center justify-center">
                  <ToastClose className={`${colorClass} hover:bg-accent`}>
                      <X className="h-7 w-7" />
                  </ToastClose>
              </div>
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
