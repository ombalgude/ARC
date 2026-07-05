export interface ExerciseMetadata {
  id: string;
  name: string;
  movementPattern: string;
  equipment: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  isCompound: boolean;
  fatigueScore: number;
  environment: "gym" | "home" | "both";
}

export interface GeneratedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  restSeconds: number;
  orderIndex: number;
}

export interface GeneratedDay {
  dayNumber: number;
  dayOfWeek: number;
  name: string;
  exercises: GeneratedExercise[];
}

export interface GeneratedWorkoutPlan {
  splitName: string;
  days: GeneratedDay[];
}

export interface WorkoutGeneratorInput {
  goals: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  workoutFrequency: number;
  environment: "home" | "gym";
  equipment: string[];
}

const EXERCISE_LIBRARY: ExerciseMetadata[] = [
  { id: "barbell-bench-press", name: "Barbell Bench Press", movementPattern: "horizontal_push", equipment: ["barbell"], difficulty: "intermediate", isCompound: true, fatigueScore: 7, environment: "gym" },
  { id: "dumbbell-bench-press", name: "Dumbbell Bench Press", movementPattern: "horizontal_push", equipment: ["dumbbell"], difficulty: "beginner", isCompound: true, fatigueScore: 6, environment: "both" },
  { id: "push-up", name: "Push-Up", movementPattern: "horizontal_push", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 3, environment: "both" },
  { id: "overhead-press", name: "Overhead Press", movementPattern: "vertical_push", equipment: ["barbell"], difficulty: "intermediate", isCompound: true, fatigueScore: 6, environment: "gym" },
  { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", movementPattern: "vertical_push", equipment: ["dumbbell"], difficulty: "beginner", isCompound: true, fatigueScore: 5, environment: "both" },
  { id: "elevated-pike-push-up", name: "Elevated Pike Push-Up", movementPattern: "vertical_push", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 3, environment: "both" },
  { id: "pike-push-up", name: "Pike Push-Up", movementPattern: "vertical_push", equipment: ["bodyweight"], difficulty: "intermediate", isCompound: true, fatigueScore: 3, environment: "both" },
  { id: "barbell-squat", name: "Barbell Squat", movementPattern: "squat", equipment: ["barbell"], difficulty: "intermediate", isCompound: true, fatigueScore: 9, environment: "gym" },
  { id: "goblet-squat", name: "Goblet Squat", movementPattern: "squat", equipment: ["dumbbell"], difficulty: "beginner", isCompound: true, fatigueScore: 5, environment: "both" },
  { id: "bodyweight-squat", name: "Bodyweight Squat", movementPattern: "squat", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 3, environment: "both" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", movementPattern: "hinge", equipment: ["barbell"], difficulty: "intermediate", isCompound: true, fatigueScore: 8, environment: "gym" },
  { id: "dumbbell-rdl", name: "Dumbbell RDL", movementPattern: "hinge", equipment: ["dumbbell"], difficulty: "beginner", isCompound: true, fatigueScore: 6, environment: "both" },
  { id: "hip-hinge", name: "Hip Hinge (Bodyweight)", movementPattern: "hinge", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 2, environment: "both" },
  { id: "pull-up", name: "Pull-Up", movementPattern: "vertical_pull", equipment: ["bodyweight"], difficulty: "intermediate", isCompound: true, fatigueScore: 6, environment: "both" },
  { id: "lat-pulldown", name: "Lat Pulldown", movementPattern: "vertical_pull", equipment: ["cable"], difficulty: "beginner", isCompound: true, fatigueScore: 5, environment: "gym" },
  { id: "doorframe-lat-isometric", name: "Doorframe Lat Isometric", movementPattern: "vertical_pull", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 2, environment: "both" },
  { id: "barbell-row", name: "Barbell Row", movementPattern: "horizontal_pull", equipment: ["barbell"], difficulty: "intermediate", isCompound: true, fatigueScore: 7, environment: "gym" },
  { id: "dumbbell-row", name: "Dumbbell Row", movementPattern: "horizontal_pull", equipment: ["dumbbell"], difficulty: "beginner", isCompound: true, fatigueScore: 5, environment: "both" },
  { id: "inverted-row", name: "Inverted Row", movementPattern: "horizontal_pull", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 4, environment: "both" },
  { id: "lateral-raise", name: "Lateral Raise", movementPattern: "shoulders", equipment: ["dumbbell"], difficulty: "beginner", isCompound: false, fatigueScore: 2, environment: "both" },
  { id: "band-lateral-raise", name: "Band Lateral Raise", movementPattern: "shoulders", equipment: ["resistance_band"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
  { id: "arm-circle", name: "Arm Circle", movementPattern: "shoulders", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
  { id: "face-pull", name: "Face Pull", movementPattern: "rear_delts", equipment: ["cable"], difficulty: "beginner", isCompound: false, fatigueScore: 2, environment: "gym" },
  { id: "band-pull-apart", name: "Band Pull-Apart", movementPattern: "rear_delts", equipment: ["resistance_band"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
  { id: "prone-y-raise", name: "Prone Y-Raise", movementPattern: "rear_delts", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
  { id: "bicep-curl", name: "Bicep Curl", movementPattern: "biceps", equipment: ["dumbbell"], difficulty: "beginner", isCompound: false, fatigueScore: 2, environment: "both" },
  { id: "barbell-curl", name: "Barbell Curl", movementPattern: "biceps", equipment: ["barbell"], difficulty: "beginner", isCompound: false, fatigueScore: 3, environment: "gym" },
  { id: "towel-curl-isometric", name: "Towel Curl Isometric", movementPattern: "biceps", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
  { id: "tricep-pushdown", name: "Tricep Pushdown", movementPattern: "triceps", equipment: ["cable"], difficulty: "beginner", isCompound: false, fatigueScore: 2, environment: "gym" },
  { id: "close-grip-push-up", name: "Close-Grip Push-Up", movementPattern: "triceps", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 2, environment: "both" },
  { id: "diamond-push-up", name: "Diamond Push-Up", movementPattern: "triceps", equipment: ["bodyweight"], difficulty: "intermediate", isCompound: false, fatigueScore: 3, environment: "both" },
  { id: "lunge", name: "Lunge", movementPattern: "single_leg", equipment: ["bodyweight"], difficulty: "beginner", isCompound: true, fatigueScore: 4, environment: "both" },
  { id: "dumbbell-lunge", name: "Dumbbell Lunge", movementPattern: "single_leg", equipment: ["dumbbell"], difficulty: "intermediate", isCompound: true, fatigueScore: 5, environment: "both" },
  { id: "calf-raise", name: "Calf Raise", movementPattern: "calves", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 2, environment: "both" },
  { id: "plank", name: "Plank", movementPattern: "core", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
  { id: "dead-bug", name: "Dead Bug", movementPattern: "core", equipment: ["bodyweight"], difficulty: "beginner", isCompound: false, fatigueScore: 1, environment: "both" },
];

const DAY_MOVEMENT_PATTERNS = {
  Push: ["horizontal_push", "vertical_push", "shoulders", "triceps"],
  Pull: ["horizontal_pull", "vertical_pull", "rear_delts", "biceps"],
  Legs: ["squat", "hinge", "single_leg", "calves"],
  Upper: ["horizontal_push", "horizontal_pull", "vertical_push", "biceps", "triceps"],
  Lower: ["squat", "hinge", "single_leg"],
  "Full Body": ["squat", "horizontal_push", "horizontal_pull", "hinge", "core"],
} as const;

const VOLUME_RULES = {
  beginner: { sets: 3, reps: "10–12" },
  intermediate: { sets: 4, reps: "8–12" },
  advanced: { sets: 4, reps: "6–10" },
} as const;

const EQUIPMENT_ALIASES: Record<string, string> = {
  bands: "resistance_band",
  cable: "cable",
  cables: "cable",
  dumbbell: "dumbbell",
  dumbbells: "dumbbell",
  kettlebells: "kettlebell",
  machine: "machine",
  machines: "machine",
  resistance_band: "resistance_band",
};

type DayType = keyof typeof DAY_MOVEMENT_PATTERNS;

/**
 * Generates a deterministic workout plan from movement-pattern requirements,
 * environment constraints, equipment availability, and experience level.
 */
export function generateWorkoutPlan(input: WorkoutGeneratorInput): GeneratedWorkoutPlan {
  const splitDays = getSplitDays(input.workoutFrequency);
  const splitName = deriveSplitName(splitDays);

  const dayDistribution: Record<number, number[]> = {
    1: [3],
    2: [2, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
    7: [1, 2, 3, 4, 5, 6, 0]
  };
  const targetDays = dayDistribution[input.workoutFrequency] || [1];

  const days = splitDays.map((dayName, index) => {
    const selectedExercises = DAY_MOVEMENT_PATTERNS[dayName].map((movementPattern) =>
      buildGeneratedExercise(
        selectExercise(movementPattern, input.environment, input.equipment, input.experienceLevel),
        input.experienceLevel,
      ));

    const orderedExercises = selectedExercises
      .sort((left, right) => {
        if (left.metadata.isCompound !== right.metadata.isCompound) {
          return left.metadata.isCompound ? -1 : 1;
        }
        return right.metadata.fatigueScore - left.metadata.fatigueScore;
      })
      .map((exercise, exerciseIndex) => ({
        exerciseId: exercise.metadata.id,
        exerciseName: exercise.metadata.name,
        sets: exercise.sets,
        reps: exercise.reps,
        restSeconds: exercise.restSeconds,
        orderIndex: exerciseIndex + 1,
      }));

    return {
      dayNumber: index + 1,
      dayOfWeek: targetDays[index] ?? 1,
      name: dayName,
      exercises: orderedExercises,
    };
  });

  return {
    splitName,
    days,
  };
}

function getSplitDays(workoutFrequency: number): DayType[] {
  if (workoutFrequency === 1) {
    return ["Full Body"];
  }

  if (workoutFrequency === 2) {
    return ["Full Body", "Full Body"];
  }

  if (workoutFrequency === 3) {
    return ["Full Body", "Full Body", "Full Body"];
  }

  if (workoutFrequency === 4) {
    return ["Upper", "Lower", "Upper", "Lower"];
  }

  if (workoutFrequency === 5) {
    return ["Push", "Pull", "Legs", "Upper", "Lower"];
  }

  if (workoutFrequency === 6) {
    return ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
  }

  return ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Full Body"];
}

function deriveSplitName(splitDays: DayType[]): string {
  if (splitDays.every((day) => day === "Full Body")) {
    return "Full Body";
  }

  if (splitDays.some((day) => day === "Upper" || day === "Lower")) {
    return "Upper/Lower";
  }

  return "Push/Pull/Legs";
}

function selectExercise(
  movementPattern: string,
  environment: WorkoutGeneratorInput["environment"],
  equipment: string[],
  experienceLevel: WorkoutGeneratorInput["experienceLevel"],
): ExerciseMetadata {
  const normalizedEquipment = normalizeEquipment(equipment);
  const allowedDifficulties = experienceLevel === "beginner"
    ? ["beginner"]
    : experienceLevel === "intermediate"
      ? ["beginner", "intermediate"]
      : ["beginner", "intermediate", "advanced"];

  const exercise = EXERCISE_LIBRARY.find((candidate) =>
    candidate.movementPattern === movementPattern
    && (candidate.environment === "both" || candidate.environment === environment)
    && (candidate.equipment.includes("bodyweight") || candidate.equipment.every((item) => normalizedEquipment.includes(item)))
    && allowedDifficulties.includes(candidate.difficulty));

  if (!exercise) {
    throw new Error(`No exercises found for movement pattern: ${movementPattern} with current equipment/environment`);
  }

  return exercise;
}

function normalizeEquipment(equipment: string[]): string[] {
  return equipment.map((item) => EQUIPMENT_ALIASES[item] ?? item);
}

function buildGeneratedExercise(
  metadata: ExerciseMetadata,
  experienceLevel: WorkoutGeneratorInput["experienceLevel"],
): {
  metadata: ExerciseMetadata;
  sets: number;
  reps: string;
  restSeconds: number;
} {
  const volume = VOLUME_RULES[experienceLevel];
  const restSeconds = metadata.isCompound && metadata.fatigueScore >= 6 ? 120 : 60;

  return {
    metadata,
    sets: volume.sets,
    reps: volume.reps,
    restSeconds,
  };
}
