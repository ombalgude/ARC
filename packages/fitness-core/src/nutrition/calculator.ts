export interface NutritionCalculatorInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "male" | "female" | "other";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose_fat" | "maintain" | "build_muscle";
}

export interface NutritionCalculatorResult {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  bmr: number;
  tdee: number;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
} as const;

const GOAL_MULTIPLIERS = {
  lose_fat: 0.82,
  maintain: 1,
  build_muscle: 1.12,
} as const;

const PROTEIN_MULTIPLIERS = {
  lose_fat: 2.2,
  maintain: 2,
  build_muscle: 2,
} as const;

const FAT_PERCENTAGES = {
  lose_fat: 0.25,
  maintain: 0.25,
  build_muscle: 0.3,
} as const;

/**
 * Calculates deterministic calorie and macro targets using Mifflin-St Jeor,
 * activity multipliers, goal adjustments, and safety floors.
 */
export function calculateMacros(input: NutritionCalculatorInput): NutritionCalculatorResult {
  const { weightKg, heightCm, age, gender, activityLevel, goal } = input;

  const maleBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  const femaleBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

  const rawBmr = gender === "male"
    ? maleBmr
    : gender === "female"
      ? femaleBmr
      : (maleBmr + femaleBmr) / 2;

  const bmr = Math.round(rawBmr);
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
  const adjustedCalories = Math.round(tdee * GOAL_MULTIPLIERS[goal]);
  const safetyFloor = gender === "male" ? 1500 : 1200;
  const calories = Math.max(adjustedCalories, safetyFloor);

  const proteinGrams = Math.round(weightKg * PROTEIN_MULTIPLIERS[goal]);
  const fatGrams = Math.round((calories * FAT_PERCENTAGES[goal]) / 9);
  const carbsGrams = Math.round((calories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

  return {
    calories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    bmr,
    tdee,
  };
}
