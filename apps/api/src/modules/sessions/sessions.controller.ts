import type { ApiResponse } from "@arc/types";
import { db, workoutRepository } from "@arc/database";
import { startSessionSchema, logSetSchema, completeSessionSchema } from "@arc/validations";
import type { Request, Response } from "express";

type WorkoutDayResult = NonNullable<
  Awaited<ReturnType<typeof workoutRepository.findDayWithExercisesByUser>>
>;

export async function handleGetWorkoutDay(
  req: Request<{ dayId: string }>,
  res: Response<ApiResponse<WorkoutDayResult>>,
): Promise<void> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(req.params.dayId)) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Workout day not found" },
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

export async function handleStartSession(
  req: Request,
  res: Response<ApiResponse<{ session: any }>>,
): Promise<void> {
  const parsedBody = startSessionSchema.safeParse(req.body);

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

    const session = await workoutRepository.createSession({
      userId: req.dbUser.id,
      workoutPlanId: day.workoutPlanId,
      workoutDayId: day.id,
      startedAt: new Date(parsedBody.data.startedAt),
    });

    res.status(201).json({ success: true, data: { session } });
  } catch (error) {
    console.error("Session start failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to start session" },
    });
  }
}

export async function handleLogSet(
  req: Request,
  res: Response<ApiResponse<{ log: any }>>,
): Promise<void> {
  const parsedBody = logSetSchema.safeParse(req.body);

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
    const session = await workoutRepository.findSessionById(parsedBody.data.sessionId);
    if (!session || session.userId !== req.dbUser.id) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Session not found" },
      });
      return;
    }

    const log = await workoutRepository.logExercise({
      sessionId: parsedBody.data.sessionId,
      exerciseId: parsedBody.data.exerciseId,
      setNumber: parsedBody.data.setNumber,
      repsCompleted: parsedBody.data.repsCompleted,
      weightKg: parsedBody.data.weightKg?.toString(),
    });

    res.status(201).json({ success: true, data: { log } });
  } catch (error) {
    console.error("Set log failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to log set" },
    });
  }
}

export async function handleCompleteSession(
  req: Request,
  res: Response<ApiResponse<{ session: any }>>,
): Promise<void> {
  const parsedBody = completeSessionSchema.safeParse(req.body);

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
    const session = await workoutRepository.findSessionById(parsedBody.data.sessionId);
    if (!session || session.userId !== req.dbUser.id) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Session not found" },
      });
      return;
    }

    const startedAt = session.startedAt ? new Date(session.startedAt) : new Date();
    const completedAt = new Date(parsedBody.data.completedAt);
    const durationMinutes = Math.max(
      0,
      Math.round((completedAt.getTime() - startedAt.getTime()) / 60000),
    );

    const updatedSession = await workoutRepository.updateSession(parsedBody.data.sessionId, {
      completedAt,
      durationMinutes,
      notes: parsedBody.data.notes,
    });

    res.status(200).json({ success: true, data: { session: updatedSession } });
  } catch (error) {
    console.error("Session complete failed", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Unable to complete session" },
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
