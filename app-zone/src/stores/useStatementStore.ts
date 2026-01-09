import { create } from "zustand";
import { TransactionProps } from "~/components/statement/transaction-item";
import type {
  CreateTransactionResponse,
  GetStatementResponse,
  TransactionType,
  Type,
} from "~/types/services";

const transactionTypeToApiType: Record<TransactionType, Type> = {
  deposito: "Credit",
  saque: "Debit",
};

const apiTypeToTransactionType: Record<Type, TransactionType> = {
  Credit: "deposito",
  Debit: "saque",
};

const calculateTotal = (transactions: TransactionProps[]) =>
  transactions.reduce((accum, { value }) => {
    return accum + value;
  }, 0);

type AddTransactionParams = Readonly<{
  transactionType: TransactionType;
  value: number; // em centavos
}>;

type Store = {
  transactions: Array<TransactionProps>;
  total: number;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  getTransactions: () => Promise<void>;
  addTransaction: (params: AddTransactionParams) => Promise<void>;
  removeTransaction: (id: string) => void;
  updateTransaction: (
    id: string,
    updatedData: Partial<TransactionProps>,
  ) => void;
  clearError: () => void;
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const useStatementStore = create<Store>((set, get) => ({
  transactions: [],
  total: 0,
  loading: false,
  error: null,
  lastFetch: null,

  getTransactions: async () => {
    const { loading, lastFetch } = get();
    
    // Avoid simultaneous requests and respect cache
    if (loading) return;
    if (lastFetch && Date.now() - lastFetch < CACHE_DURATION) return;

    set({ loading: true, error: null });
    
    try {
      // Chama a nova API Route local
      const response = await fetch("/statement");

      if (!response.ok) {
        throw new Error("Falha ao buscar transações via API Route");
      }

      const data: GetStatementResponse = await response.json();
      data.result = data.result || { transactions: [] };

      const formattedTransactions: TransactionProps[] =
        data.result.transactions.map((transaction) => ({
          id: transaction.id,
          date: transaction.date,
          transactionType: apiTypeToTransactionType[transaction.type],
          value: transaction.value,
          accountId: transaction.accountId,
        }));

      set({
        transactions: formattedTransactions,
        total: calculateTotal(formattedTransactions),
        loading: false,
        lastFetch: Date.now(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      set({ 
        error: errorMessage, 
        loading: false,
      });
      console.error("Falha ao buscar transações:", error);
    }
  },

  addTransaction: async ({ transactionType, value }) => {
    set({ loading: true, error: null });
    
    try {
      const type = transactionTypeToApiType[transactionType];
      const response = await fetch("/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value }),
      });

      if (!response.ok) throw new Error("Falha ao criar transação");

      const data: CreateTransactionResponse = await response.json();

      if (!data || !data.result) {
        throw new Error("Resposta inválida do backend");
      }

      const newTransaction: TransactionProps = {
        id: data.result.id,
        date: data.result.date,
        transactionType: apiTypeToTransactionType[data.result.type],
        value: data.result.value,
      };

      set((state) => {
        const newTransactions = [...state.transactions, newTransaction];
        return {
          transactions: newTransactions,
          total: calculateTotal(newTransactions),
          loading: false,
        };
      });
      
      // Invalida cache para forçar atualização de todas as queries
      const { clearEndpointCache } = await import('~/lib/axios');
      await clearEndpointCache([
        '/account', 
        '/statement', 
        '/investments/transactions',
        '/investments/catalog'
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar transação";
      set({ 
        error: errorMessage, 
        loading: false,
      });
      console.error("Falha ao adicionar transação:", error);
      throw error;
    }
  },

  removeTransaction: (id) =>
    set((state) => {
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      return {
        transactions: newTransactions,
        total: calculateTotal(newTransactions),
      };
    }),

  updateTransaction: (id, updatedData) =>
    set((state) => {
      const newTransactions = state.transactions.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item,
      );
      return {
        transactions: newTransactions,
        total: calculateTotal(newTransactions),
      };
    }),

  clearError: () => set({ error: null }),
}));

export default useStatementStore;
