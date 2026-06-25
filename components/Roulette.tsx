"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useRoulette } from "@/hooks/useRoulette";
import { RouletteWheel } from "@/components/RouletteWheel";
import { QuestionCard } from "@/components/QuestionCard";
import { ScoreCard } from "@/components/ScoreCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DidYouKnow } from "@/components/DidYouKnow";
import { MascotTip } from "@/components/MascotTip";
import { burst } from "@/lib/confetti";

/** Cuánto dura la celebración antes de abrir el cuestionario (ms). */
const CELEBRATE_MS = 1700;

export function Roulette() {
  const game = useRoulette();
  const {
    phase,
    categories,
    targetIndex,
    spinKey,
    category,
    questions,
    currentIndex,
    score,
    spin,
    handleSpinComplete,
    startQuiz,
    answerNext,
    reset,
  } = game;

  // Al detenerse la ruleta: confeti y, tras un instante, abrir las preguntas.
  useEffect(() => {
    if (phase !== "celebrate") return;
    burst({ x: 0.5, y: 0.45 });
    const timer = setTimeout(startQuiz, CELEBRATE_MS);
    return () => clearTimeout(timer);
  }, [phase, startQuiz]);

  const isWheelView =
    phase === "idle" || phase === "spinning" || phase === "celebrate";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {isWheelView && (
          <motion.section
            key="wheel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex w-full flex-col items-center"
          >
            {/* Encabezado institucional + título. */}
            <div className="mb-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-balance font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl"
              >
                <span className="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-sky bg-clip-text text-transparent">
                  ¡Girá la ruleta y poné a prueba tus conocimientos!
                </span>
              </motion.h1>
              <p className="mt-3 text-base font-medium text-muted-foreground sm:text-lg">
                Prevención de adicciones y bienestar 💙
              </p>
            </div>

            {/* Ruleta centrada + mascota a la izquierda. */}
            <div className="relative flex w-full flex-col items-center">
              {/* Ruleta + estado debajo. */}
              <div className="flex w-full max-w-[30rem] flex-col items-center">
                <RouletteWheel
                  categories={categories}
                  spinKey={spinKey}
                  targetIndex={targetIndex}
                  winnerIndex={phase === "celebrate" ? targetIndex : null}
                  onSpinComplete={handleSpinComplete}
                  onSpin={spin}
                  spinDisabled={phase !== "idle"}
                />

                {/* Estado: invitación a girar / girando / categoría ganadora. */}
                <div className="mt-6 flex min-h-[3.75rem] items-center justify-center text-center">
                  <AnimatePresence mode="wait">
                    {phase === "celebrate" && category ? (
                      <motion.div
                        key="celebrate"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <CategoryBadge category={category} size="lg" />
                        <p className="animate-pulse text-sm font-semibold text-muted-foreground">
                          Preparando tus preguntas…
                        </p>
                      </motion.div>
                    ) : phase === "spinning" ? (
                      <motion.p
                        key="spinning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="animate-pulse text-lg font-bold text-brand-blue"
                      >
                        Girando…
                      </motion.p>
                    ) : (
                      <motion.p
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-base font-semibold text-brand-blue sm:text-lg"
                      >
                        👆 Tocá el centro para girar
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mascota a la izquierda (centrada vertical) en pantallas grandes. */}
              <div className="mt-8 flex w-full justify-center lg:absolute lg:left-0 lg:top-1/2 lg:mt-0 lg:w-[20rem] lg:-translate-y-1/2 lg:justify-start">
                <MascotTip />
              </div>

              {/* Datos "¿Sabías qué?" a la derecha (centrados vertical) en grandes. */}
              <div className="mt-6 flex w-full flex-col items-center gap-4 lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:w-[20rem] lg:-translate-y-1/2 lg:items-end">
                <DidYouKnow text="Las adicciones no siempre son sustancias: también pueden estar relacionadas con apuestas, pantallas o videojuegos." />
                <DidYouKnow text="Conocer cómo funcionan las adicciones ayuda a tomar mejores decisiones para cuidar tu salud y la de quienes te rodean." />
              </div>
            </div>
          </motion.section>
        )}

        {phase === "quiz" && category && questions.length > 0 && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            className="flex w-full justify-center"
          >
            {/* `key` reinicia la tarjeta (y su estado) en cada pregunta. */}
            <QuestionCard
              key={currentIndex}
              question={questions[currentIndex]}
              category={category}
              index={currentIndex}
              total={questions.length}
              onNext={answerNext}
            />
          </motion.section>
        )}

        {phase === "finished" && (
          <motion.section
            key="finished"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            className="flex w-full justify-center"
          >
            <ScoreCard
              score={score}
              total={questions.length}
              category={category}
              onHome={reset}
              onSpinAgain={spin}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
