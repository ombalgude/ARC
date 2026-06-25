import { Router } from "express";

import { handleGetMe, handleUpdatePushToken } from "./users.controller.js";

export const usersRouter: Router = Router();

usersRouter.get("/me", handleGetMe);
usersRouter.post("/push-token", handleUpdatePushToken);
