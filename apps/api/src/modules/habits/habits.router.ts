import { Router } from "express";

import { handleGetHabits, handleLogHabit } from "./habits.controller.js";

export const habitsRouter: Router = Router();

habitsRouter.get("/", handleGetHabits);
habitsRouter.post("/log", handleLogHabit);
