import { NutritionGoal } from "@arc/types";

/**
 * Deterministic formula-driven nutrition macros calculator.
 * Core business rules are backend-controlled (not AI controlled).
 */
export function calculateMacros(
  weightKg: number,
  goal: "lose_fat" | "maintain" | "build_muscle",
): NutritionGoal {
  let multiplier = 30;
  if (goal === "lose_fat") multiplier = 26;
  if (goal === "build_muscle") multiplier = 35;

  const calories = Math.round(weightKg * multiplier);
  const proteinGrams = Math.round(weightKg * 2.2); // 2.2g per kg
  const fatGrams = Math.round((calories * 0.25) / 9); // 25% fat calories
  const carbsGrams = Math.round((calories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  return {
    calories,
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}
