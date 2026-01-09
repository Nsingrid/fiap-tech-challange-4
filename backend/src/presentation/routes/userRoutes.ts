import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authRateLimiter, createRateLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../../shared/validators/validationMiddleware';
import { CreateUserSchema, LoginSchema } from '../../shared/validators/schemas';

const router = Router();
const userController = new UserController();

// Rotas públicas com rate limiting e validação
router.post(
  '/users',
  createRateLimiter,
  validateRequest(CreateUserSchema),
  (req, res, next) => {
    userController.create(req, res).catch(next);
  },
);

router.post(
  '/auth/login',
  authRateLimiter,
  validateRequest(LoginSchema),
  (req, res, next) => {
    userController.login(req, res).catch(next);
  },
);

router.post('/auth/logout', (req, res, next) => {
  userController.logout(req, res).catch(next);
});

// Rotas administrativas (podem ser protegidas posteriormente)
router.get('/users', (req, res, next) => {
  userController.list(req, res).catch(next);
});

export { router as userRoutes };
