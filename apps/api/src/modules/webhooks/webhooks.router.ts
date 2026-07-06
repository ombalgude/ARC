import { Router } from "express";
import { handleClerkWebhook } from "./webhooks.controller.js";
import express from "express";

export const webhooksRouter: Router = Router();

// We need raw body for Svix verification, so we use express.raw for this route
webhooksRouter.post("/clerk", express.raw({ type: 'application/json' }), handleClerkWebhook);
