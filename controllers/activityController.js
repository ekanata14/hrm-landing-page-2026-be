const { Activity } = require("../models");
const fs = require("fs");
const path = require("path");
const { autoTranslateFields } = require("../services/translateService");

exports.getAll = async (req, res) => {
  try {
    const activities = await Activity.findAll({ order: [["date", "DESC"]] });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { slug } = req.params;
    const activity = await Activity.findOne({ where: { slug } });
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, content, date, time, location, slug } =
      req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Prepare data for translation
    let activityData = {
      title: JSON.parse(title),
      description: JSON.parse(description),
      content: JSON.parse(content),
    };

    // Auto-translate fields
    activityData = await autoTranslateFields(activityData, [
      "title",
      "description",
      "content",
    ]);

    const activity = await Activity.create({
      ...activityData,
      date,
      time,
      location,
      image,
      slug,
    });

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, date, time, location, slug } =
      req.body;
    const activity = await Activity.findByPk(id);

    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });

    let image = activity.image;
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, "../../", activity.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      image = `/uploads/${req.file.filename}`;
    }

    // Prepare data for translation
    let activityData = {
      title: title ? JSON.parse(title) : activity.title,
      description: description ? JSON.parse(description) : activity.description,
      content: content ? JSON.parse(content) : activity.content,
    };

    // Auto-translate fields
    activityData = await autoTranslateFields(activityData, [
      "title",
      "description",
      "content",
    ]);

    await activity.update({
      ...activityData,
      date,
      time,
      location,
      image,
      slug,
    });

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id);
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });

    // Delete image
    const imagePath = path.join(__dirname, "../../", activity.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await activity.destroy();
    res.json({ success: true, message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
