import { sequelize } from '../config/db.config.js';
import { User } from './user.model.js';
import { Category } from './category.model.js';
import { Product } from './product.model.js';

Product.belongsTo(Category, { foreignKey: 'CategoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'CategoryId', as: 'products' });

export { sequelize, User, Category, Product };
