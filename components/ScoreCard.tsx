"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, RotateCw } from "lucide-react";

import type { Category } from "@/types";
import { AnimatedButton } from "@/components/AnimatedButton";
import { celebrate } from "@/lib/confetti";

interface ScoreCardProps {
  score: number;
  total: number;
  category: Category | null;
  onHome: () => void;
  onSpinAgain: () => void;
}

interface ResultTier {
  emoji: string;
  title: string;
  message: string;
}

/** Elige medalla y mensaje motivador según el porcentaje de aciertos. */
function getTier(percent: number): ResultTier {
  if (percent === 100) {
    return {
      emoji: "🏆",
      title: "¡Perfecto!",
      message:
        "Respondiste todo correctamente. ¡Sos un gran ejemplo de prevención!",
    };
  }
  if (percent >= 75) {
    return {
      emoji: "🥇",
      title: "Excelente",
      message:
        "Conocer los riesgos es el primer paso para prevenir las adicciones.",
    };
  }
  if (percent >= 50) {
    return {
      emoji: "🥈",
      title: "¡Muy bien!",
      message: "Vas por buen camino. Seguí informándote para cuidarte mejor.",
    };
  }
  if (percent >= 25) {
    return {
      emoji: "🥉",
      title: "¡Buen intento!",
      message:
        "Cada pregunta es una oportunidad para aprender. ¡Probá de nuevo!",
    };
  }
  return {
    emoji: "🌱",
    title: "¡A seguir aprendiendo!",
    message:
      "Informarse es la mejor herramienta de prevención. ¡No te rindas!",
  };
}

export function ScoreCard({
  score,
  total,
  category,
  onHome,
  onSpinAgain,
}: ScoreCardProps) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const tier = useMemo(() => getTier(percent), [percent]);

  // Lluvia de confeti al mostrar el resultado.
  useEffect(() => {
    celebrate();
  }, []);

  // Geometría del anillo de progreso.
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
          className="mx-auto mb-2 text-7xl"
        >
          {tier.emoji}
        </motion.div>

        <h2 className="bg-gradient-to-r from-brand-blue to-brand-sky bg-clip-text text-3xl font-extrabold text-transparent">
          {tier.title}
        </h2>

        {category && (
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Categoría: {category.emoji} {category.name}
          </p>
        )}

        {/* Anillo de porcentaje. */}
        <div className="relative mx-auto my-6 h-44 w-44">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="14"
            />
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#score-grad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: circumference * (1 - percent / 100),
              }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1763E0" />
                <stop offset="100%" stopColor="#29A8E0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-foreground">
              {percent}%
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              {score} de {total}
            </span>
          </div>
        </div>

        <p className="mb-7 text-pretty text-base leading-relaxed text-muted-foreground">
          {tier.message}
        </p>

        <div className="flex flex-col gap-3">
          <AnimatedButton
            size="lg"
            glow
            onClick={onSpinAgain}
            className="w-full bg-gradient-to-r from-brand-blue to-brand-sky"
          >
            <RotateCw className="h-5 w-5" />
            Girar nuevamente
          </AnimatedButton>
          <AnimatedButton
            variant="outline"
            size="lg"
            onClick={onHome}
            className="w-full border-blue-200 bg-white"
          >
            <Home className="h-5 w-5" />
            Volver al inicio
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}
