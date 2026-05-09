const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be less than 80 characters"),

  email: z.string().email("Please enter a valid email address").toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["ADMIN", "ANNOTATOR", "REVIEWER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
