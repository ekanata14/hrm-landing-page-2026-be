const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", activityController.getAll);
router.get("/:slug", activityController.getOne);

// Protected routes (Admin only)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  activityController.create,
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  activityController.update,
);
router.delete("/:id", authMiddleware, activityController.delete);

module.exports = router;
