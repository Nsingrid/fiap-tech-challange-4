import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '~/lib/axios';
import { login, signup, logout } from '~/services/auth';
import type { AuthUserParams, CreateUserParams, AuthUserResponse, CreateUserResponse } from '~/types/services';

/**
 * Hook para fazer login
 */
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: AuthUserParams) => {
      const response = await login(credentials);
      return response;
    },
    onSuccess: (data: AuthUserResponse) => {
      if (data.result?.token) {
        // Token é armazenado em cookies automaticamente pelo backend
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
    },
  });
}

/**
 * Hook para fazer signup
 */
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateUserParams) => {
      const response = await signup(data);
      return response;
    },
    onSuccess: (data: CreateUserResponse) => {
      const result = data.result as { id?: string } | undefined;
      if (result?.id) {
        // Após signup bem-sucedido, redireciona para login
        router.push('/login?signup=success');
      }
    },
    onError: (error: Error) => {
      console.error('Signup error:', error);
    },
  });
}

/**
 * Hook para fazer logout
 */
export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: Error) => {
      console.error('Logout error:', error);
    },
  });
}

/**
 * Hook para obter dados da conta
 */
export function useAccount() {
  return useQuery({
    queryKey: ['account'],
    queryFn: async () => {
      const { data } = await api.get('/account');
      // A API retorna { message, result: { account, cards, transactions } }
      return data?.result?.account || null;
    },
    enabled: typeof window !== 'undefined', // Só executa no cliente
  });
}

/**
 * Hook para obter extrato (transações)
 */
export function useStatement() {
  return useQuery({
    queryKey: ['statement'],
    queryFn: async () => {
      const { data } = await api.get('/statement');
      // A API retorna { message, result: { transactions: [...] } }
      return data?.result?.transactions || [];
    },
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Hook para buscar categorias de transações
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/transactions/categories');
      const data = response.data?.result || response.data;
      return data as { credit: string[]; debit: string[] };
    },
    staleTime: 1000 * 60 * 30, // 30 minutos (categorias não mudam com frequência)
  });
}

/**
 * Hook para obter catálogo de investimentos
 */
export function useInvestmentCatalog() {
  return useQuery({
    queryKey: ['investment-catalog'],
    queryFn: async () => {
      const { data } = await api.get('/investments/catalog');
      
      // Retornar catálogo, com fallback vazio
      const result = data?.result || data;
      return Array.isArray(result) ? result : [];
    },
    staleTime: 1000 * 60 * 60, // 1 hora (dados estáticos)
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Hook para obter transações de investimentos
 */
export function useInvestmentTransactions() {
  return useQuery({
    queryKey: ['investment-transactions'],
    queryFn: async () => {
      const { data } = await api.get('/investments/transactions');
      const result = data?.result || {};
      return {
        transactions: Array.isArray(result.transactions) ? result.transactions : [],
        investmentSummary: Array.isArray(result.investmentSummary) ? result.investmentSummary : []
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: typeof window !== 'undefined',
  });
}

/**
 * Hook para criar transação
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      type: 'Credit' | 'Debit';
      value: number;
      category: string;
      investmentCategory?: string; // ID da categoria de investimento
      from?: string;
      to?: string;
      anexo?: string;
    }) => {
      const response = await api.post('/transactions', data);
      return response.data;
    },
    onSuccess: async () => {
      // Limpa cache do axios primeiro
      const { clearEndpointCache } = await import('~/lib/axios');
      await clearEndpointCache([
        '/account', 
        '/statement', 
        '/investments/transactions',
        '/investments/catalog'
      ]);
      
      // Invalida TODAS as queries relacionadas para refazer as requisições imediatamente
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['account'], refetchType: 'all' }), // Saldo da conta
        queryClient.invalidateQueries({ queryKey: ['statement'], refetchType: 'all' }), // Extrato
        queryClient.invalidateQueries({ queryKey: ['investment-transactions'], refetchType: 'all' }), // Transações de investimentos
        queryClient.invalidateQueries({ queryKey: ['investment-catalog'], refetchType: 'all' }), // Catálogo de investimentos
        queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' }), // Categorias
      ]);
      
      // Força refetch imediato de dados críticos
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['account'] }),
        queryClient.refetchQueries({ queryKey: ['statement'] }),
        queryClient.refetchQueries({ queryKey: ['investment-transactions'] }),
      ]);
      
      console.log('✅ Transação criada com sucesso! Cache limpo e dados atualizados.');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Create transaction error:', err.response?.data?.message || err.message);
    },
  });
}