"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWorkoutPlan = generateWorkoutPlan;
var EXERCISE_LIBRARY = [
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
var DAY_MOVEMENT_PATTERNS = {
    Push: ["horizontal_push", "vertical_push", "shoulders", "triceps"],
    Pull: ["horizontal_pull", "vertical_pull", "rear_delts", "biceps"],
    Legs: ["squat", "hinge", "single_leg", "calves"],
    Upper: ["horizontal_push", "horizontal_pull", "vertical_push", "biceps", "triceps"],
    Lower: ["squat", "hinge", "single_leg"],
    "Full Body": ["squat", "horizontal_push", "horizontal_pull", "hinge", "core"],
};
var VOLUME_RULES = {
    beginner: { sets: 3, reps: "10–12" },
    intermediate: { sets: 4, reps: "8–12" },
    advanced: { sets: 4, reps: "6–10" },
};
var EQUIPMENT_ALIASES = {
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
/**
 * Generates a deterministic workout plan from movement-pattern requirements,
 * environment constraints, equipment availability, and experience level.
 */
function generateWorkoutPlan(input) {
    var splitDays = getSplitDays(input.workoutFrequency);
    var splitName = deriveSplitName(splitDays);
    var days = splitDays.map(function (dayName, index) {
        var selectedExercises = DAY_MOVEMENT_PATTERNS[dayName].map(function (movementPattern) {
            return buildGeneratedExercise(selectExercise(movementPattern, input.environment, input.equipment, input.experienceLevel), input.experienceLevel);
        });
        var orderedExercises = selectedExercises
            .sort(function (left, right) {
            if (left.metadata.isCompound !== right.metadata.isCompound) {
                return left.metadata.isCompound ? -1 : 1;
            }
            return right.metadata.fatigueScore - left.metadata.fatigueScore;
        })
            .map(function (exercise, exerciseIndex) { return ({
            exerciseId: exercise.metadata.id,
            exerciseName: exercise.metadata.name,
            sets: exercise.sets,
            reps: exercise.reps,
            restSeconds: exercise.restSeconds,
            orderIndex: exerciseIndex + 1,
        }); });
        return {
            dayNumber: index + 1,
            dayOfWeek: index,
            name: dayName,
            exercises: orderedExercises,
        };
    });
    return {
        splitName: splitName,
        days: days,
    };
}
function getSplitDays(workoutFrequency) {
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
function deriveSplitName(splitDays) {
    if (splitDays.every(function (day) { return day === "Full Body"; })) {
        return "Full Body";
    }
    if (splitDays.some(function (day) { return day === "Upper" || day === "Lower"; })) {
        return "Upper/Lower";
    }
    return "Push/Pull/Legs";
}
function selectExercise(movementPattern, environment, equipment, experienceLevel) {
    var normalizedEquipment = normalizeEquipment(equipment);
    var allowedDifficulties = experienceLevel === "beginner"
        ? ["beginner"]
        : experienceLevel === "intermediate"
            ? ["beginner", "intermediate"]
            : ["beginner", "intermediate", "advanced"];
    var exercise = EXERCISE_LIBRARY.find(function (candidate) {
        return candidate.movementPattern === movementPattern
            && (candidate.environment === "both" || candidate.environment === environment)
            && (candidate.equipment.includes("bodyweight") || candidate.equipment.some(function (item) { return normalizedEquipment.includes(item); }))
            && allowedDifficulties.includes(candidate.difficulty);
    });
    if (!exercise) {
        throw new Error("No exercises found for movement pattern: ".concat(movementPattern, " with current equipment/environment"));
    }
    return exercise;
}
function normalizeEquipment(equipment) {
    return equipment.map(function (item) { var _a; return (_a = EQUIPMENT_ALIASES[item]) !== null && _a !== void 0 ? _a : item; });
}
function buildGeneratedExercise(metadata, experienceLevel) {
    var volume = VOLUME_RULES[experienceLevel];
    var restSeconds = metadata.isCompound && metadata.fatigueScore >= 6 ? 120 : 60;
    return {
        metadata: metadata,
        sets: volume.sets,
        reps: volume.reps,
        restSeconds: restSeconds,
    };
}
