"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-2 text-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
