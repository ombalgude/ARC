import { Router } from "express";

import {
  handleGetWorkoutDay,
  handleStartSession,
  handleLogSet,
  handleCompleteSession,
  handleGetSessions,
} from "./sessions.controller.js";

export const sessionsRouter: Router = Router();

sessionsRouter.post("/start", handleStartSession);
sessionsRouter.post("/log-set", handleLogSet);
sessionsRouter.post("/complete", handleCompleteSession);
sessionsRouter.get("/", handleGetSessions);
sessionsRouter.get("/days/:dayId", handleGetWorkoutDay);
