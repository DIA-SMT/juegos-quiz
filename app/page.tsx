import { GameHub } from "@/components/GameHub";

export default function Home() {
  return (
    <main className="app-background animate-gradient-shift relative min-h-dvh w-full overflow-x-hidden">
      {/* Manchas de color difuminadas para dar profundidad al fondo. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
        <div
          className="animate-float absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="animate-float absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-yellow-200/50 blur-3xl"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Logo institucional, arriba a la izquierda (visible en todas las vistas). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Logo_SMT_pos_1.png"
        alt="Municipalidad de San Miguel de Tucumán"
        className="absolute left-4 top-4 z-20 h-12 w-auto drop-shadow-sm sm:left-8 sm:top-6 sm:h-16"
      />

      <div className="relative z-10">
        <GameHub />
      </div>
    </main>
  );
}
