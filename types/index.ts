/**
 * Tipos compartidos de la Ruleta Educativa.
 *
 * Toda la app se reutiliza para otras temáticas cambiando únicamente los
 * archivos JSON de `data/`. Estos tipos describen la forma de esos datos.
 */

/** Par de colores usado para construir los gradientes de cada categoría. */
export interface CategoryColors {
  /** Color inicial del gradiente (hex). */
  from: string;
  /** Color final del gradiente (hex). */
  to: string;
}

/** Una categoría = un segmento de la ruleta. */
export interface Category {
  /** Identificador único. Debe coincidir con el nombre del archivo en `data/`. */
  id: string;
  /** Nombre visible (ej: "Tabaco"). */
  name: string;
  /** Emoji representativo del segmento. */
  emoji: string;
  /** Colores del gradiente del segmento. */
  colors: CategoryColors;
  /** Frase corta que describe la categoría (se muestra en la celebración). */
  description: string;
}

/** Una pregunta de trivia con sus respuestas. */
export interface Question {
  /** Nombre de la categoría a la que pertenece. */
  categoria: string;
  /** Enunciado de la pregunta. */
  pregunta: string;
  /** Las 4 opciones de respuesta. */
  respuestas: string[];
  /** Índice (0-3) de la respuesta correcta dentro de `respuestas`. */
  correcta: number;
  /** Explicación educativa que se muestra tras responder. */
  explicacion: string;
}

/** Fases del juego (máquina de estados). */
export type GamePhase =
  | "idle" // mostrando la ruleta, lista para girar
  | "spinning" // la ruleta está girando
  | "celebrate" // se detuvo y resalta el ganador
  | "quiz" // respondiendo preguntas
  | "finished"; // pantalla de puntaje final
