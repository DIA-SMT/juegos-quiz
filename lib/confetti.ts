import confetti from "canvas-confetti";

/**
 * Pequeño estallido de confeti. Se usa, por ejemplo, al acertar una pregunta.
 * `origin` permite dispararlo desde un punto concreto de la pantalla
 * (coordenadas normalizadas 0–1).
 */
export function burst(origin: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    origin,
    scalar: 0.9,
    ticks: 160,
  });
}

/**
 * Celebración grande y prolongada para el final del juego.
 * Lanza varias tandas de confeti desde ambos costados.
 */
export function celebrate() {
  const duration = 1800;
  const end = Date.now() + duration;

  const colors = ["#1763E0", "#29A8E0", "#FFC400", "#0EA5E9", "#123C8A", "#7FD0F2"];

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  // Estallido inicial central + lluvia lateral.
  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    colors,
  });
  frame();
}
