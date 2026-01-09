import { IAccountRepository } from '../repositories/IAccountRepository';
import { Account } from '../entities/Account';
import { AppError } from '../../shared/errors/AppError';

export class GetAccountByUserIdUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(userId: string): Promise<Account> {
    const account = await this.accountRepository.findByUserId(userId);
    
    if (!account) {
      throw new AppError('Account not found', 404);
    }

    return account;
  }
}
