import { api } from '~/lib/axios';
import type {
  CreateTransactionParams,
  CreateTransactionResponse,
  GetAccountParams,
  GetAccountResponse,
  GetStatementParams,
  GetStatementResponse,
} from "~/types/services";

export const getAccount = async ({ token }: GetAccountParams) => {
  const { data } = await api.get<GetAccountResponse>('/account', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const createTransaction = async ({
  token,
  ...params
}: CreateTransactionParams) => {
  const { data } = await api.post<CreateTransactionResponse>(
    '/transactions',
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const getStatement = async ({ token }: GetStatementParams) => {
  const { data } = await api.get<GetStatementResponse>('/statement', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
