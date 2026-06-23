import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

const BEARER_PREFIX = "Bearer ";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authorizationHeader = req.header("authorization");

  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  req.auth = { clerkUserId: userId };
  next();
}
