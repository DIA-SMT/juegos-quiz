"use client";

import { motion } from "framer-motion";

import type { Category } from "@/types";
import { cn, readableTextColor } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  /** Tamaño de la insignia. */
  size?: "sm" | "lg";
  className?: string;
}

/** Píldora con el emoji y el nombre de la categoría, pintada con su gradiente. */
export function CategoryBadge({
  category,
  size = "sm",
  className,
}: CategoryBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-bold shadow-lg ring-1 ring-white/30",
        size === "sm" ? "px-4 py-1.5 text-sm" : "px-6 py-2.5 text-lg",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${category.colors.from}, ${category.colors.to})`,
        color: readableTextColor(category.colors.from),
      }}
    >
      <span aria-hidden className={size === "sm" ? "text-lg" : "text-2xl"}>
        {category.emoji}
      </span>
      {category.name}
    </motion.span>
  );
}
