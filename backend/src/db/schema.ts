import { varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const transcriptions = pgTable("transcriptions", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),

  content: varchar("content").notNull(),

  language: varchar("language", { length: 50 }).default("auto"),

  duration: integer("duration").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
