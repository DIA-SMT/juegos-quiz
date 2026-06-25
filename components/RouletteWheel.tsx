"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

import type { Category } from "@/types";
import { readableTextColor } from "@/lib/utils";
import { Logo } from "@/components/Logo";

interface RouletteWheelProps {
  categories: Category[];
  /** Cambia en cada giro para disparar la animación. */
  spinKey: number;
  /** Segmento al que debe llegar la ruleta. */
  targetIndex: number | null;
  /** Segmento a resaltar (durante la celebración). null = sin resaltar. */
  winnerIndex: number | null;
  /** Se llama cuando termina de girar, con el índice ganador. */
  onSpinComplete: (index: number) => void;
  /** Se llama al tocar el botón central. */
  onSpin: () => void;
  /** Deshabilita el botón central (mientras gira o muestra el resultado). */
  spinDisabled: boolean;
}

// Geometría del SVG (coordenadas internas, escalan con el contenedor).
const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 168; // radio de los segmentos
const RING_R = 182; // radio del aro de luces
const LABEL_R = 110; // radio donde se ubican las etiquetas

/** Redondea a 3 decimales para evitar desajustes de hidratación SSR/cliente. */
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Punto sobre la circunferencia, medido en grados desde arriba (12 hs). */
function polar(angleFromTop: number, radius: number) {
  const a = ((angleFromTop - 90) * Math.PI) / 180;
  return { x: round(CX + radius * Math.cos(a)), y: round(CY + radius * Math.sin(a)) };
}

