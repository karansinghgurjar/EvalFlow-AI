const { z } = require("zod");

const createTaskSchema = z.object({
  projectId: z.string().uuid("Project ID must be a valid UUID"),

  prompt: z.string().min(10, "Prompt must be at least 10 characters"),

  response: z.string().min(10, "Response must be at least 10 characters"),

  category: z
    .string()
    .min(2, "Category is required")
    .max(80, "Category must be less than 80 characters"),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),

  assignedToId: z
    .string()
    .uuid("Assigned user ID must be a valid UUID")
    .optional()
    .nullable(),

  status: z
    .enum(["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"])
    .optional(),

  dueDate: z
    .string()
    .datetime("Due date must be a valid ISO date")
    .optional()
    .nullable(),
});

const updateTaskSchema = createTaskSchema
  .omit({
    projectId: true,
  })
  .partial();

const assignTaskSchema = z.object({
  assignedToId: z.string().uuid("Assigned user ID must be a valid UUID"),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
};
