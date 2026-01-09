import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { Account, CreateAccountDTO, UpdateAccountDTO } from '../../domain/entities/Account';
import { prisma } from '../database/prisma';

export class PrismaAccountRepository implements IAccountRepository {
  async create(data: CreateAccountDTO): Promise<Account> {
    const account = await prisma.account.create({
      data,
    });

    return account;
  }

  async findById(id: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    return account;
  }

  async findByUserId(userId: string): Promise<Account | null> {
    const account = await prisma.account.findFirst({
      where: { userId },
    });

    return account;
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
    });

    return account;
  }

  async update(id: string, data: UpdateAccountDTO): Promise<Account> {
    const account = await prisma.account.update({
      where: { id },
      data,
    });

    return account;
  }

  async updateBalance(id: string, balance: bigint): Promise<Account> {
    const account = await prisma.account.update({
      where: { id },
      data: { balance },
    });

    return account;
  }

  async delete(id: string): Promise<void> {
    await prisma.account.delete({
      where: { id },
    });
  }
}
