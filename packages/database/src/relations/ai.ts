import { relations } from "drizzle-orm";

import { aiConversations, aiMessages } from "../schema/ai.js";
import { users } from "../schema/users.js";

export const aiConversationsRelations = relations(aiConversations, ({ many, one }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
  messages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));
