const express = require("express");

const {
  createEvaluation,
  getEvaluations,
  getEvaluationById,
  updateEvaluation,
  reviewEvaluation,
} = require("../controllers/evaluation.controller");

const validate = require("../middleware/validate.middleware");

const { protect, authorize } = require("../middleware/auth.middleware");

const {
  createEvaluationSchema,
  updateEvaluationSchema,
  reviewEvaluationSchema,
} = require("../validations/evaluation.validation");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("ADMIN", "REVIEWER", "ANNOTATOR"), getEvaluations)
  .post(authorize("ANNOTATOR"), validate(createEvaluationSchema), createEvaluation);

router.patch(
  "/:id/review",
  authorize("REVIEWER"),
  validate(reviewEvaluationSchema),
  reviewEvaluation
);

router
  .route("/:id")
  .get(authorize("ADMIN", "REVIEWER", "ANNOTATOR"), getEvaluationById)
  .patch(authorize("ANNOTATOR"), validate(updateEvaluationSchema), updateEvaluation);

module.exports = router;
