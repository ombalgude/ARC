import { Router } from "express";

import { handleGetMe, handleUpdatePushToken, handleGetWeightLogs, handleAddWeightLog } from "./users.controller.js";

export const usersRouter: Router = Router();

usersRouter.get("/me", handleGetMe);
usersRouter.post("/push-token", handleUpdatePushToken);
usersRouter.get("/weight", handleGetWeightLogs);
usersRouter.post("/weight", handleAddWeightLog);
