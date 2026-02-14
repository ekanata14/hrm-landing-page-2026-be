const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// Import models
const User = require("./User")(sequelize, DataTypes);
const Activity = require("./Activity")(sequelize, DataTypes);
const Gallery = require("./Gallery")(sequelize, DataTypes);
const Announcement = require("./Announcement")(sequelize, DataTypes);

// Associations (if any)
// Activity.hasMany(Gallery);
// Gallery.belongsTo(Activity);

const db = {
  sequelize,
  User,
  Activity,
  Gallery,
  Announcement,
};

// Sync database
db.sequelize
  .sync({ alter: true }) // Use { force: true } during dev to reset DB if needed
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = db;
