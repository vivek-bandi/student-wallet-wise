import { Router, Response } from 'express';
import { RecurringExpense } from '../models/RecurringExpense';
import { Expense } from '../models/Expense';
import { auth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import mongoose from 'mongoose';

const router = Router();

const createSchema = z.object({
  description: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  interval: z.enum(['daily','weekly','monthly']),
  startDate: z.string().refine(v => !isNaN(Date.parse(v)))
});

router.post('/', auth, async (req: AuthRequest, res: Response) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { description, category, amount, interval, startDate } = parse.data;
  const nextRun = new Date(startDate);
  const recurring = await RecurringExpense.create({
    userId: new mongoose.Types.ObjectId(req.user!.id),
    description, category, amount, interval, startDate: new Date(startDate), nextRun
  });
  res.status(201).json(recurring);
});

router.get('/', auth, async (req: AuthRequest, res: Response) => {
  const items = await RecurringExpense.find({ userId: req.user!.id });
  res.json(items);
});

router.put('/:id/toggle', auth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const item = await RecurringExpense.findOne({ _id: id, userId: req.user!.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.active = !item.active; await item.save();
  res.json(item);
});

// Simple runner (manual trigger)
router.post('/run', auth, async (req: AuthRequest, res: Response) => {
  const now = new Date();
  const due = await RecurringExpense.find({ userId: req.user!.id, active: true, nextRun: { $lte: now } });
  const created: any[] = [];
  for (const r of due) {
    created.push(await Expense.create({
      userId: r.userId,
      description: r.description,
      category: r.category,
      amount: r.amount,
      date: now
    }));
    // schedule next
    const next = new Date(r.nextRun);
    if (r.interval === 'daily') next.setDate(next.getDate() + 1);
    else if (r.interval === 'weekly') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    r.nextRun = next; await r.save();
  }
  res.json({ createdCount: created.length, created });
});

export default router;
