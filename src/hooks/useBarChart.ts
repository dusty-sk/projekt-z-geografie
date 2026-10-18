const fadeIn = {
  from: { opacity: 0, transform: "translateY(10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
  config: { mass: 1, tension: 280, friction: 22 },
} as const;

export function useBarChart() {
  return { fadeIn };
}
