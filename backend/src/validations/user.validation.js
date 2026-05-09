const { z } = require("zod");

const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "ANNOTATOR", "REVIEWER"]),
});

module.exports = {
  updateUserRoleSchema,
};
