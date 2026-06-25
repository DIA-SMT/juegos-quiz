interface LogoProps {
  className?: string;
}

/**
 * Isologo (recreado en SVG) inspirado en la marca de la Municipalidad de
 * San Miguel de Tucumán: dos hojas/personas en azul y celeste con un sol
 * amarillo. Hereda el tamaño de su contenedor vía `className`.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Municipalidad de San Miguel de Tucumán"
    >
      {/* Hoja izquierda (azul) */}
      <path
        d="M61 113C36 104 13 80 11 52 9 30 22 16 36 19c12 3 18 17 19 33 1 18-1 44 6 61Z"
        fill="#1763E0"
      />
      {/* Hoja derecha (celeste) */}
      <path
        d="M59 113c26-7 47-27 51-55 3-21-7-37-22-34-13 3-21 17-23 35-2 19 1 41-6 54Z"
        fill="#29A8E0"
      />
      {/* Brillo interno de la hoja derecha */}
      <path
        d="M70 104c14-9 25-25 27-44 1-12-2-22-9-24 4 5 5 14 4 24-2 19-11 35-22 44Z"
        fill="#7FD0F2"
        opacity="0.7"
      />
      {/* Sol / cabeza */}
      <circle cx="78" cy="24" r="13" fill="#FFC400" />
    </svg>
  );
}
