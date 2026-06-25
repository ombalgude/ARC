import type { NextFunction, Request, Response } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminClerkId = process.env.ADMIN_CLERK_ID;

  if (!adminClerkId) {
    res.status(500).json({
      success: false,
      error: {
        code: "ADMIN_NOT_CONFIGURED",
        message: "Admin access is not configured",
      },
    });
    return;
  }

  if (req.auth?.clerkUserId !== adminClerkId) {
    res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Admin access required",
      },
    });
    return;
  }

  next();
}
