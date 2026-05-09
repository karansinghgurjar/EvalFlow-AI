const express = require("express");

const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const validate = require("../middleware/validate.middleware");

const { protect, authorize } = require("../middleware/auth.middleware");

const {
  createProjectSchema,
  updateProjectSchema,
} = require("../validations/project.validation");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "REVIEWER", "ANNOTATOR"), getProjects)
  .post(authorize("ADMIN"), validate(createProjectSchema), createProject);

router
  .route("/:id")
  .get(authorize("ADMIN", "REVIEWER", "ANNOTATOR"), getProjectById)
  .patch(authorize("ADMIN"), validate(updateProjectSchema), updateProject)
  .delete(authorize("ADMIN"), deleteProject);

module.exports = router;
