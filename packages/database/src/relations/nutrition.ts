import { relations } from "drizzle-orm";

import { nutritionProfiles } from "../schema/nutrition.js";
import { users } from "../schema/users.js";

export const nutritionProfilesRelations = relations(nutritionProfiles, ({ one }) => ({
  user: one(users, {
    fields: [nutritionProfiles.userId],
    references: [users.id],
  }),
}));
