import db from '../models/index.js';
const {
  Category,
  Op,
  Product
} = db;

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: error?.original?.detail || 'Internal server error' });
  }
}

const getCategories = async (req, res) => {
  try {

    const limit = Number(req.body.pageSize)
    const pageNumber = Number(req.body.pageNumber)
    const offset = (pageNumber - 1) * limit;
    const search = req.query.search;

    let where = { deleted: false };
    if (search) {
      where.name = { [Op.iLike || Op.like]: `%${search}%` };
    }

    const categories = await Category.findAndCountAll({
      where,
      limit,
      offset,
    });

    return res.json(categories);

  }
  catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateCategories = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    if (req.body.deleted !== undefined) {

      const productsWithCategory = await Product.findOne({ where: { category_id: id, deleted: false }, raw: true });
      if (productsWithCategory) {
        return res.status(400).json({ message: 'Cannot delete category with associated products' });
      }

    }

    const cat = await Category.update(req.body, { where: { id } });

    res.json({
      message: 'Category updated successfully',
      category: cat
    });

  } catch (err) {
    console.error(err); res.status(500).json({ message: err?.original?.detail || 'Internal server error' });
  }
};

export { addCategory, getCategories, updateCategories };