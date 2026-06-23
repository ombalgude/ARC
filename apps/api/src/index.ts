import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { db, sql } from "@arc/database";
import { generateWorkoutPlan, calculateMacros } from "@arc/fitness-core";
import { workoutInputSchema, nutritionInputSchema } from "@arc/validations";
import { requireAuth } from "./middleware/clerk-auth.js";
import { requireUser } from "./middleware/require-user.js";

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

  const { goals, experienceLevel } = result.data;
  const plan = generateWorkoutPlan(goals, experienceLevel);

  res.json({ success: true, data: { plan } });
});

app.post("/api/v1/nutrition/calculate", requireAuth, requireUser, (req, res) => {
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

  const { weightKg, goal } = result.data;
  const macros = calculateMacros(weightKg, goal);

  res.json({ success: true, data: { macros } });
});

app.listen(port, () => {
  console.log(`[API] Server is running on port ${port}`);
});
