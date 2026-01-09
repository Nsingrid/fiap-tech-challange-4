/**
 * Central Exports - Facilitadores para importações
 */

// Services
export { authService } from './application/services/auth.service';
export { transactionService } from './application/services/transaction.service';

// Use Cases
export { AuthenticateUserUseCase } from './domain/usecases/authenticate-user.usecase';
export { GetUserTransactionsUseCase } from './domain/usecases/get-user-transactions.usecase';

// Repositories
export { authRepository } from './infrastructure/http/auth.repository';
export { transactionRepository } from './infrastructure/http/transaction.repository';

// Infrastructure
export { cryptoService } from './infrastructure/security/crypto.service';
export { reactiveState, useReactiveState } from './infrastructure/state/reactive-state.service';

// Utils
export { cacheService } from './utils/cache';

// Hooks
export { useObservable, useObservableWithLoading } from './hooks/useObservable';
export { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
