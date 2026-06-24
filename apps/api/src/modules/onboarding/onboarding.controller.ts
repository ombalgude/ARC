import type { ApiResponse } from "@arc/types";
import { onboardingSchema } from "@arc/validations";
import type { Request, Response } from "express";

import { processOnboarding, type OnboardingResult } from "./onboarding.service.js";

export async function handleOnboarding(
  req: Request,
  res: Response<ApiResponse<OnboardingResult>>,
): Promise<void> {
  const parsedBody = onboardingSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const message = parsedBody.error.issues.map((issue) => issue.message).join("; ");

    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message,
      },
    });
    return;
  }

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
    const result = await processOnboarding(req.dbUser.id, parsedBody.data);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Onboarding failed",
      },
    });
  }
}
