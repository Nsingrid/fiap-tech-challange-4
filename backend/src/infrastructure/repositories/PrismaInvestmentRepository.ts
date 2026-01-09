import { IInvestmentRepository } from '../../domain/repositories/IInvestmentRepository';
import { Investment, CreateInvestmentDTO } from '../../domain/entities/Investment';
import { prisma } from '../database/prisma';

export class PrismaInvestmentRepository implements IInvestmentRepository {
  async create(data: CreateInvestmentDTO): Promise<Investment> {
    const investment = await prisma.investment.create({
      data,
    });

    return investment;
  }

  async findById(id: string): Promise<Investment | null> {
    const investment = await prisma.investment.findUnique({
      where: { id },
    });

    return investment;
  }

  async findByAccountId(accountId: string): Promise<Investment[]> {
    const investments = await prisma.investment.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });

    return investments;
  }

  async delete(id: string): Promise<void> {
    await prisma.investment.delete({
      where: { id },
    });
  }
}
