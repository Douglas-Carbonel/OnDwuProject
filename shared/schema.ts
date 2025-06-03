import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  user_mail: text("user_mail").notNull().unique(),
  user_profile: text("user_profile").notNull().default("colaborador"),
  address: text("address"),
  phone: text("phone"),
  created_at: timestamp("created_at").defaultNow(),
});

export const onboardingProgress = pgTable("onboarding_progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  current_module: integer("current_module").default(1),
  completed_modules: jsonb("completed_modules").$type<number[]>().default([]),
  module_progress: jsonb("module_progress").$type<Record<string, number>>().default({}),
  module_evaluations: jsonb("module_evaluations").$type<Record<string, { score: number; passed: boolean; completedAt: string }>>().default({}),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deadline: timestamp("deadline"),
  is_expired: boolean("is_expired").default(false),
});

export const moduleEvaluations = pgTable("module_evaluations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  module_id: integer("module_id").notNull(),
  attempt_number: integer("attempt_number").notNull().default(1),
  score: integer("score").notNull(),
  total_questions: integer("total_questions").notNull().default(20),
  correct_answers: integer("correct_answers").notNull(),
  passed: boolean("passed").notNull(),
  answers: jsonb("answers").$type<Record<string, number>>().default({}),
  time_spent: integer("time_spent"), // em segundos
  completed_at: timestamp("completed_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const avaliacao_user = pgTable("avaliacao_user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  passed: boolean("passed").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const dailyAttempts = pgTable("daily_attempts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  module_id: integer("module_id").notNull(),
  attempt_date: timestamp("attempt_date").defaultNow(),
  attempt_count: integer("attempt_count").default(1),
});

export const certificates = pgTable("certificates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull(),
  certificate_id: text("certificate_id").notNull().unique(),
  user_name: text("user_name").notNull(),
  course_name: text("course_name").notNull().default("Programa de Onboarding DWU IT Solutions"),
  completion_date: timestamp("completion_date").notNull(),
  certificate_url: text("certificate_url"),
  created_at: timestamp("created_at").defaultNow(),
});

// Export schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  user_mail: true,
  user_profile: true,
  address: true,
  phone: true,
});

export const insertProgressSchema = z.object({
  userId: z.string(),
  currentModule: z.number().optional().default(1),
  completedModules: z.array(z.number()).optional().default([]),
  moduleProgress: z.record(z.number()).optional().default({}),
  moduleEvaluations: z.record(z.object({
    score: z.number(),
    passed: z.boolean(),
    completedAt: z.string()
  })).optional().default({}),
  completedAt: z.string().nullable().optional().default(null)
});

export const insertModuleEvaluationSchema = z.object({
  user_id: z.string(),
  module_id: z.number(),
  attempt_number: z.number().default(1),
  score: z.number(),
  total_questions: z.number().default(20),
  correct_answers: z.number(),
  passed: z.boolean(),
  answers: z.record(z.number()).default({}),
  time_spent: z.number().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type OnboardingProgress = typeof onboardingProgress.$inferSelect & {
  currentModule?: number;
  completedModules?: number[];
  moduleProgress?: Record<string, number>;
  moduleEvaluations?: Record<string, { score: number; passed: boolean; completedAt: string }>;
};
export type InsertOnboardingProgress = z.infer<typeof insertProgressSchema>;
export type ModuleEvaluation = typeof moduleEvaluations.$inferSelect;
export type InsertModuleEvaluation = z.infer<typeof insertModuleEvaluationSchema>;
export type DailyAttempt = typeof dailyAttempts.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;