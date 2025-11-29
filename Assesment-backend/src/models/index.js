import { Sequelize, DataTypes, Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import UserModel from './user.model.js';
import CategoryModel from './category.model.js';
import ProductModel from './product.model.js';

// === CREATE SEQUELIZE INSTANCE ===
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD),
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

// === TEST DATABASE CONNECTION ===
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Database Connected Successfully!");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
  }
})();

// === INITIALIZE MODELS ===
const db = {
  Op,
  Sequelize,
  sequelize,
  User: UserModel(sequelize, DataTypes),
  Category: CategoryModel(sequelize, DataTypes),
  Product: ProductModel(sequelize, DataTypes),
};

// === RELATIONS ===
db.Category.hasMany(db.Product, { foreignKey: "category_id" });
db.Product.belongsTo(db.Category, { foreignKey: "category_id" });

export default db;
