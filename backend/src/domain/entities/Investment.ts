export interface Investment {
  id: string;
  accountId: string;
  type: string;
  category: string;
  value: bigint;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvestmentDTO {
  accountId: string;
  type: string;
  category: string;
  value: bigint;
}
