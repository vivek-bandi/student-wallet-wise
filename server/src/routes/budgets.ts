import { Router } from 'express';
import { Budget } from '../models/Budget';
import { Expense } from '../models/Expense';
import { auth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import mongoose from 'mongoose';

const router = Router();

const setSchema = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/), amount: z.number().positive() });

router.put('/', auth, async (req: AuthRequest, res) => {
  const parse = setSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { month, amount } = parse.data;
  const budget = await Budget.findOneAndUpdate(
    { userId: req.user!.id, month },
    { amount },
    { upsert: true, new: true }
  );
  res.json(budget);
});

router.get('/:month', auth, async (req: AuthRequest, res) => {
  const { month } = req.params;
  const budget = await Budget.findOne({ userId: req.user!.id, month });
  // compute spend
  const start = new Date(month + '-01T00:00:00.000Z');
  const end = new Date(start); end.setMonth(end.getMonth() + 1);
  const total = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user!.id), date: { $gte: start, $lt: end } } },
    { $group: { _id: null, amount: { $sum: '$amount' } } }
  ]);
  const spent = total[0]?.amount || 0;
  res.json({ month, budget: budget?.amount || 0, spent, remaining: (budget?.amount || 0) - spent });
});

export default router;
