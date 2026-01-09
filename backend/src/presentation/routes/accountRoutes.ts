import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const accountController = new AccountController();

// Todas as rotas de conta requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res, next) => {
  accountController.getAccount(req, res).catch(next);
});

export { router as accountRoutes };
