export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: string;
  balance: bigint;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDTO {
  userId: string;
  accountNumber: string;
  accountType?: string;
  balance?: bigint;
}

export interface UpdateAccountDTO {
  accountType?: string;
  balance?: bigint;
}
