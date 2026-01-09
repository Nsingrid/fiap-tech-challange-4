'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // Criar instância no estado para evitar recriação em cada render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados frescos
            gcTime: 10 * 60 * 1000, // 10 minutos - tempo no cache após não usado
            retry: 2, // Tentar 2 vezes antes de falhar
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false, // Não refazer ao focar janela (economia de requisições)
            refetchOnReconnect: true, // Refazer ao reconectar
            refetchOnMount: false, // Não refazer se dados ainda estão frescos
          },
          mutations: {
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            onError: (error) => {
              // Log centralizado de erros de mutations
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
