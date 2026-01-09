import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createRateLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../../shared/validators/validationMiddleware';
import { CreateTransactionSchema } from '../../shared/validators/schemas';

const router = Router();
const transactionController = new TransactionController();

// Rota pública para obter categorias (com cache)
router.get('/categories', (req, res, next) => {
  transactionController.getCategories(req, res).catch(next);
});

// Todas as outras rotas de transação requerem autenticação
router.use(authMiddleware);

router.post(
  '/',
  createRateLimiter,
  validateRequest(CreateTransactionSchema),
  (req, res, next) => {
    transactionController.create(req, res).catch(next);
  },
);

router.get('/', (req, res, next) => {
  transactionController.listByAccount(req, res).catch(next);
});

export { router as transactionRoutes };
