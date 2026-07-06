import { Router } from "express";

import { handleGetHabits, handleLogHabit, handleCreateHabit, handleDeleteHabit, handleUpdateHabit } from "./habits.controller.js";

export const habitsRouter: Router = Router();

habitsRouter.get("/", handleGetHabits);
habitsRouter.post("/", handleCreateHabit);
habitsRouter.post("/log", handleLogHabit);
habitsRouter.delete("/:habitId", handleDeleteHabit);
habitsRouter.patch("/:habitId", handleUpdateHabit);
