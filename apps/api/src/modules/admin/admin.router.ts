import { Router } from "express";

import { handleGetAdminHealth } from "./admin.controller.js";

export const adminRouter: Router = Router();

adminRouter.get("/health", handleGetAdminHealth);
