import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/ai/**",
        "src/lib/scoring/**",
        "src/lib/storage/**",
        "src/lib/validation/**",
        "src/lib/rate-limit.ts",
        "src/lib/charts/summaries.ts",
        "src/lib/constants/**",
        "src/hooks/**",
        "src/components/ErrorBoundary.tsx",
        "src/components/layout/PageHeader.tsx",
        "src/components/ui/GlassButton.tsx",
        "src/components/ui/GlassInput.tsx",
        "src/components/ui/GlassCard.tsx",
        "src/components/ui/MoodPicker.tsx",
      ],
      exclude: [
        "src/lib/demo/**",
        "src/lib/ai/seed-data.ts",
        "src/lib/charts/load-chart.tsx",
        "src/lib/charts/theme.ts",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
