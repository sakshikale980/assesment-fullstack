import express from 'express';
import { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory,
  getCategoryById 
} from '../controllers/category.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js'; 

const router = express.Router();
router.post('/', verifyAuth, createCategory);
router.get('/', verifyAuth, getCategories);
router.get('/:id', verifyAuth, getCategoryById);
router.put('/:id', verifyAuth, updateCategory);
router.delete('/:id', verifyAuth, deleteCategory);

export default router;
