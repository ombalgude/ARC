import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db, sql } from "@arc/database";
import { generateWorkoutPlan, calculateMacros } from "@arc/fitness-core";
import { workoutInputSchema, nutritionInputSchema } from "@arc/validations";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.get("/health/db", async (req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({ db: "connected" });
  } catch {
    res.status(500).json({ db: "disconnected" });
  }
});

app.post("/workouts/generate", (req, res) => {
  const result = workoutInputSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  const { goals, experienceLevel } = result.data;
  const plan = generateWorkoutPlan(goals, experienceLevel);

  res.json({ success: true, plan });
});

app.post("/nutrition/calculate", (req, res) => {
  const result = nutritionInputSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  const { weightKg, goal } = result.data;
  const macros = calculateMacros(weightKg, goal);

  res.json({ success: true, macros });
});

app.listen(port, () => {
  console.log(`[API] Server is running on port ${port}`);
});
