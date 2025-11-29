
import { Router } from 'express';

import {
    addCategory,
    getCategories,
    updateCategories

} from '../controllers/categoryController.js';

const categoryRouter = Router();

categoryRouter.post('/', addCategory);
categoryRouter.get('/', getCategories);
categoryRouter.put('/:id', updateCategories);

export default categoryRouter;
