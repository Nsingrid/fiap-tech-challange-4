import { Router } from 'express';
import { InvestmentController } from '../controllers/InvestmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const investmentController = new InvestmentController();

// Rota pública para obter o catálogo de investimentos
router.get('/catalog', (req, res, next) => {
  investmentController.getCatalog(req, res).catch(next);
});

// Rota autenticada para obter transações de investimentos
router.use(authMiddleware);

router.get('/transactions', (req, res, next) => {
  investmentController.getInvestmentTransactions(req, res).catch(next);
});

export { router as investmentRoutes };