export function RouletteWheel({
  categories,
  spinKey,
  targetIndex,
  winnerIndex,
  onSpinComplete,
  onSpin,
  spinDisabled,
}: RouletteWheelProps) {
  const n = categories.length;
  const seg = 360 / n;
  const rotation = useMotionValue(0);

  // Dispara la animación de giro cada vez que cambia `spinKey`.
  useEffect(() => {
    if (spinKey === 0 || targetIndex === null) return;

    const centerAngle = targetIndex * seg + seg / 2;
    const current = rotation.get();
    const currentMod = ((current % 360) + 360) % 360;
    // Rotación (mod 360) que deja el centro del segmento bajo el puntero.
    const desiredMod = (((360 - centerAngle) % 360) + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta < 0) delta += 360;

    const spins = 3 + Math.floor(Math.random() * 2); // 3 a 4 vueltas completas: mas agil para totem
    const jitter = (Math.random() - 0.5) * seg * 0.55; // cae dentro del segmento
    const final = current + spins * 360 + delta + jitter;

    let active = true;

    const main = animate(rotation, final, {
      duration: 2.8,
      ease: [0.18, 0.72, 0.13, 1], // aceleración corta y desaceleración larga
    });

    const run = async () => {
      await main;
      if (!active) return;
      // Pequeño rebote al detenerse.
      await animate(rotation, [final, final - 3, final + 1.4, final], {
        duration: 0.24,
        ease: "easeInOut",
      });
      if (active) onSpinComplete(targetIndex);
    };
    run().catch(() => {
      /* animación interrumpida: ignorar */
    });

    return () => {
      active = false;
      main.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey]);

  return (
    <div className="relative aspect-square w-full max-w-[min(86vw,30rem)] touch-manipulation">
      {/* Puntero fijo en la parte superior. */}
      <div className="absolute -top-1 left-1/2 z-30 -translate-x-1/2 drop-shadow-lg">
        <svg width="42" height="54" viewBox="0 0 42 54" aria-hidden>
          <defs>
            <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e2ef" />
            </linearGradient>
          </defs>
          <path
            d="M21 52 L4 18 A20 20 0 0 1 38 18 Z"
            fill="url(#pointer-grad)"
            stroke="#1763E0"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="18" r="6" fill="#1763E0" />
        </svg>
      </div>

      {/* Rueda giratoria. */}
      <motion.div
        className="absolute inset-0"
        style={{ rotate: rotation }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full overflow-visible"
        >
          <defs>
            {categories.map((cat) => (
              <linearGradient
                key={cat.id}
                id={`grad-${cat.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={cat.colors.from} />
                <stop offset="100%" stopColor={cat.colors.to} />
              </linearGradient>
            ))}
            <filter id="winner-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="6"
                floodColor="#ffffff"
                floodOpacity="0.95"
              />
            </filter>
            <radialGradient id="wheel-shine" cx="0.5" cy="0.42" r="0.62">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
            </radialGradient>
          </defs>

          {/* Aro exterior. */}
          <circle
            cx={CX}
            cy={CY}
            r={RING_R}
            fill="none"
            stroke="#0F2C66"
            strokeWidth="14"
            opacity="0.95"
          />
          <circle
            cx={CX}
            cy={CY}
            r={RING_R}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Segmentos. */}
          {categories.map((cat, i) => {
            const start = i * seg;
            const end = (i + 1) * seg;
            const p1 = polar(start, R);
            const p2 = polar(end, R);
            const largeArc = seg > 180 ? 1 : 0;
            const d = `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
            const dimmed = winnerIndex !== null && winnerIndex !== i;
            return (
              <path
                key={cat.id}
                d={d}
                fill={`url(#grad-${cat.id})`}
                stroke="#ffffff"
                strokeWidth="2.5"
                style={{
                  opacity: dimmed ? 0.45 : 1,
                  transition: "opacity 0.4s ease",
                }}
              />
            );
          })}

          {/* Brillo general de la rueda. */}
          <circle cx={CX} cy={CY} r={R} fill="url(#wheel-shine)" />

          {/* Resalte del segmento ganador. */}
          {winnerIndex !== null &&
            (() => {
              const start = winnerIndex * seg;
              const end = (winnerIndex + 1) * seg;
              const p1 = polar(start, R);
              const p2 = polar(end, R);
              const largeArc = seg > 180 ? 1 : 0;
              const d = `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
              return (
                <motion.path
                  d={d}
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="4"
                  filter="url(#winner-glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.05, 0.4, 0.05] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
              );
            })()}

          {/* Etiquetas (emoji + nombre) radiales. */}
          {categories.map((cat, i) => {
            const centerAngle = i * seg + seg / 2;
            const words = cat.name.split(" ");
            const textColor = readableTextColor(cat.colors.from);
            const textShadow =
              textColor === "#ffffff"
                ? "0 1px 2px rgba(0,0,0,0.35)"
                : "0 1px 1px rgba(255,255,255,0.5)";
            return (
              <g
                key={`label-${cat.id}`}
                transform={`rotate(${centerAngle} ${CX} ${CY})`}
              >
                <text
                  x={CX}
                  y={CY - LABEL_R - 6}
                  textAnchor="middle"
                  fontSize="30"
                >
                  {cat.emoji}
                </text>
                {words.map((word, wi) => (
                  <text
                    key={word}
                    x={CX}
                    y={CY - LABEL_R + 16 + wi * 15}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={textColor}
                    style={{ textShadow }}
                  >
                    {word}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Luces del aro exterior. */}
          {Array.from({ length: n * 4 }).map((_, i) => {
            const angle = (360 / (n * 4)) * i;
            const p = polar(angle, RING_R);
            return (
              <circle
                key={`bulb-${i}`}
                cx={p.x}
                cy={p.y}
                r={i % 2 === 0 ? 3.4 : 2.4}
                fill={i % 2 === 0 ? "#FFC400" : "#ffffff"}
                opacity="0.95"
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Botón central: toca acá para girar. */}
      <div className="absolute left-1/2 top-1/2 z-20 h-[31%] w-[31%] -translate-x-1/2 -translate-y-1/2">
        {/* Pulso "sonar" para invitar a tocar (solo cuando se puede girar). */}
        {!spinDisabled && (
          <motion.span
            className="absolute inset-0 rounded-full bg-brand-sky/40"
            animate={{ scale: [1, 1.4], opacity: [0.55, 0] }}
            transition={{ duration: 1.05, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.button
          type="button"
          onClick={onSpin}
          disabled={spinDisabled}
          aria-label="Girar la ruleta"
          whileHover={spinDisabled ? undefined : { scale: 1.04 }}
          whileTap={spinDisabled ? undefined : { scale: 0.92 }}
          transition={{ type: "spring", stiffness: 520, damping: 18 }}
          className="absolute inset-0 flex touch-manipulation flex-col items-center justify-center gap-0.5 rounded-full bg-white shadow-[0_8px_24px_rgba(23,99,224,0.45)] ring-4 ring-brand-blue disabled:cursor-default"
        >
          <Logo className="h-[34%] w-[34%]" />
          <span className="text-[13px] font-extrabold leading-none tracking-wide text-brand-blue sm:text-sm">
            GIRAR
          </span>
        </motion.button>
      </div>
    </div>
  );
}
