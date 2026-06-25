import { Router } from "express";

import { handleGetMe } from "./users.controller.js";

export const usersRouter: Router = Router();

usersRouter.get("/me", handleGetMe);
