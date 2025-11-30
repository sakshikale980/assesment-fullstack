import { Product, Category, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import multer from 'multer';
import fs from 'fs';
import csv from 'fast-csv';
import ExcelJS from 'exceljs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'src/uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});
export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, price, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !categoryId) {
      await t.rollback();
      return res.status(400).json({ error: 'name, price and categoryId are required' });
    }
    const category = await Category.findByPk(categoryId, { transaction: t });
    if (!category) {
      await t.rollback();
      return res.status(404).json({ error: 'Category not found' });
    }
    const product = await Product.create({
      name,
      price: parseFloat(price),
      image,
      CategoryId: categoryId
    }, { transaction: t });

    await t.commit();
    res.status(201).json(product);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: { model: Category, as: 'category' } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, price, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;
    const product = await Product.findByPk(req.params.id, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId, { transaction: t });
      if (!category) {
        await t.rollback();
        return res.status(404).json({ error: 'Category not found' });
      }
      product.CategoryId = categoryId;
    }
    if (name) product.name = name;
    if (price) product.price = parseFloat(price);
    if (image) product.image = image;

    await product.save({ transaction: t });
    await t.commit();
    res.json(product);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '', sort } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const order = [];
    if (sort === 'asc' || sort === 'desc') {
      order.push(['price', sort]);
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'] 
        }
      ],
      limit,
      offset,
      order,
      distinct: true
    });
    res.json({
      page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      products: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const bulkUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' });
    const stream = fs.createReadStream(req.file.path);
    const csvStream = csv.parse({ headers: true, ignoreEmpty: true, trim: true });
    const batchSize = 500;
    let buffer = [];
    const failures = [];
    let total = 0;

    csvStream.on('error', (err) => {
      console.error('CSV parse error', err);
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: err.message });
    });
    csvStream.on('data', (row) => {
      buffer.push(row);
      if (buffer.length >= batchSize) {
        csvStream.pause();
        (async () => {
          try {
            await processBatch(buffer);
          } catch (e) {
            console.error('batch error', e);
          } finally {
            buffer = [];
            csvStream.resume();
          }
        })();
      }
    });
    csvStream.on('end', async () => {
      if (buffer.length > 0) {
        await processBatch(buffer);
        buffer = [];
      }
      fs.unlinkSync(req.file.path);
      res.json({ message: 'Bulk upload completed', totalProcessed: total, failures });
    });

    stream.pipe(csvStream);
    async function processBatch(rows) {
      const toCreate = [];
      for (const r of rows) {
        total++;
        const name = r.name;
        const price = parseFloat(r.price || 0);
        const categoryName = r.category || r.categoryName || r.Category || '';
        if (!name || !categoryName) {
          failures.push({ row: r, error: 'Missing name or category' });
          continue;
        }
        const category = await Category.findOne({ where: { name: categoryName } });
        if (!category) {
          failures.push({ row: r, error: 'Category not found: ' + categoryName });
          continue;
        }
        toCreate.push({
          name,
          price,
          CategoryId: category.id
        });
      }
      if (toCreate.length > 0) {
        await sequelize.transaction(async (t) => {
          await Product.bulkCreate(toCreate, { transaction: t });
        });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || null;
    const where = {};
    const products = await Product.findAll({
      where,
      include: { model: Category, as: 'category' },
      order: [['createdAt', 'DESC']],
      limit: limit || undefined,
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Products');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 25 }
    ];

    for (const p of products) {
      sheet.addRow({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category ? p.category.name : '',
        createdAt: p.createdAt
      });
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
