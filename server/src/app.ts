import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expenses';
import categoryRoutes from './routes/categories';
import budgetRoutes from './routes/budgets';
import recurringRoutes from './routes/recurring';
import statsRoutes from './routes/stats';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/stats', statsRoutes);

// Global error handler (basic)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

(async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log(`[Server] Listening on port ${ENV.PORT}`));
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
})();
