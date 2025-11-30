import express from 'express';
import { 
  createProduct,
  getProductById,
  listProducts,
  bulkUpload,
  downloadReport,
  updateProduct,
  deleteProduct,
  upload
} from '../controllers/product.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js'; // import middleware

const router = express.Router();

router.post('/', verifyAuth, upload.single('image'), createProduct);
router.get('/', verifyAuth, listProducts);
router.get('/download-report', verifyAuth, downloadReport);
router.get('/:id', verifyAuth, getProductById);
router.put('/:id', verifyAuth, upload.single('image'), updateProduct);
router.delete('/:id', verifyAuth, deleteProduct);
router.post('/bulk-upload', verifyAuth, upload.single('file'), bulkUpload);

export default router;
