import express from 'express';
import {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/auth.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.get('/users', verifyAuth, getAllUsers);
router.get('/users/:id', verifyAuth, getUserById);
router.put('/users/:id', verifyAuth, updateUser);
router.delete('/users/:id', verifyAuth, deleteUser);

export default router;
