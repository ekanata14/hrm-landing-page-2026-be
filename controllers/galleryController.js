const { Gallery } = require("../models");
const fs = require("fs");
const path = require("path");
const { autoTranslateFields } = require("../services/translateService");

exports.getAll = async (req, res) => {
  try {
    const images = await Gallery.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, category } = req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Prepare data for translation
    let galleryData = {
      title: title ? JSON.parse(title) : { en: "", id: "" },
    };

    // Auto-translate fields
    galleryData = await autoTranslateFields(galleryData, ["title"]);

    const gallery = await Gallery.create({
      ...galleryData,
      image,
      category,
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByPk(id);
    if (!gallery)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });

    // Delete image
    const imagePath = path.join(__dirname, "../../", gallery.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await gallery.destroy();
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
