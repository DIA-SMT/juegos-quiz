"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AnimatedButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** Agrega un halo de color suave alrededor del botón. */
  glow?: boolean;
}

/**
 * Botón reutilizable con micro-interacciones (Framer Motion):
 * crece al pasar el mouse y se hunde al presionar. Usa los estilos de
 * shadcn/ui a través de `buttonVariants`.
 */
export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ className, variant, size, glow = false, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 560, damping: 20 }}
      className={cn(
        buttonVariants({ variant, size }),
        "touch-manipulation",
        glow && "shadow-xl shadow-primary/40 hover:shadow-primary/50",
        className
      )}
      {...props}
    />
  );
});
AnimatedButton.displayName = "AnimatedButton";
