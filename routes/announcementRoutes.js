const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", announcementController.getAll);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  announcementController.create,
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  announcementController.update,
);
router.delete("/:id", authMiddleware, announcementController.delete);

module.exports = router;
