# 🎯 Ruleta Educativa

Aplicación web interactiva para jornadas y eventos de **concientización y
prevención de adicciones**. Pensada para pantallas táctiles, tablets o
notebooks: girá la ruleta, te toca una categoría y respondés una mini-trivia
educativa.

Construida con **Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui +
Framer Motion**. Sin backend: todo el contenido vive en archivos JSON.

## ✨ Características

- Ruleta animada con aceleración, desaceleración realista y rebote al detenerse.
- Resalte y celebración (confeti) sobre el segmento ganador.
- Trivia de 3 a 5 preguntas por partida, con respuesta correcta, feedback
  inmediato y explicación educativa.
- Pantalla final con puntaje, porcentaje de aciertos y mensaje motivador.
- Diseño colorido, responsive y con muchos gradientes y animaciones suaves.

## 🚀 Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:3000
```

Para producción:

```bash
npm run build
npm start
```

## 🗂️ Estructura

```
app/                 # App Router (layout, page, estilos globales)
components/
  Roulette.tsx       # Orquestador / máquina de estados del juego
  RouletteWheel.tsx  # Ruleta SVG animada (Framer Motion)
  QuestionCard.tsx   # Tarjeta de pregunta con feedback y explicación
  ScoreCard.tsx      # Pantalla de puntaje final
  CategoryBadge.tsx  # Insignia de categoría
  AnimatedButton.tsx # Botón reutilizable con micro-interacciones
  ui/                # Primitivas estilo shadcn/ui (button, card)
data/                # Categorías y bancos de preguntas (JSON)
hooks/useRoulette.ts # Estado del juego
lib/                 # utils, carga de preguntas y confeti
types/               # Tipos compartidos
```

## ♻️ Reutilizar para otra temática

Toda la app se adapta cambiando **únicamente los JSON**:

1. Editá `data/categories.json` con tus categorías (`id`, `name`, `emoji`,
   `colors`, `description`).
2. Creá un `data/<id>.json` por categoría con sus preguntas. Cada pregunta:

   ```json
   {
     "categoria": "Tabaco",
     "pregunta": "¿El vapeador puede generar adicción?",
     "respuestas": ["Sí", "No", "Solo en menores", "Solo si tiene nicotina"],
     "correcta": 0,
     "explicacion": "Muchos vapeadores contienen nicotina..."
   }
   ```

3. Registrá el nuevo archivo en `lib/questions.ts` (objeto `questionBank`).

No hace falta tocar ningún componente. Las preguntas por partida se sortean al
azar (entre `MIN_QUESTIONS` y `MAX_QUESTIONS` en `lib/questions.ts`).
