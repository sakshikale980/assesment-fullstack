export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: { type: DataTypes.TEXT },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    description: { type: DataTypes.TEXT },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
    { underscored: true }
  );

  return Product;
};
