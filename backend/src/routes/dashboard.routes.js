const express = require("express");

const {
  getAdminDashboard,
  getAnnotatorDashboard,
  getReviewerDashboard,
} = require("../controllers/dashboard.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/admin", authorize("ADMIN"), getAdminDashboard);
router.get("/annotator", authorize("ANNOTATOR"), getAnnotatorDashboard);
router.get("/reviewer", authorize("REVIEWER"), getReviewerDashboard);

module.exports = router;
