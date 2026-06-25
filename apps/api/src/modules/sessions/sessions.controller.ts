import type { ApiResponse } from "@arc/types";
import { db, workoutRepository } from "@arc/database";
import { logSessionSchema } from "@arc/validations";
import type { Request, Response } from "express";

type WorkoutDayResult = NonNullable<
  Awaited<ReturnType<typeof workoutRepository.findDayWithExercisesByUser>>
>;

interface SessionResult {
  session: Awaited<ReturnType<typeof workoutRepository.createSession>>;
  exerciseLogCount: number;
}

export async function handleGetWorkoutDay(
  req: Request<{ dayId: string }>,
  res: Response<ApiResponse<WorkoutDayResult>>,
): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const day = await workoutRepository.findDayWithExercisesByUser(
      req.dbUser.id,
      req.params.dayId,
    );

    if (!day) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Workout day not found" },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...day,
        exercises: day.exercises.map((exercise) => ({
          ...exercise,
          exerciseName: formatExerciseName(exercise.exerciseId),
        })),
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to fetch workout day" },
    });
  }
}

export async function handleLogSession(
  req: Request,
  res: Response<ApiResponse<SessionResult>>,
): Promise<void> {
  const parsedBody = logSessionSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsedBody.error.issues.map((issue) => issue.message).join("; "),
      },
    });
    return;
  }

  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const day = await workoutRepository.findDayWithExercisesByUser(
      req.dbUser.id,
      parsedBody.data.workoutDayId,
    );

    if (!day) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Workout day not found" },
      });
      return;
    }

    const plannedExercises = new Map(
      day.exercises.map((exercise) => [exercise.exerciseId, exercise]),
    );

    for (const exercise of parsedBody.data.exercises) {
      const plannedExercise = plannedExercises.get(exercise.exerciseId);

      if (!plannedExercise) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `Exercise ${exercise.exerciseId} is not part of this workout day`,
          },
        });
        return;
      }

      if (plannedExercise.sets !== null && exercise.completedSets > plannedExercise.sets) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `Exercise ${exercise.exerciseId} exceeds planned set count`,
          },
        });
        return;
      }
    }

    const startedAt = new Date(parsedBody.data.startedAt);
    const completedAt = new Date(parsedBody.data.completedAt);
    const durationMinutes = Math.max(
      0,
      Math.round((completedAt.getTime() - startedAt.getTime()) / 60000),
    );
    const exerciseNotes = parsedBody.data.exercises
      .filter((exercise) => exercise.notes)
      .map((exercise) => `${exercise.exerciseId}: ${exercise.notes}`)
      .join("\n");

    const result = await db.transaction(async (tx) => {
      const session = await workoutRepository.createSession(
        {
          userId: req.dbUser!.id,
          workoutPlanId: day.workoutPlanId,
          workoutDayId: day.id,
          startedAt,
          completedAt,
          durationMinutes,
          notes: exerciseNotes || null,
        },
        tx,
      );

      let exerciseLogCount = 0;

      for (const exercise of parsedBody.data.exercises) {
        for (let setNumber = 1; setNumber <= exercise.completedSets; setNumber += 1) {
          await workoutRepository.logExercise(
            {
              sessionId: session.id,
              exerciseId: exercise.exerciseId,
              setNumber,
            },
            tx,
          );
          exerciseLogCount += 1;
        }
      }

      return { session, exerciseLogCount };
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Session logging failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to log workout session" },
    });
  }
}

function formatExerciseName(exerciseId: string): string {
  return exerciseId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
