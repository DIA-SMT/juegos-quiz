"use client";

import { useCallback, useState } from "react";

import type { Category, GamePhase, Question } from "@/types";
import { categories, getQuestions } from "@/lib/questions";

export interface RouletteState {
  /** Fase actual del juego. */
  phase: GamePhase;
  /** Lista de categorías (segmentos de la ruleta). */
  categories: Category[];
  /** Índice del segmento ganador (o null si aún no giró). */
  targetIndex: number | null;
  /** Cambia en cada giro: la rueda escucha esto para animar. */
  spinKey: number;
  /** Categoría que tocó al detenerse la ruleta. */
  category: Category | null;
  /** Preguntas sorteadas para la partida actual. */
  questions: Question[];
  /** Índice de la pregunta que se está respondiendo. */
  currentIndex: number;
  /** Respuestas correctas acumuladas. */
  score: number;
}

export interface RouletteActions {
  /** Inicia un giro: elige un ganador al azar y arranca la animación. */
  spin: () => void;
  /** La rueda terminó de girar; sortea las preguntas y resalta el ganador. */
  handleSpinComplete: (index: number) => void;
  /** Termina la celebración y abre el cuestionario. */
  startQuiz: () => void;
  /** Registra la respuesta y avanza (o finaliza la partida). */
  answerNext: (wasCorrect: boolean) => void;
  /** Vuelve al inicio (muestra la ruleta lista para girar). */
  reset: () => void;
}

/**
 * Hook que maneja toda la máquina de estados del juego:
 * idle → spinning → celebrate → quiz → finished.
 */
export function useRoulette(): RouletteState & RouletteActions {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [spinKey, setSpinKey] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const spin = useCallback(() => {
    // Cada setState es independiente y puro (React los agrupa en un único
    // render). El botón "Girar" se deshabilita mientras gira, así que no hace
    // falta proteger contra giros superpuestos dentro de un updater.
    setTargetIndex(Math.floor(Math.random() * categories.length));
    setCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSpinKey((k) => k + 1);
    setPhase("spinning");
  }, []);

  const handleSpinComplete = useCallback((index: number) => {
    const cat = categories[index];
    setCategory(cat);
    setQuestions(getQuestions(cat.id));
    setPhase("celebrate");
  }, []);

  const startQuiz = useCallback(() => {
    setPhase("quiz");
  }, []);

  const answerNext = useCallback(
    (wasCorrect: boolean) => {
      if (wasCorrect) setScore((s) => s + 1);
      // Cálculo puro fuera de los updaters (sin efectos secundarios anidados).
      const isLastQuestion = currentIndex + 1 >= questions.length;
      if (isLastQuestion) {
        setPhase("finished");
      } else {
        setCurrentIndex((index) => index + 1);
      }
    },
    [currentIndex, questions.length]
  );

  const reset = useCallback(() => {
    setPhase("idle");
    setTargetIndex(null);
    setCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
  }, []);

  return {
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
  };
}
