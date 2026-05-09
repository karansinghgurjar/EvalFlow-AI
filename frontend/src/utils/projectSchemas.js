import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be less than 120 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  domain: z
    .string()
    .min(2, "Domain is required")
    .max(60, "Domain must be less than 60 characters"),

  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]),

  deadline: z.string().optional(),
});
