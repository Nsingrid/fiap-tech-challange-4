import { Response } from 'express';
import { GetAccountByUserIdUseCase } from '../../domain/use-cases/GetAccountByUserIdUseCase';
import { PrismaAccountRepository } from '../../infrastructure/repositories/PrismaAccountRepository';
import { PrismaTransactionRepository } from '../../infrastructure/repositories/PrismaTransactionRepository';
import { ServiceResponse } from '../../shared/types/ServiceResponse';
import { AuthRequest } from '../middlewares/authMiddleware';

const accountRepository = new PrismaAccountRepository();
const transactionRepository = new PrismaTransactionRepository();

export class AccountController {
  async getAccount(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.userId!;

    const getAccountUseCase = new GetAccountByUserIdUseCase(accountRepository);
    const account = await getAccountUseCase.execute(userId);

    // Buscar transações da conta
    const transactions = await transactionRepository.findByAccountId(account.id);

    const response: ServiceResponse = {
      message: 'Account retrieved successfully',
      result: {
        account: {
          id: account.id,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          balance: Number(account.balance),
        },
        cards: [], // Implementar se necessário
        transactions: transactions.map((t) => ({
          id: t.id,
          accountId: t.accountId,
          type: t.type,
          value: Number(t.value),
          date: t.date,
          category: t.category,
        })),
      },
    };

    return res.json(response);
  }
}
