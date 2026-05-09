const { z } = require("zod");

const ratingSchema = z
  .number()
  .int("Rating must be an integer")
  .min(1, "Rating must be at least 1")
  .max(5, "Rating must be at most 5");

const createEvaluationSchema = z.object({
  taskId: z.string().uuid("Task ID must be a valid UUID"),

  accuracy: ratingSchema,
  relevance: ratingSchema,
  coherence: ratingSchema,
  safety: ratingSchema,

  issueType: z
    .enum([
      "NONE",
      "HALLUCINATION",
      "UNSAFE",
      "IRRELEVANT",
      "INCOMPLETE",
      "BIAS",
      "OTHER",
    ])
    .optional(),

  notes: z.string().min(10, "Notes must be at least 10 characters"),

  status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
});

const updateEvaluationSchema = z.object({
  accuracy: ratingSchema.optional(),
  relevance: ratingSchema.optional(),
  coherence: ratingSchema.optional(),
  safety: ratingSchema.optional(),

  issueType: z
    .enum([
      "NONE",
      "HALLUCINATION",
      "UNSAFE",
      "IRRELEVANT",
      "INCOMPLETE",
      "BIAS",
      "OTHER",
    ])
    .optional(),

  notes: z.string().min(10, "Notes must be at least 10 characters").optional(),

  status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
});

const reviewEvaluationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),

  reviewerFeedback: z
    .string()
    .min(5, "Reviewer feedback must be at least 5 characters")
    .optional(),
});

module.exports = {
  createEvaluationSchema,
  updateEvaluationSchema,
  reviewEvaluationSchema,
};
