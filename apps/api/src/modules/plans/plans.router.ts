import { Router } from "express";
import { handleRegeneratePlan } from "./plans.controller.js";

export const plansRouter: Router = Router();

plansRouter.post("/regenerate", handleRegeneratePlan);
