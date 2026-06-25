"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Lightbulb, X } from "lucide-react";

import type { Category, Question } from "@/types";
import { AnimatedButton } from "@/components/AnimatedButton";
import { CategoryBadge } from "@/components/CategoryBadge";
import { burst } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  category: Category;
  /** Índice de la pregunta actual (0-based). */
  index: number;
  /** Total de preguntas de la partida. */
  total: number;
  /** Avanza a la siguiente pregunta (o al resultado final). */
  onNext: (wasCorrect: boolean) => void;
}

const optionLabels = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  category,
  index,
  total,
  onNext,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === question.correcta;

  const handleSelect = (option: number) => {
    if (answered) return;
    setSelected(option);
    if (option === question.correcta) {
      burst({ x: 0.5, y: 0.4 });
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Encabezado: categoría + progreso. */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <CategoryBadge category={category} />
        <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-muted-foreground shadow-sm">
          {index + 1} / {total}
        </span>
      </div>

      {/* Barra de progreso. */}
      <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundImage: `linear-gradient(90deg, ${category.colors.from}, ${category.colors.to})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-xl backdrop-blur-sm sm:p-8">
        <h2 className="mb-6 text-balance text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {question.pregunta}
        </h2>

        {/* Opciones. */}
        <div className="grid gap-3">
          {question.respuestas.map((respuesta, i) => {
            const isThisCorrect = i === question.correcta;
            const isThisSelected = i === selected;

            const state = !answered
              ? "idle"
              : isThisCorrect
                ? "correct"
                : isThisSelected
                  ? "wrong"
                  : "dimmed";

            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={answered}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={!answered ? { scale: 1.02 } : undefined}
                whileTap={!answered ? { scale: 0.98 } : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-4 text-left text-base font-semibold transition-colors",
                  state === "idle" &&
                    "border-blue-100 bg-white hover:border-blue-300 hover:bg-blue-50",
                  state === "correct" &&
                    "border-success bg-success/10 text-success",
                  state === "wrong" &&
                    "border-destructive bg-destructive/10 text-destructive",
                  state === "dimmed" &&
                    "border-transparent bg-muted/60 text-muted-foreground opacity-60"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                    state === "idle" && "bg-blue-100 text-blue-700",
                    state === "correct" && "bg-success text-white",
                    state === "wrong" && "bg-destructive text-white",
                    state === "dimmed" && "bg-muted text-muted-foreground"
                  )}
                >
                  {state === "correct" ? (
                    <Check className="h-5 w-5" />
                  ) : state === "wrong" ? (
                    <X className="h-5 w-5" />
                  ) : (
                    optionLabels[i]
                  )}
                </span>
                <span className="flex-1">{respuesta}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Explicación + botón siguiente. */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-5">
                <div
                  className={cn(
                    "rounded-2xl p-4 text-center text-lg font-extrabold",
                    isCorrect
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  )}
                >
                  {isCorrect ? "¡Correcto! 🎉" : "¡Casi! 💪"}
                </div>

                <div className="mt-3 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <Lightbulb className="h-6 w-6 shrink-0 text-amber-500" />
                  <p className="text-sm leading-relaxed text-amber-900">
                    {question.explicacion}
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <AnimatedButton
                    size="lg"
                    glow
                    onClick={() => onNext(isCorrect)}
                    className="bg-gradient-to-r from-brand-blue to-brand-sky"
                  >
                    {index + 1 >= total ? "Ver resultado" : "Siguiente"}
                    <ArrowRight className="h-5 w-5" />
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
