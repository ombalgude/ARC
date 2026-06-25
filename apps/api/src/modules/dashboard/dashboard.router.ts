import { Router } from "express";

import { handleGetDashboardMe } from "./dashboard.controller.js";

export const dashboardRouter: Router = Router();

dashboardRouter.get("/me", handleGetDashboardMe);
