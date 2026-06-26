"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Heart,
  HelpCircle,
  Lightbulb,
  Sparkles,
  UserRoundCheck,
  X,
} from "lucide-react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { Avatar } from "@/components/Avatar";
import { Roulette } from "@/components/Roulette";
import { burst } from "@/lib/confetti";
import { cn } from "@/lib/utils";

type GameView =
  | "home"
  | "roulette"
  | "myth"
  | "alerts"
  | "decisions"
  | "help"
  | "facts";

interface GameMeta {
  id: Exclude<GameView, "home">;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
}

const games: GameMeta[] = [
  {
    id: "roulette",
    title: "Ruleta de desafios",
    subtitle: "Gira y responde preguntas por categoria.",
    icon: Sparkles,
    accent: "from-brand-blue to-brand-sky",
  },
  {
    id: "myth",
    title: "Mito o realidad",
    subtitle: "Detecta ideas falsas sobre adicciones.",
    icon: HelpCircle,
    accent: "from-violet-500 to-brand-blue",
  },
  {
    id: "alerts",
    title: "Senales de alerta",
    subtitle: "Reconoce cuando alguien puede necesitar ayuda.",
    icon: AlertTriangle,
    accent: "from-rose-500 to-orange-400",
  },
  {
    id: "decisions",
    title: "Decisiones saludables",
    subtitle: "Elige la respuesta mas cuidadosa.",
    icon: CheckCircle2,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: "help",
    title: "Salto preventivo",
    subtitle: "Corre, salta y responde para seguir.",
    icon: Heart,
    accent: "from-fuchsia-500 to-brand-blue",
  },
  {
    id: "facts",
    title: "Datos curiosos",
    subtitle: "Aprende consejos breves para cuidarte.",
    icon: Lightbulb,
    accent: "from-amber-400 to-orange-400",
  },
];

const myths = [
  {
    text: "La adiccion es solo falta de voluntad.",
    answer: false,
    detail:
      "Mito. Las adicciones involucran salud, emociones, contexto y redes de apoyo. Pedir ayuda es parte del cuidado.",
  },
  {
    text: "Hablar a tiempo con una persona de confianza puede prevenir riesgos.",
    answer: true,
    detail:
      "Realidad. Compartir lo que pasa y buscar acompanamiento ayuda a tomar mejores decisiones.",
  },
  {
    text: "Las apuestas y los videojuegos tambien pueden generar consumo problematico.",
    answer: true,
    detail:
      "Realidad. No todas las adicciones son a sustancias; algunas conductas tambien pueden volverse dificiles de controlar.",
  },
  {
    text: "Si una persona pide ayuda, significa que fracaso.",
    answer: false,
    detail:
      "Mito. Pedir ayuda es una decision valiente y saludable. Nadie tiene que atravesar un problema solo.",
  },
  {
    text: "El consumo problematico puede afectar vinculos, escuela, trabajo y salud.",
    answer: true,
    detail:
      "Realidad. Cuando una conducta empieza a ocupar demasiado lugar, puede impactar en distintas areas de la vida.",
  },
  {
    text: "Acompanar a alguien es escucharlo sin juzgar y acercarlo a una red de apoyo.",
    answer: true,
    detail:
      "Realidad. Escuchar, cuidar el trato y buscar adultos o profesionales de confianza puede marcar una diferencia.",
  },
  {
    text: "Las senales de alerta siempre son faciles de ver.",
    answer: false,
    detail:
      "Mito. A veces los cambios son graduales o se ocultan. Por eso es importante estar atentos y conversar a tiempo.",
  },
];

const alertOptions = [
  { text: "Aislarse de amigos o familia", correct: true },
  { text: "Perder interes en actividades que disfrutaba", correct: true },
  { text: "Mentir sobre consumos, apuestas o pantallas", correct: true },
  { text: "Estudiar mas para mejorar", correct: false },
  { text: "Tener cambios bruscos de animo", correct: true },
  { text: "Dormir bien y tener energia", correct: false },
];

