interface AvatarProps {
  className?: string;
}

/**
 * Mascota ilustrada (SVG) en estilo flat, con la paleta municipal.
 * Saluda con la mano abierta (gesto amistoso), pensada para ubicarse a un
 * costado de la ruleta.
 */
export function Avatar({ className }: AvatarProps) {
  return (
    <svg
      viewBox="0 0 220 250"
      className={className}
      role="img"
      aria-label="Personaje guía de la ruleta"
    >
      {/* Sombra */}
      <ellipse cx="106" cy="243" rx="60" ry="8" fill="#1763E0" opacity="0.12" />

      {/* Cuerpo / buzo */}
      <path
        d="M44 250C44 200 68 180 106 180C144 180 168 200 168 250Z"
        fill="#1763E0"
      />
      <path
        d="M106 180C144 180 168 200 168 250H126C126 214 118 192 106 180Z"
        fill="#1457C6"
      />
      {/* Cuello del buzo */}
      <path
        d="M88 182C94 194 118 194 124 182L118 206C114 212 98 212 94 206Z"
        fill="#1457C6"
      />

      {/* Brazo izquierdo relajado (manga) */}
      <path
        d="M60 206C46 198 44 182 50 196"
        stroke="#1763E0"
        strokeWidth="24"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cuello */}
      <rect x="94" y="160" width="24" height="28" rx="11" fill="#E8AE84" />

      {/* Orejas */}
      <circle cx="66" cy="128" r="8" fill="#F2C8A0" />
      <circle cx="146" cy="128" r="8" fill="#F2C8A0" />

      {/* Cabeza */}
      <circle cx="106" cy="124" r="42" fill="#F2C8A0" />

      {/* Pelo */}
      <path
        d="M64 126C64 92 82 68 106 68C130 68 148 92 148 126C148 116 140 102 121 102C121 102 117 92 106 92C95 92 91 102 91 102C72 102 64 116 64 126Z"
        fill="#27324A"
      />

      {/* Cachetes */}
      <circle cx="84" cy="138" r="6" fill="#F4A988" opacity="0.55" />
      <circle cx="128" cy="138" r="6" fill="#F4A988" opacity="0.55" />

      {/* Cejas */}
      <path
        d="M86 116Q92 112 98 115"
        stroke="#27324A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M114 115Q120 112 126 116"
        stroke="#27324A"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Ojos */}
      <circle cx="92" cy="124" r="4.5" fill="#27324A" />
      <circle cx="120" cy="124" r="4.5" fill="#27324A" />
      <circle cx="93.5" cy="122.5" r="1.4" fill="#ffffff" />
      <circle cx="121.5" cy="122.5" r="1.4" fill="#ffffff" />

      {/* Sonrisa */}
      <path
        d="M92 140Q106 154 120 140"
        stroke="#27324A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Brazo derecho levantado saludando (manga del buzo) */}
      <path
        d="M152 206C180 200 198 164 200 132"
        stroke="#1763E0"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
      />

      {/* Mano abierta (saludo) */}
      <g fill="#F2C8A0">
        {/* dedos */}
        <rect
          x="194"
          y="100"
          width="8"
          height="28"
          rx="4"
          transform="rotate(-22 198 124)"
        />
        <rect
          x="194"
          y="98"
          width="8"
          height="30"
          rx="4"
          transform="rotate(-8 198 124)"
        />
        <rect
          x="194"
          y="98"
          width="8"
          height="30"
          rx="4"
          transform="rotate(6 198 124)"
        />
        <rect
          x="194"
          y="100"
          width="8"
          height="28"
          rx="4"
          transform="rotate(20 198 124)"
        />
        {/* pulgar */}
        <rect
          x="194"
          y="116"
          width="8"
          height="22"
          rx="4"
          transform="rotate(-66 198 124)"
        />
        {/* palma (tapa la base de los dedos) */}
        <circle cx="198" cy="126" r="14" />
      </g>
    </svg>
  );
}
