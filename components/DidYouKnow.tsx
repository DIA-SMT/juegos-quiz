"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";

interface DidYouKnowProps {
  /** Dato de concientización a mostrar. */
  text: string;
  className?: string;
}

/** Tarjeta informativa "¿Sabías qué?" con un dato de concientización. */
export function DidYouKnow({ text, className }: DidYouKnowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
      className={cn(
        "w-full rounded-2xl border border-brand-sky/30 bg-white/90 p-4 text-left shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-navy">
          <Lightbulb className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold text-brand-blue">
          ¿Sabías qué?
        </span>
      </div>
      <p className="text-sm leading-relaxed text-brand-navy/80">{text}</p>
    </motion.div>
  );
}
