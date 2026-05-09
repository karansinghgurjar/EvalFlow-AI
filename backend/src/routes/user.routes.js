const express = require("express");

const {
  getUsers,
  getUserById,
  updateUserRole,
} = require("../controllers/user.controller");

const validate = require("../middleware/validate.middleware");

const { protect, authorize } = require("../middleware/auth.middleware");

const { updateUserRoleSchema } = require("../validations/user.validation");

const router = express.Router();

router.use(protect);

router.get("/", authorize("ADMIN", "REVIEWER"), getUsers);
router.get("/:id", authorize("ADMIN", "REVIEWER"), getUserById);
router.patch(
  "/:id/role",
  authorize("ADMIN"),
  validate(updateUserRoleSchema),
  updateUserRole
);

module.exports = router;
