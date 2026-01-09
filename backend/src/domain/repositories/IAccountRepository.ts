import { Account, CreateAccountDTO, UpdateAccountDTO } from '../entities/Account';

export interface IAccountRepository {
  create(data: CreateAccountDTO): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account | null>;
  findByAccountNumber(accountNumber: string): Promise<Account | null>;
  update(id: string, data: UpdateAccountDTO): Promise<Account>;
  updateBalance(id: string, balance: bigint): Promise<Account>;
  delete(id: string): Promise<void>;
}
