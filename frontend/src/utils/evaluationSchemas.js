import { z } from "zod";

const ratingSchema = z.coerce
  .number()
  .int("Rating must be a whole number")
  .min(1, "Minimum rating is 1")
  .max(5, "Maximum rating is 5");

export const evaluationSchema = z.object({
  accuracy: ratingSchema,
  relevance: ratingSchema,
  coherence: ratingSchema,
  safety: ratingSchema,

  issueType: z.enum([
    "NONE",
    "HALLUCINATION",
    "UNSAFE",
    "IRRELEVANT",
    "INCOMPLETE",
    "BIAS",
    "OTHER",
  ]),

  notes: z
    .string()
    .min(10, "Notes must be at least 10 characters"),
});
