import { TransactionProps } from "~/components/statement/transaction-item";

export type ServiceResponse<T> = {
  message: string;
  result?: T;
};

export type TransactionType = "deposito" | "saque";

export type Type = "Credit" | "Debit";

// User service

export type CreateUserParams = {
  username: string;
  email: string;
  password: string;
};

export type CreateUserResponse = ServiceResponse<{
  id: string;
  username: string;
  email: string;
  password: string;
}>;

export type AuthUserParams = {
  email: string;
  password: string;
};

export type AuthUserResponse = ServiceResponse<{
  token: string;
}>;

// Account service
export type GetAccountParams = {
  token: string;
};

// TODO: Implementar os tipos "unknown" com os tipos corretos
export type GetAccountResponse = ServiceResponse<{
  account: unknown[];
  cards: unknown[];
  transactions: TransactionProps[];
}>;

export type CreateTransactionParams = {
  token: string;
  type: Type;
  value: number;
  from?: string;
  to?: string;
  anexo?: string;
};

export type CreateTransactionResponse = ServiceResponse<StatementResponse>;

export type GetStatementParams = {
  token: string;
};

// TODO: Implementar os tipos "unknown" com os tipos corretos
export type GetStatementResponse = ServiceResponse<{
  transactions: StatementResponse[];
}>;

type StatementResponse = {
  id: string;
  accountId: string;
  type: Type;
  value: number;
  date: string;
  from: string;
  to: string;
  anexo: string;
};
