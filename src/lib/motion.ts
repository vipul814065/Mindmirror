export const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export const springSoft = { type: "spring" as const, stiffness: 260, damping: 28 };

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const hoverLift = {
  whileHover: { y: -2, transition: spring },
};
