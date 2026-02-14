const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", galleryController.getAll);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  galleryController.create,
);
router.delete("/:id", authMiddleware, galleryController.delete);

module.exports = router;
