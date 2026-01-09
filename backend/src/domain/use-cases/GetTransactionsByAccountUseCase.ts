import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { IAccountRepository } from '../repositories/IAccountRepository';
import { Transaction } from '../entities/Transaction';
import { AppError } from '../../shared/errors/AppError';

export class GetTransactionsByAccountUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(accountId: string): Promise<Transaction[]> {
    // Verificar se a conta existe
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }

    const transactions = await this.transactionRepository.findByAccountId(accountId);
    return transactions;
  }
}