const decisions = [
  {
    situation:
      "Un amigo te cuenta que esta apostando todos los dias y perdio mucha plata. Que harias?",
    options: [
      { text: "Burlarme de el", correct: false },
      { text: "Ignorarlo", correct: false },
      { text: "Escucharlo y sugerirle pedir ayuda", correct: true },
      { text: "Prestarle mas plata", correct: false },
    ],
  },
  {
    situation:
      "Alguien del curso esta consumiendo para encajar con el grupo. Como acompanarias?",
    options: [
      { text: "Presionarlo para que siga", correct: false },
      { text: "Hablar sin juzgar y ofrecer apoyo", correct: true },
      { text: "Exponerlo frente a todos", correct: false },
      { text: "Hacer como si nada pasara", correct: false },
    ],
  },
  {
    situation:
      "Una companera dice que no puede dejar de usar el celular de noche y llega agotada a clases. Que seria mas saludable?",
    options: [
      { text: "Decirle que exagere menos", correct: false },
      { text: "Sugerirle hablar con alguien de confianza y ordenar horarios", correct: true },
      { text: "Pasarle mas videos para distraerse", correct: false },
      { text: "Retarle frente al grupo", correct: false },
    ],
  },
  {
    situation:
      "En una juntada ofrecen alcohol a alguien que no quiere tomar. Como podes ayudar?",
    options: [
      { text: "Respetar su decision y no presionar", correct: true },
      { text: "Insistir para que pruebe un poco", correct: false },
      { text: "Grabarlo para hacer una broma", correct: false },
      { text: "Decir que queda mal si no toma", correct: false },
    ],
  },
  {
    situation:
      "Un amigo se enojo porque perdio dinero apostando online y quiere seguir para recuperarlo. Que conviene hacer?",
    options: [
      { text: "Animarlo a apostar mas fuerte", correct: false },
      { text: "Prestarle plata para que recupere", correct: false },
      { text: "Ayudarlo a frenar y buscar apoyo", correct: true },
      { text: "Compartirle otra pagina de apuestas", correct: false },
    ],
  },
];

const facts = [
  "Las adicciones no siempre son a sustancias: tambien pueden relacionarse con apuestas, pantallas o videojuegos.",
  "Dormir bien, hacer actividad fisica y hablar con alguien de confianza son factores de proteccion.",
  "Pedir ayuda temprano puede evitar que un problema crezca.",
  "Acompanar no es resolver todo: escuchar, orientar y buscar adultos de confianza tambien ayuda.",
  "La presion del grupo puede influir mucho: decir que no tambien es una forma de cuidarse.",
  "Tener rutinas, espacios de deporte y actividades compartidas ayuda a reducir riesgos.",
];

const runnerQuestions = [
  {
    prompt: "Un amigo se esta aislando y cambio mucho de animo. Que conviene hacer?",
    answers: [
      { text: "Escucharlo y avisar a un adulto de confianza", correct: true },
      { text: "Burlarse para que reaccione", correct: false },
      { text: "Ignorarlo porque se le pasa solo", correct: false },
    ],
  },
  {
    prompt: "Cual puede ser una senal de alerta?",
    answers: [
      { text: "Mentir sobre consumos, apuestas o pantallas", correct: true },
      { text: "Dormir bien y tener energia", correct: false },
      { text: "Pedir ayuda cuando algo preocupa", correct: false },
    ],
  },
  {
    prompt: "Que frase ayuda mas a acompanar?",
    answers: [
      { text: "No te juzgo, busquemos ayuda juntos", correct: true },
      { text: "Si queres parar, para y listo", correct: false },
      { text: "No le cuentes a nadie", correct: false },
    ],
  },
  {
    prompt: "Las adicciones pueden estar relacionadas con...",
    answers: [
      { text: "Sustancias, apuestas, pantallas o videojuegos", correct: true },
      { text: "Solamente alcohol y tabaco", correct: false },
      { text: "Unicamente falta de voluntad", correct: false },
    ],
  },
  {
    prompt: "Si alguien pide ayuda significa que...",
    answers: [
      { text: "Esta dando un paso importante para cuidarse", correct: true },
      { text: "Fracaso", correct: false },
      { text: "Ya no se puede hacer nada", correct: false },
    ],
  },
];

