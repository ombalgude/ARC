import type { ApiResponse } from "@arc/types";
import { userRepository } from "@arc/database";
import type { Request, Response } from "express";

type UserMeResult = NonNullable<Awaited<ReturnType<typeof userRepository.findMeById>>> & {
  profileComplete: boolean;
};

export async function handleGetMe(req: Request, res: Response<ApiResponse<UserMeResult>>): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  try {
    const result = await userRepository.findMeById(req.dbUser.id);

    if (!result) {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...result,
        profileComplete: isProfileComplete(result.profile, result.preferences),
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Unable to fetch user profile",
      },
    });
  }
}

export async function handleUpdatePushToken(
  req: Request,
  res: Response<ApiResponse<{ saved: true }>>,
): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";

  if (!token) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Push token is required",
      },
    });
    return;
  }

  try {
    const updatedUser = await userRepository.updatePushToken(req.dbUser.id, token);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { saved: true },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Unable to save push token",
      },
    });
  }
}

function isProfileComplete(
  profile: Awaited<ReturnType<typeof userRepository.findProfileByUserId>>,
  preferences: Awaited<ReturnType<typeof userRepository.findPreferencesByUserId>>,
): boolean {
  return Boolean(
    profile?.age &&
      profile.gender &&
      profile.weightKg &&
      profile.heightCm &&
      profile.goal &&
      profile.experienceLevel &&
      profile.activityLevel &&
      profile.dietaryPreference !== null &&
      profile.workoutDaysPerWeek &&
      preferences?.preferredEnvironment &&
      Array.isArray(preferences.equipment),
  );
}

export async function handleGetWeightLogs(req: Request, res: Response<ApiResponse<any>>): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    return;
  }
  try {
    const logs = await userRepository.getWeightLogs(req.dbUser.id);
    res.status(200).json({ success: true, data: { logs } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Unable to fetch weight logs" } });
  }
}

export async function handleAddWeightLog(req: Request, res: Response<ApiResponse<any>>): Promise<void> {
  if (!req.dbUser?.id) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    return;
  }
  
  const weightKg = req.body?.weightKg;
  if (!weightKg) {
    res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Weight is required" } });
    return;
  }

  try {
    const log = await userRepository.addWeightLog(req.dbUser.id, weightKg.toString());
    res.status(200).json({ success: true, data: { log } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Unable to add weight log" } });
  }
}
