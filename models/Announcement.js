module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define("Announcement", {
    title: {
      type: DataTypes.JSON, // {en: "", id: ""}
      allowNull: false,
    },
    description: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("event", "news", "announcement"),
      defaultValue: "announcement",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    published_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Announcement;
};