const runnerHazards = [
  { label: "Alcohol", icon: "!" },
  { label: "Apuestas", icon: "$" },
  { label: "Pantallas", icon: "#" },
  { label: "Tabaco", icon: "X" },
  { label: "Presion", icon: "?" },
];

const GATE_START_MS = 5600;
const GATE_TRAVEL_MS = 1600;
const GATE_START_LEFT = 112;
const GATE_END_LEFT = 6;
const RUNNER_MAX_QUESTIONS = 5;

function shuffleRunnerQuestions() {
  const items = [...runnerQuestions];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function AppHeader({
  title,
  onBack,
}: {
  title?: string;
  onBack?: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-14 w-14 touch-manipulation items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-navy shadow-md transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-extrabold uppercase tracking-wide text-brand-navy sm:text-2xl">
            {title}
          </h1>
        )}
      </div>
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur-sm sm:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}

function HomeView({
  onOpen,
}: {
  onOpen: (view: GameView) => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-7 pt-24 sm:px-6 sm:pt-28 lg:justify-center lg:pt-24">
      <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
        >
          <div className="grid min-h-[22rem] items-end gap-5 sm:grid-cols-[1fr_auto]">
            <div className="relative z-10 pb-1 sm:pb-4">
              <p className="mb-3 inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-bold text-brand-blue">
                Prevenir es cuidar
              </p>
              <h1 className="max-w-[11ch] font-display text-4xl font-extrabold leading-none tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
                Elegi cuidarte
              </h1>
              <p className="mt-5 max-w-[25rem] text-base font-semibold leading-relaxed text-slate-700">
                Juga, aprende y descubri herramientas para prevenir adicciones
                y acompanar a quienes lo necesitan.
              </p>
              <AnimatedButton
                size="lg"
                glow
                onClick={() => onOpen("roulette")}
                className="mt-7 bg-gradient-to-r from-brand-blue to-violet-600"
              >
                Comenzar
                <ArrowRight className="h-5 w-5" />
              </AnimatedButton>
            </div>

            <div className="pointer-events-none hidden self-end sm:block">
              <Avatar className="h-auto w-36 drop-shadow-lg md:w-40 lg:w-44" />
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.button
                key={game.id}
                type="button"
                onClick={() => onOpen(game.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025, duration: 0.18 }}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.95 }}
                className="group min-h-36 touch-manipulation rounded-2xl border border-white/70 bg-white/90 p-4 text-left shadow-lg transition active:scale-[0.98] sm:min-h-40"
              >
                <span
                  className={cn(
                    "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md",
                    game.accent
                  )}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="block text-sm font-extrabold leading-tight text-brand-navy sm:text-base">
                  {game.title}
                </span>
                <span className="mt-1 block text-xs font-semibold leading-snug text-muted-foreground">
                  {game.subtitle}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Screen({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-7 pt-24 sm:px-6 sm:pt-28">
      <AppHeader title={title} onBack={onBack} />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.18 }}
        className="flex flex-1 items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

function AnswerButton({
  label,
  icon: Icon,
  color,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  color: "success" | "danger";
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-20 touch-manipulation items-center justify-center gap-3 rounded-2xl text-xl font-extrabold text-white shadow-lg transition active:scale-[0.98]",
        color === "success" && "bg-emerald-500",
        color === "danger" && "bg-rose-500",
        selected && "ring-4 ring-brand-yellow"
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95">
        <Icon
          className={cn(
            "h-5 w-5",
            color === "success" ? "text-emerald-500" : "text-rose-500"
          )}
        />
      </span>
      {label}
    </button>
  );
}

