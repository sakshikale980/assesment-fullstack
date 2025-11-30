import { Category } from '../models/index.js';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: 'Category already exists' });
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;   
    const limit = parseInt(req.query.limit) || 10;  
    const offset = (page - 1) * limit;
    const { count, rows } = await Category.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]  
    });

    res.json({
      count,  
      rows    
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    category.name = name;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
