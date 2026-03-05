import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(500).optional(),
  categoryId: z.string().min(1, "Category is required"),
  featuredImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const aiGenerateSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
});

export const conflictZoneSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  region: z.string().min(1),
  countryCode: z.string().length(2).optional(),
  status: z.enum(["ACTIVE", "MONITORING", "RESOLVED"]).optional(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).optional(),
  baselineRisk: z.number().min(0).max(100).optional(),
  conflictType: z
    .enum(["WAR", "INSURGENCY", "CIVIL_UNREST", "TERRITORIAL", "CYBER"])
    .optional(),
});

export const messageSchema = z.object({
  ciphertext: z.string().min(1),
  iv: z.string().min(1),
});
