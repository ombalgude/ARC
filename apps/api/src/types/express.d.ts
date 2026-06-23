export {};

declare global {
  namespace Express {
    interface Request {
      auth?: { clerkUserId: string };
      dbUser?: { id: string; email: string };
    }
  }
}
