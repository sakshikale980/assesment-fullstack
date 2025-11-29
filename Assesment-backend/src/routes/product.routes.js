
import { Router } from 'express';

import {
    handleGetProducts,
    handleAddProduct,
    uploadBulkProducts,
    downloadProductReport,
    handleUpdateProduct
} from '../controllers/productController.js';

import multer from 'multer';
const upload = multer({ dest: "uploads/" });

const productRouter = Router();

productRouter.post("/bulk-upload", upload.single("file"), uploadBulkProducts);
productRouter.get("/report/download", downloadProductReport);
productRouter.get('/', handleGetProducts);
productRouter.post('/', handleAddProduct);
productRouter.put('/:id', handleUpdateProduct);

export default productRouter;
