const { Announcement } = require("../models");
const fs = require("fs");
const path = require("path");
const { autoTranslateFields } = require("../services/translateService");

exports.getAll = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: { is_active: true },
      order: [["published_at", "DESC"]],
    });
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, content, date, location, type, slug } =
      req.body;
    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Prepare data for translation
    let announcementData = {
      title: JSON.parse(title),
      description: JSON.parse(description),
      content: content ? JSON.parse(content) : null,
    };

    // Auto-translate fields
    announcementData = await autoTranslateFields(announcementData, [
      "title",
      "description",
      "content",
    ]);

    const announcement = await Announcement.create({
      ...announcementData,
      date,
      location,
      type,
      image,
      slug,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      date,
      location,
      type,
      is_active,
      slug,
    } = req.body;
    const announcement = await Announcement.findByPk(id);

    if (!announcement)
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });

    let image = announcement.image;
    if (req.file) {
      const oldImagePath = path.join(__dirname, "../../", announcement.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      image = `/uploads/${req.file.filename}`;
    }

    // Prepare data for translation
    let announcementData = {
      title: title ? JSON.parse(title) : announcement.title,
      description: description
        ? JSON.parse(description)
        : announcement.description,
      content: content ? JSON.parse(content) : announcement.content,
    };

    // Auto-translate fields
    announcementData = await autoTranslateFields(announcementData, [
      "title",
      "description",
      "content",
    ]);

    await announcement.update({
      ...announcementData,
      date,
      location,
      type,
      image,
      is_active: is_active !== undefined ? is_active : announcement.is_active,
      slug,
    });

    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement)
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });

    const imagePath = path.join(__dirname, "../../", announcement.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await announcement.destroy();
    res.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
