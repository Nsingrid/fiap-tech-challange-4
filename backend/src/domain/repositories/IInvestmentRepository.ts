import { Investment, CreateInvestmentDTO } from '../entities/Investment';

export interface IInvestmentRepository {
  create(data: CreateInvestmentDTO): Promise<Investment>;
  findById(id: string): Promise<Investment | null>;
  findByAccountId(accountId: string): Promise<Investment[]>;
  delete(id: string): Promise<void>;
}