function ResultBox({
  correct,
  detail,
  onNext,
  nextLabel = "Siguiente",
}: {
  correct: boolean;
  detail: string;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden"
    >
      <div
        className={cn(
          "mt-5 rounded-2xl p-4 text-center font-bold",
          correct ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
        )}
      >
        <p className="text-lg">{correct ? "Muy bien" : "Casi"}</p>
        <p className="mt-1 text-sm leading-relaxed">{detail}</p>
        <AnimatedButton
          size="lg"
          onClick={onNext}
          className="mt-4 bg-gradient-to-r from-brand-blue to-brand-sky"
        >
          {nextLabel}
          <ArrowRight className="h-5 w-5" />
        </AnimatedButton>
      </div>
    </motion.div>
  );
}

function MythGame({
  onBack,
}: {
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const item = myths[index];
  const answered = selected !== null;
  const isCorrect = selected === item.answer;
  const isLastMyth = index === myths.length - 1;

  const choose = (value: boolean) => {
    if (answered) return;
    setSelected(value);
    if (value === item.answer) {
      burst({ x: 0.48, y: 0.42 });
    }
  };

  return (
    <Screen title="Mito o realidad" onBack={onBack}>
      <Panel className="mx-auto max-w-4xl">
        <div className="grid items-center gap-5 md:grid-cols-[1fr_14rem]">
          <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-7 text-center shadow-inner">
            <p className="text-2xl font-extrabold leading-snug text-brand-navy sm:text-3xl">
              "{item.text}"
            </p>
          </div>
          <Avatar className="mx-auto h-52 w-52" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <AnswerButton
            color="danger"
            icon={X}
            label="Mito"
            selected={selected === false}
            disabled={answered}
            onClick={() => choose(false)}
          />
          <AnswerButton
            color="success"
            icon={Check}
            label="Realidad"
            selected={selected === true}
            disabled={answered}
            onClick={() => choose(true)}
          />
        </div>
        {answered && (
          <ResultBox
            correct={isCorrect}
            detail={item.detail}
            onNext={() => {
              if (isLastMyth) {
                onBack();
                return;
              }
              setSelected(null);
              setIndex((current) => current + 1);
            }}
            nextLabel={isLastMyth ? "Volver al inicio" : "Siguiente"}
          />
        )}
      </Panel>
    </Screen>
  );
}

function AlertsGame({
  onBack,
}: {
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const correctSelected = alertOptions.filter(
    (option, index) => option.correct === selected.includes(index)
  ).length;
  const allCorrect = correctSelected === alertOptions.length;

  const submit = () => {
    setSubmitted(true);
    if (allCorrect) {
      burst({ x: 0.5, y: 0.45 });
    }
  };

  return (
    <Screen title="Senales de alerta" onBack={onBack}>
      <Panel className="mx-auto max-w-2xl">
        <div className="mb-5 text-center">
          <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-extrabold text-emerald-700">
            Seleccion multiple
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-brand-navy">
            Cuales de estas situaciones pueden ser senales de alerta?
          </h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Selecciona todas las que correspondan.
          </p>
        </div>
        <div className="grid gap-2">
          {alertOptions.map((option, index) => {
            const checked = selected.includes(index);
            const state =
              !submitted
                ? "idle"
                : option.correct === checked
                  ? "correct"
                  : "wrong";
            return (
              <button
                key={option.text}
                type="button"
                disabled={submitted}
                onClick={() =>
                  setSelected((current) =>
                    current.includes(index)
                      ? current.filter((item) => item !== index)
                      : [...current, index]
                  )
                }
                className={cn(
                  "flex min-h-14 touch-manipulation items-center gap-3 rounded-2xl border p-3 text-left text-base font-bold transition active:scale-[0.99]",
                  state === "idle" && "border-slate-200 bg-white hover:bg-blue-50",
                  state === "correct" && "border-emerald-200 bg-emerald-50 text-emerald-800",
                  state === "wrong" && "border-rose-200 bg-rose-50 text-rose-800"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md border-2",
                    checked
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {checked && <Check className="h-4 w-4" />}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
        {!submitted ? (
          <AnimatedButton
            size="lg"
            onClick={submit}
            className="mt-5 w-full bg-gradient-to-r from-emerald-500 to-teal-500"
          >
            Ver resultado
          </AnimatedButton>
        ) : (
          <ResultBox
            correct={allCorrect}
            detail={
              allCorrect
                ? "Muy bien. Reconocer senales a tiempo permite acompanar mejor."
                : "Revisa las opciones marcadas. Aislamiento, cambios bruscos, mentiras o perdida de interes pueden ser alertas."
            }
            onNext={() => {
              setSubmitted(false);
              setSelected([]);
            }}
            nextLabel="Intentar de nuevo"
          />
        )}
      </Panel>
    </Screen>
  );
}

function DecisionsGame({
  onBack,
}: {
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const current = decisions[index];
  const answered = selected !== null;
  const correct = selected !== null && current.options[selected].correct;
  const isLastDecision = index + 1 >= decisions.length;

  const choose = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    if (current.options[optionIndex].correct) {
      burst({ x: 0.5, y: 0.45 });
    }
  };

  return (
    <Screen title="Decisiones saludables" onBack={onBack}>
      <Panel className="mx-auto max-w-5xl">
        <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-blue-50 p-5">
            <p className="text-lg font-extrabold leading-snug text-brand-navy">
              {current.situation}
            </p>
            <Avatar className="mx-auto mt-4 h-56 w-56" />
          </div>
          <div className="grid content-center gap-3">
            {current.options.map((option, optionIndex) => {
              const state =
                !answered
                  ? "idle"
                  : option.correct
                    ? "correct"
                    : selected === optionIndex
                      ? "wrong"
                      : "dimmed";
              return (
                <button
                  key={option.text}
                  type="button"
                  disabled={answered}
                  onClick={() => choose(optionIndex)}
                  className={cn(
                    "flex min-h-20 touch-manipulation items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left text-lg font-extrabold transition active:scale-[0.99]",
                    state === "idle" && "border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50",
                    state === "correct" && "border-emerald-300 bg-emerald-500 text-white",
                    state === "wrong" && "border-rose-300 bg-rose-50 text-rose-700",
                    state === "dimmed" && "border-transparent bg-slate-50 text-muted-foreground opacity-70"
                  )}
                >
                  <span>{option.text}</span>
                  {state === "correct" && <CheckCircle2 className="h-6 w-6" />}
                  {state === "wrong" && <X className="h-6 w-6" />}
                </button>
              );
            })}
          </div>
        </div>
        {answered && (
          <ResultBox
            correct={correct}
            detail={
              correct
                ? "Esa respuesta cuida: escucha, orienta y propone pedir ayuda."
                : "La opcion mas saludable es escuchar sin juzgar y sugerir apoyo."
            }
            onNext={() => {
              if (isLastDecision) {
                onBack();
                return;
              }
              setSelected(null);
              setIndex((currentIndex) => currentIndex + 1);
            }}
            nextLabel={isLastDecision ? "Volver al inicio" : "Siguiente"}
          />
        )}
      </Panel>
    </Screen>
  );
}

function HelpGame({
  onBack,
}: {
  onBack: () => void;
}) {
  const [status, setStatus] = useState<"ready" | "running" | "question" | "gameover">("ready");
  const [runMs, setRunMs] = useState(0);
  const [jumpY, setJumpY] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionSet, setQuestionSet] = useState(() => [...runnerQuestions]);
  const [streak, setStreak] = useState(0);
  const [gameOverReason, setGameOverReason] = useState<{
    type: "hazard" | "wrong-answer" | "completed";
    title: string;
    detail: string;
  } | null>(null);
  const velocityRef = useRef(0);
  const jumpRef = useRef(0);
  const lastQuestionRef = useRef(0);
  const lastHazardHitRef = useRef(-1);
  const currentQuestion = questionSet[questionIndex % questionSet.length];

  const startGame = () => {
    const mixedQuestions = shuffleRunnerQuestions();
    setStatus("running");
    setRunMs(0);
    setJumpY(0);
    setQuestionIndex(0);
    setQuestionSet(mixedQuestions);
    setStreak(0);
    setGameOverReason(null);
    velocityRef.current = 0;
    jumpRef.current = 0;
    lastQuestionRef.current = 0;
    lastHazardHitRef.current = -1;
  };

  const jump = () => {
    if (status !== "running" || jumpRef.current > 0) return;
    velocityRef.current = 20;
  };

  useEffect(() => {
    if (status !== "running") return;

    const interval = window.setInterval(() => {
      if (jumpRef.current > 0 || velocityRef.current > 0) {
          velocityRef.current -= 1.45;
        jumpRef.current = Math.max(0, jumpRef.current + velocityRef.current);
        setJumpY(jumpRef.current);
      }

      setRunMs((current) => {
        const next = current + 50;

        const hazardCycle = Math.floor(next / 3600);
        const hazardProgress = ((next % 3600) / 3600) * 118;
        const hazardLeft = 112 - hazardProgress;
        const hitHazard =
          hazardLeft <= 17 &&
          hazardLeft >= 11 &&
          jumpRef.current < 38 &&
          lastHazardHitRef.current !== hazardCycle;

        if (hitHazard) {
          lastHazardHitRef.current = hazardCycle;
          setGameOverReason({
            type: "hazard",
            title: "Te tropezaste con un riesgo",
            detail:
              "Para seguir, toca la pantalla y salta los riesgos antes de chocarlos.",
          });
          setStatus("gameover");
          return next;
        }

        const timeSinceQuestion = next - lastQuestionRef.current;
        if (timeSinceQuestion >= GATE_START_MS + GATE_TRAVEL_MS) {
          lastQuestionRef.current = next;
          setStatus("question");
        }
        return next;
      });
    }, 50);

    return () => window.clearInterval(interval);
  }, [status]);

  const answerRunnerQuestion = (correct: boolean) => {
    if (!correct) {
      const correctAnswer = currentQuestion.answers.find((answer) => answer.correct);
      setGameOverReason({
        type: "wrong-answer",
        title: "Respondiste mal",
        detail: `La respuesta correcta era: ${correctAnswer?.text ?? "la opcion de cuidado"}.`,
      });
      setStatus("gameover");
      return;
    }

    burst({ x: 0.52, y: 0.42 });
    const nextStreak = streak + 1;
    setStreak(nextStreak);

    if (nextStreak >= RUNNER_MAX_QUESTIONS) {
      setGameOverReason({
        type: "completed",
        title: "Recorrido completo",
        detail: "Respondiste las 5 situaciones y lograste llegar al final.",
      });
      setStatus("gameover");
      return;
    }

    setQuestionIndex((current) => current + 1);
    setStatus("running");
  };

  const obstacleProgress = ((runMs % 3600) / 3600) * 118;
  const obstacleLeft = `${112 - obstacleProgress}%`;
  const hazard = runnerHazards[Math.floor(runMs / 3600) % runnerHazards.length];
  const timeSinceQuestion = runMs - lastQuestionRef.current;
  const gateActive = status === "running" && timeSinceQuestion >= GATE_START_MS;
  const gateProgress = Math.min(
    1,
    Math.max(0, (timeSinceQuestion - GATE_START_MS) / GATE_TRAVEL_MS)
  );
  const gateLeft = `${GATE_START_LEFT - gateProgress * (GATE_START_LEFT - GATE_END_LEFT)}%`;

  return (
    <Screen title="Salto preventivo" onBack={onBack}>
      <Panel className="mx-auto w-full max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-brand-blue">
              Toca para saltar
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Salta los riesgos. Responde hasta 5 situaciones para completar el recorrido.
            </p>
          </div>
          <div className="flex gap-2 text-sm font-extrabold text-brand-navy">
            <span className="rounded-full bg-emerald-50 px-4 py-2">
              {streak}/{RUNNER_MAX_QUESTIONS}
            </span>
          </div>
        </div>

        <div
          onClick={status === "ready" || status === "gameover" ? startGame : jump}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            if (status === "ready" || status === "gameover") {
              startGame();
            } else {
              jump();
            }
          }}
          className="relative h-[19rem] w-full cursor-pointer touch-manipulation select-none overflow-hidden rounded-3xl border-2 border-white bg-gradient-to-b from-sky-100 via-cyan-50 to-emerald-50 text-left shadow-inner outline-none active:scale-[0.995] sm:h-[23rem] lg:h-[25rem]"
          aria-label="Area del juego"
        >
          <div className="absolute left-0 right-0 top-8 flex justify-around opacity-70">
            <span className="h-8 w-20 rounded-full bg-white/85" />
            <span className="mt-8 h-7 w-24 rounded-full bg-white/75" />
            <span className="h-9 w-28 rounded-full bg-white/80" />
          </div>

          <motion.div
            className="absolute bottom-16 left-5 z-20 flex h-24 w-24 items-end justify-center sm:bottom-20 sm:left-14 sm:h-32 sm:w-32"
            animate={{ y: -jumpY }}
            transition={{ type: "spring", stiffness: 520, damping: 24 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Personaje saltando"
              className="h-24 w-24 object-contain drop-shadow-xl sm:h-32 sm:w-32"
            />
          </motion.div>

          <div
            className="absolute bottom-16 z-10 flex h-20 w-20 flex-col items-center justify-end sm:bottom-20 sm:h-24 sm:w-24"
            style={{ left: obstacleLeft }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-2xl font-extrabold text-white shadow-lg ring-2 ring-white sm:h-16 sm:w-16 sm:rounded-2xl sm:text-3xl sm:ring-4">
              {hazard.icon}
            </div>
            <div className="mt-1 max-w-20 rounded-full bg-brand-navy px-2 py-0.5 text-center text-[10px] font-bold leading-tight text-white sm:mt-2 sm:px-3 sm:py-1 sm:text-xs">
              {hazard.label}
            </div>
          </div>

          {gateActive && (
            <div
              className="absolute bottom-14 z-30 flex h-32 w-20 flex-col items-center justify-end sm:bottom-16 sm:h-40 sm:w-28"
              style={{ left: gateLeft }}
            >
              <div className="flex h-24 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-violet-600 to-brand-blue text-center text-xs font-extrabold leading-tight text-white shadow-2xl ring-2 ring-white sm:h-28 sm:w-24 sm:rounded-3xl sm:text-sm sm:ring-4">
                Situacion<br />para pensar
              </div>
              <div className="h-7 w-16 rounded-t-xl bg-brand-navy sm:h-8 sm:w-20" />
            </div>
          )}

          <div className="absolute bottom-14 left-0 right-0 h-2 bg-brand-navy/80 sm:bottom-16 sm:h-3" />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-emerald-300 to-teal-300 sm:h-16" />

          {status === "ready" && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="mx-4 rounded-3xl bg-white p-5 text-center shadow-2xl sm:p-6">
                <p className="text-2xl font-extrabold text-brand-navy sm:text-3xl">
                  Salta y responde
                </p>
                <p className="mt-2 max-w-sm text-sm font-semibold text-muted-foreground">
                  Toca la pantalla para empezar. Salta los riesgos y responde cuando te frene una situacion.
                </p>
                <AnimatedButton
                  size="lg"
                  className="mt-5 bg-gradient-to-r from-brand-blue to-violet-600"
                  onClick={(event) => {
                    event.stopPropagation();
                    startGame();
                  }}
                >
                  Empezar
                  <ArrowRight className="h-5 w-5" />
                </AnimatedButton>
              </div>
            </div>
          )}

          {status === "question" && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-brand-navy/35 p-4 backdrop-blur-sm">
              <div className="w-full max-w-2xl rounded-3xl bg-white p-4 shadow-2xl sm:p-7">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 sm:h-14 sm:w-14">
                    <UserRoundCheck className="h-7 w-7 text-violet-700 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-wide text-violet-700">
                      La situacion te frena
                    </p>
                    <h2 className="text-lg font-extrabold leading-tight text-brand-navy sm:text-2xl">
                      {currentQuestion.prompt}
                    </h2>
                  </div>
                </div>
                <div className="grid gap-3">
                  {currentQuestion.answers.map((answer) => (
                    <button
                      key={answer.text}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        answerRunnerQuestion(answer.correct);
                      }}
                      className="min-h-14 touch-manipulation rounded-2xl border-2 border-blue-100 bg-blue-50 px-4 py-3 text-left text-base font-extrabold text-brand-navy transition active:scale-[0.99] sm:min-h-16 sm:text-lg"
                    >
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {status === "gameover" && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-white p-5 text-center shadow-2xl sm:p-6">
                <p className="text-2xl font-extrabold text-brand-navy sm:text-3xl">
                  {gameOverReason?.title ?? "Fin del recorrido"}
                </p>
                <p className="mt-2 max-w-md text-sm font-semibold text-muted-foreground">
                  {gameOverReason?.detail}
                </p>
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  Respuestas correctas: {streak}/{RUNNER_MAX_QUESTIONS}
                </p>
                <AnimatedButton
                  size="lg"
                  className="mt-5 bg-gradient-to-r from-brand-blue to-violet-600"
                  onClick={(event) => {
                    event.stopPropagation();
                    startGame();
                  }}
                >
                  Jugar de nuevo
                </AnimatedButton>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </Screen>
  );
}

function FactsGame({
  onBack,
}: {
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const fact = facts[index];

  return (
    <Screen title="Sabias que...?" onBack={onBack}>
      <Panel className="mx-auto max-w-4xl">
        <div className="grid items-center gap-5 md:grid-cols-[14rem_1fr]">
          <Avatar className="mx-auto h-56 w-56" />
          <div className="rounded-3xl bg-white p-7 shadow-inner">
            <Lightbulb className="mb-4 h-10 w-10 text-brand-yellow" />
            <p className="text-2xl font-extrabold leading-snug text-brand-navy">
              {fact}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setIndex((current) => (current - 1 + facts.length) % facts.length)
            }
            className="flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-white text-brand-blue shadow-md active:scale-95"
            aria-label="Dato anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {facts.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  dotIndex === index ? "bg-brand-blue" : "bg-slate-300"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setIndex((current) => (current + 1) % facts.length);
            }}
            className="flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-white text-brand-blue shadow-md active:scale-95"
            aria-label="Dato siguiente"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </Panel>
    </Screen>
  );
}

export function GameHub() {
  const [view, setView] = useState<GameView>("home");

  const goHome = () => setView("home");

  return (
    <AnimatePresence mode="wait">
      {view === "home" && (
        <motion.div key="home" exit={{ opacity: 0 }}>
          <HomeView onOpen={setView} />
        </motion.div>
      )}
      {view === "roulette" && (
        <motion.div key="roulette" exit={{ opacity: 0 }}>
          <Roulette onBack={goHome} />
        </motion.div>
      )}
      {view === "myth" && (
        <MythGame key="myth" onBack={goHome} />
      )}
      {view === "alerts" && (
        <AlertsGame key="alerts" onBack={goHome} />
      )}
      {view === "decisions" && (
        <DecisionsGame key="decisions" onBack={goHome} />
      )}
      {view === "help" && (
        <HelpGame key="help" onBack={goHome} />
      )}
      {view === "facts" && (
        <FactsGame key="facts" onBack={goHome} />
      )}
    </AnimatePresence>
  );
}
