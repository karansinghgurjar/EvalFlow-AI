import { z } from "zod";

export const rejectReviewSchema = z.object({
  reviewerFeedback: z
    .string()
    .min(5, "Feedback must be at least 5 characters"),
});
