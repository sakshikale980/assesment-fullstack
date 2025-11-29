import cors from 'cors';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from './models/index.js';
import { verifyAuth } from './middlewares/verifyAuth.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';

const { User } = db;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome To Service!' });
});
db.sequelize.sync({ alter: true }).then(() => {
  console.log("📁 All Tables Synced");
});

app.post("/logIn", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
      { expiresIn: "48h", issuer: process.env.JWT_ISSUER }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.post("/", verifyAuth, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash: hashedPassword,
    });

    res.json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.use('/categories', verifyAuth, categoryRouter);
app.use('/products', verifyAuth, productRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export { app };
