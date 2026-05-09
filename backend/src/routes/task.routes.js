const express = require("express");

const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  assignTask,
} = require("../controllers/task.controller");

const validate = require("../middleware/validate.middleware");

const { protect, authorize } = require("../middleware/auth.middleware");

const {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
} = require("../validations/task.validation");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "REVIEWER", "ANNOTATOR"), getTasks)
  .post(authorize("ADMIN"), validate(createTaskSchema), createTask);

router.patch(
  "/:id/assign",
  authorize("ADMIN"),
  validate(assignTaskSchema),
  assignTask
);

router
  .route("/:id")
  .get(authorize("ADMIN", "REVIEWER", "ANNOTATOR"), getTaskById)
  .patch(authorize("ADMIN"), validate(updateTaskSchema), updateTask);

module.exports = router;
