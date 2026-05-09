import { z } from "zod";

export const taskSchema = z.object({
  projectId: z.string().min(1, "Project is required"),

  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters"),

  response: z
    .string()
    .min(10, "Model response must be at least 10 characters"),

  category: z
    .string()
    .min(2, "Category is required")
    .max(80, "Category must be less than 80 characters"),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),

  assignedToId: z.string().optional(),

  dueDate: z.string().optional(),
});
