import {
  integer,
  text,
  pgTable,
  varchar,
  uuid,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
});

export const expenseTypeEnum = pgEnum("expense_type", ["car", "meal", "house"]);

// export const expensesTable = pgTable("expenses", {
//   id: uuid("id").defaultRandom(),
//   userId: uuid("user_id").notNull(),
//   amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
//   description: varchar("description").notNull(),
//   expenseType: expenseTypeEnum("expense_type").default("meal"),
//   createdAt: timestamp("created_at").defaultNow(),
// });
export const expensesTable = pgTable("expenses", {
  id: uuid("id").defaultRandom(),
  userId: uuid("user_id").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  expenseType: expenseTypeEnum("expense_type").default("meal"),
  createdAt: timestamp("created_at").defaultNow(),
});
