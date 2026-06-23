import { clerkClient } from "@clerk/express";
import { userRepository } from "@arc/database";
import type { NextFunction, Request, Response } from "express";

function getPrimaryEmail(emailAddresses: Awaited<ReturnType<typeof clerkClient.users.getUser>>["emailAddresses"]): string | null {
  const primaryEmail = emailAddresses.find((emailAddress) => emailAddress.verification?.status === "verified");
  return primaryEmail?.emailAddress ?? emailAddresses[0]?.emailAddress ?? null;
}

export async function requireUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const clerkUserId = req.auth?.clerkUserId;

  if (!clerkUserId) {
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
    const existingUser = await userRepository.findByClerkId(clerkUserId);

    if (existingUser) {
      req.dbUser = { id: existingUser.id, email: existingUser.email };
      next();
      return;
    }

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const email = getPrimaryEmail(clerkUser.emailAddresses);

    if (!email) {
      res.status(422).json({
        success: false,
        error: {
          code: "CLERK_EMAIL_MISSING",
          message: "Authenticated user must have an email address",
        },
      });
      return;
    }

    const createdUser = await userRepository.create({
      clerkId: clerkUserId,
      email,
    });

    if (!createdUser) {
      throw new Error("User repository did not return a created user");
    }

    req.dbUser = { id: createdUser.id, email: createdUser.email };
    next();
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: "USER_SYNC_FAILED",
        message: "Unable to sync authenticated user",
      },
    });
  }
}
