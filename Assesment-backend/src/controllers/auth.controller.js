import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'User added successfully',
      userId: user.id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
      { expiresIn: '1d' }
    );
    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'userName', 'email', 'createdAt'],
      offset: (page - 1) * limit,
      limit,
      order: [['createdAt', 'DESC']],
    });
    const totalPages = Math.ceil(count / limit);
    res.json({
      count,
      totalPages,
      rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'userName', 'email', 'createdAt'],
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({
      message: 'User updated successfully',
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
