import { Router } from 'express';
import { Expense } from '../models/Expense.js';
import { auth, AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/summary', auth, async (req: AuthRequest, res) => {
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
  const start = new Date(month + '-01T00:00:00.000Z');
  const end = new Date(start); end.setMonth(end.getMonth() + 1);

  const current = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user!.id), date: { $gte: start, $lt: end } } },
    { $group: { _id: null, amount: { $sum: '$amount' } } }
  ]);
  const currentTotal = current[0]?.amount || 0;

  const prevStart = new Date(start); prevStart.setMonth(prevStart.getMonth() - 1);
  const prevEnd = new Date(start);
  const previous = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user!.id), date: { $gte: prevStart, $lt: prevEnd } } },
    { $group: { _id: null, amount: { $sum: '$amount' } } }
  ]);
  const prevTotal = previous[0]?.amount || 0;
  const percentChange = prevTotal === 0 ? 100 : ((currentTotal - prevTotal) / prevTotal) * 100;

  res.json({ month, totalExpenses: currentTotal, percentChange });
});

export default router;
