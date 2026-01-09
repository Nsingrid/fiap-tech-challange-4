import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { IAccountRepository } from '../repositories/IAccountRepository';
import { Transaction, CreateTransactionDTO, TransactionType } from '../entities/Transaction';
import { AppError } from '../../shared/errors/AppError';

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(data: CreateTransactionDTO): Promise<Transaction> {
    // Verificar se a conta existe
    const account = await this.accountRepository.findById(data.accountId);
    if (!account) {
      throw new AppError('Account not found', 404);
    }

    // Criar transação (permite saldo negativo - sistema de controle de gastos)
    const transaction = await this.transactionRepository.create(data);

    // Atualizar saldo da conta
    let newBalance: bigint;
    if (data.type === TransactionType.Credit) {
      newBalance = account.balance + data.value;
    } else {
      newBalance = account.balance - data.value;
    }

    await this.accountRepository.updateBalance(data.accountId, newBalance);

    return transaction;
  }
}
