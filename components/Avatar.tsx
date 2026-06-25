import Image from "next/image";

import { cn } from "@/lib/utils";

interface AvatarProps {
  className?: string;
}

/**
 * Mascota / personaje guía de la app. Usa la ilustración de `public/avatar.png`.
 * `object-contain` mantiene la proporción tanto en contenedores anchos
 * (hero) como cuadrados (pantallas de resultado).
 */
export function Avatar({ className }: AvatarProps) {
  return (
    <Image
      src="/avatar.png"
      alt="Personaje guía de la app"
      width={1536}
      height={1024}
      priority
      className={cn("object-contain", className)}
    />
  );
}
