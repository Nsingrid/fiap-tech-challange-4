import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { accountRoutes } from './accountRoutes';
import { transactionRoutes } from './transactionRoutes';
import { investmentRoutes } from './investmentRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas principais
router.use('/', userRoutes);
router.use('/account', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/statement', transactionRoutes); // Alias para /transactions
router.use('/investments', investmentRoutes);

export { router };
