import { Router } from "express";

import { handleOnboarding } from "./onboarding.controller.js";

export const onboardingRouter: Router = Router();

onboardingRouter.post("/", handleOnboarding);
