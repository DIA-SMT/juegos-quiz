"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

interface MascotTipProps {
  className?: string;
}

const MESSAGE = "Cada desafío te ayuda a aprender y sumar puntos 💙";

/**
 * Mascota guía.
 *
 * Usa la ilustración `public/avatar.png` si está disponible. Si el archivo no
 * existe, cae automáticamente en el avatar dibujado (SVG) con un globo de
 * diálogo, para que siempre se vea algo en su lugar.
 */
export function MascotTip({ className }: MascotTipProps) {
  const [useImage, setUseImage] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 }}
      className={cn("shrink-0", className)}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/avatar.png"
          alt={MESSAGE}
          className="h-auto w-[300px] max-w-full drop-shadow-md sm:w-[340px]"
          onError={() => setUseImage(false)}
        />
      ) : (
        // Fallback: avatar dibujado + globo de diálogo.
        <div className="flex items-end gap-2">
          <Avatar className="h-32 w-32 shrink-0 drop-shadow-md sm:h-40 sm:w-40" />
          <div className="relative mb-3 max-w-[14rem] rounded-2xl rounded-bl-sm border border-brand-sky/30 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
            <span className="absolute -left-1.5 bottom-3 h-3 w-3 rotate-45 border-b border-l border-brand-sky/30 bg-white/95" />
            <p className="text-sm font-semibold leading-snug text-brand-navy">
              {MESSAGE}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
