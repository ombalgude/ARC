import { Router } from "express";

import {
  handleGetWorkoutDay,
  handleLogSession,
} from "./sessions.controller.js";

export const sessionsRouter: Router = Router();

sessionsRouter.post("/", handleLogSession);
sessionsRouter.get("/days/:dayId", handleGetWorkoutDay);
