export const CHART_COLORS = {
  primary: "#A855F7",
  primaryLight: "#C084FC",
  primaryDark: "#7C3AED",
  secondary: "#6366F1",
  accent: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  muted: "#9CA3AF",
  grid: "rgba(0,0,0,0.04)",
};

export const CHART_GRADIENT_ID = "chartPurpleGradient";

export const tooltipStyle = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: "16px",
  color: "#0F0F12",
  fontSize: "12px",
};

export const PIE_COLORS = ["#A855F7", "#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

export function formatChartDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatShortDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
