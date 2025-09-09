import { integer, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
});
