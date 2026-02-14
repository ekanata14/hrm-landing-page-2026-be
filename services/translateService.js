const translate = require("google-translate-api-x");

// Helper to translate text
const translateText = async (text, from = "auto", to = "en") => {
  try {
    const res = await translate(text, { from, to });
    return res.text;
  } catch (err) {
    console.error(`Translation error ('${text}'):`, err);
    return text; // Return original if translation fails
  }
};

// Helper to auto-translate JSON fields like title, description, content
const autoTranslateFields = async (data, fieldsToTranslate) => {
  const result = { ...data };

  for (const field of fieldsToTranslate) {
    // Check if field is present and is an object with { en, id }
    if (result[field]) {
      let fieldValue = result[field];

      // If string, try parse
      if (typeof fieldValue === "string") {
        try {
          fieldValue = JSON.parse(fieldValue);
        } catch (e) {
          // not json string, maybe simple string
          // If simple string, assume it's one language (English likely?) or just leave it?
          // Let's assume the frontend sends JSON string always now.
          continue;
        }
      }

      // Logic:
      // If we have 'en' but no 'id' -> translate en to id
      // If we have 'id' but no 'en' -> translate id to en

      if (fieldValue.en && !fieldValue.id) {
        fieldValue.id = await translateText(fieldValue.en, "en", "id");
      } else if (fieldValue.id && !fieldValue.en) {
        fieldValue.en = await translateText(fieldValue.id, "id", "en");
      }

      result[field] = fieldValue; // Keep as object, Sequelize will handle stringify if model is JSON type, or we might need to stringify back if input expected string
    }
  }

  return result;
};

module.exports = { translateText, autoTranslateFields };
