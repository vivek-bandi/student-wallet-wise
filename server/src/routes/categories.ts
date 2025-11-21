import { Router } from 'express';
import { Category } from '../models/Category.js';
import { auth, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';
import mongoose from 'mongoose';

const router = Router();

const categorySchema = z.object({ name: z.string().min(1) });

router.post('/', auth, async (req: AuthRequest, res) => {
  const parse = categorySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const existing = await Category.findOne({ userId: req.user!.id, name: parse.data.name });
  if (existing) return res.status(409).json({ message: 'Category exists' });
  const category = await Category.create({ userId: new mongoose.Types.ObjectId(req.user!.id), name: parse.data.name });
  res.status(201).json(category);
});

router.get('/', auth, async (req: AuthRequest, res) => {
  const cats = await Category.find({ userId: req.user!.id }).sort({ name: 1 });
  res.json(cats);
});

router.delete('/:id', auth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  await Category.deleteOne({ _id: id, userId: req.user!.id });
  res.status(204).send();
});

export default router;
