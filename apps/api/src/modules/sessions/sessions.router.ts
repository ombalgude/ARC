import { Router } from "express";

import {
  handleGetWorkoutDay,
  handleStartSession,
  handleLogSet,
  handleCompleteSession,
} from "./sessions.controller.js";

export const sessionsRouter: Router = Router();

sessionsRouter.post("/start", handleStartSession);
sessionsRouter.post("/log-set", handleLogSet);
sessionsRouter.post("/complete", handleCompleteSession);
sessionsRouter.get("/days/:dayId", handleGetWorkoutDay);
