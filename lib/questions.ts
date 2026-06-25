import type { Category, Question } from "@/types";
import { shuffle } from "@/lib/utils";

import categoriesData from "@/data/categories.json";
import tabaco from "@/data/tabaco.json";
import juego from "@/data/juego.json";
import alcohol from "@/data/alcohol.json";
import redes from "@/data/redes.json";
import drogas from "@/data/drogas.json";
import saludMental from "@/data/salud-mental.json";

/** Listado de categorías (segmentos de la ruleta). */
export const categories = categoriesData as Category[];

/**
 * Banco de preguntas indexado por id de categoría.
 *
 * Para agregar una temática nueva: creá `data/<id>.json`, agregá la categoría
 * en `categories.json` e incorporá la entrada acá. No hace falta tocar nada más.
 */
const questionBank: Record<string, Question[]> = {
  tabaco: tabaco as Question[],
  juego: juego as Question[],
  alcohol: alcohol as Question[],
  redes: redes as Question[],
  drogas: drogas as Question[],
  "salud-mental": saludMental as Question[],
};

/**
 * Cantidad fija de preguntas por partida.
 *
 * Se mantiene constante (y no aleatoria) para que el total que se ve durante
 * el juego coincida siempre con el del resultado final. Cambiá este número
 * para tener partidas más cortas o más largas.
 */
export const QUESTIONS_PER_GAME = 4;

/**
 * Mezcla las opciones de una pregunta y recalcula el índice de la correcta.
 *
 * Así la respuesta correcta cae en una posición distinta en cada partida y se
 * evita cualquier patrón ("siempre es la B"), sin depender de cómo esté
 * ordenado el JSON.
 */
function shuffleOptions(question: Question): Question {
  const correctText = question.respuestas[question.correcta];
  const respuestas = shuffle(question.respuestas);
  return {
    ...question,
    respuestas,
    correcta: respuestas.indexOf(correctText),
  };
}

/**
 * Devuelve un set de preguntas para una categoría (mezcladas, y con las
 * opciones de cada pregunta también mezcladas).
 *
 * Siempre devuelve {@link QUESTIONS_PER_GAME} preguntas (o menos solo si el
 * JSON tuviera menos cargadas).
 */
export function getQuestions(categoryId: string): Question[] {
  const pool = questionBank[categoryId] ?? [];
  const count = Math.min(QUESTIONS_PER_GAME, pool.length);
  return shuffle(pool).slice(0, count).map(shuffleOptions);
}

/** Busca una categoría por su id. */
export function getCategory(categoryId: string): Category | undefined {
  return categories.find((c) => c.id === categoryId);
}
