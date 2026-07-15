import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { db, sql } from "@arc/database";
import { generateWorkoutPlan, calculateMacros } from "@arc/fitness-core";
import { workoutInputSchema, nutritionInputSchema } from "@arc/validations";
import { requireAuth } from "./middleware/clerk-auth.js";
import { requireAdmin } from "./middleware/require-admin.js";
import { requireUser } from "./middleware/require-user.js";
import { adminRouter } from "./modules/admin/admin.router.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.router.js";
import { habitsRouter } from "./modules/habits/habits.router.js";
import { onboardingRouter } from "./modules/onboarding/onboarding.router.js";
import { sessionsRouter } from "./modules/sessions/sessions.router.js";
import { usersRouter } from "./modules/users/users.router.js";
import { plansRouter } from "./modules/plans/plans.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.get("/api/v1/health/db", async (_req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ db: "connected" });
  } catch {
    res.status(500).json({ db: "disconnected" });
  }
});

app.post("/api/v1/workouts/generate", requireAuth, requireUser, (req, res) => {
  const result = workoutInputSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid workout input",
      },
    });
    return;
  }

  const plan = generateWorkoutPlan({
    goals: result.data.goals,
    experienceLevel: result.data.experienceLevel,
    workoutFrequency: result.data.workoutFrequency,
    environment: result.data.environment,
    equipment: result.data.equipment,
  });

  res.json({ success: true, data: { plan } });
});

app.post(
  "/api/v1/nutrition/calculate",
  requireAuth,
  requireUser,
  (req, res) => {
    const result = nutritionInputSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid nutrition input",
        },
      });
      return;
    }

    const macros = calculateMacros(result.data);

    res.json({ success: true, data: { macros } });
  },
);

app.use("/api/v1/onboarding", requireAuth, requireUser, onboardingRouter);
app.use("/api/v1/users", requireAuth, requireUser, usersRouter);
app.use("/api/v1/dashboard", requireAuth, requireUser, dashboardRouter);
app.use("/api/v1/sessions", requireAuth, requireUser, sessionsRouter);
app.use("/api/v1/habits", requireAuth, requireUser, habitsRouter);
app.use("/api/v1/admin", requireAuth, requireAdmin, adminRouter);
app.use("/api/v1/plans", requireAuth, requireUser, plansRouter);

app.listen(port, () => {
  console.log(`[API] Server is running on port ${port}`);
});
