export const getPhaseColor = (phase) => {
  switch (phase) {
    case "phaseA":
      return "var(--phase-a-color)";
    case "phaseB":
      return "var(--phase-b-color)";
    case "phaseC":
      return "var(--phase-c-color)";
    default:
      return "white";
  }
};
