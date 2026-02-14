module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define("Gallery", {
    title: {
      type: DataTypes.JSON, // {en: "", id: ""}
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "general",
    },
  });

  return Gallery;
};
