import { useState, useEffect } from "react";
import { useStatement } from "~/hooks/useQueries";
import { TransactionItem, TransactionProps } from "./transaction-item";
import { SkeletonTransaction } from "~/components/skeletons";

export const Statement = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last3');
  const { data: transactions = [], isLoading, error } = useStatement();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filterTransactionsByPeriod = (transactions: TransactionProps[]) => {
    if (selectedPeriod === 'all') return transactions;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      const transDate = new Date(transaction.date);
      
      if (selectedPeriod === 'current') {
        const transMonth = transDate.getMonth();
        const transYear = transDate.getFullYear();
        return transMonth === currentMonth && transYear === currentYear;
      }
      if (selectedPeriod === 'last3') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return transDate >= threeMonthsAgo;
      }
      if (selectedPeriod === 'last6') {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return transDate >= sixMonthsAgo;
      }
      return true;
    });
  };

  const groupTransactionsByMonth = (transactions: TransactionProps[]) => {
    return transactions.reduce(
      (acc, transaction) => {
        const month = new Date(transaction.date).toLocaleString("pt-BR", {
          month: "long",
          year: "numeric",
        });

        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(transaction);

        return acc;
      },
      {} as Record<string, TransactionProps[]>,
    );
  };

  const filteredTransactions = filterTransactionsByPeriod(transactions);
  const groupedTransactions = groupTransactionsByMonth(filteredTransactions);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Extrato</h2>
            <div className="flex gap-1 bg-gray-50 rounded-full p-1">
              <button
                onClick={() => setSelectedPeriod('current')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === 'current'
                    ? 'bg-[#e8f5e9] text-[#4caf50]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Atual
              </button>
              <button
                onClick={() => setSelectedPeriod('last3')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === 'last3'
                    ? 'bg-[#e8f5e9] text-[#4caf50]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                3M
              </button>
              <button
                onClick={() => setSelectedPeriod('last6')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === 'last6'
                    ? 'bg-[#e8f5e9] text-[#4caf50]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setSelectedPeriod('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === 'all'
                    ? 'bg-[#e8f5e9] text-[#4caf50]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Tudo
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {!mounted ? (
            <div />
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <SkeletonTransaction key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Erro ao carregar extrato</p>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium text-lg">Nenhuma transação encontrada</p>
              <p className="text-gray-500 text-sm mt-2">Suas transações aparecerão aqui</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium text-lg">Nenhuma transação neste período</p>
              <p className="text-gray-500 text-sm mt-2">
                {selectedPeriod === 'current' && 'Não há transações no mês atual'}
                {selectedPeriod === 'last3' && 'Não há transações nos últimos 3 meses'}
                {selectedPeriod === 'last6' && 'Não há transações nos últimos 6 meses'}
                {selectedPeriod === 'all' && 'Não há transações para exibir'}
              </p>
              <button
                onClick={() => setSelectedPeriod('all')}
                className="mt-4 px-4 py-2 text-sm font-medium text-[#4caf50] hover:bg-[#e8f5e9] rounded-full transition-colors"
              >
                Ver todas as transações
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedTransactions).map(([month, monthTransactions]) => {
                const total = monthTransactions.reduce((sum, t) => {
                  const isCredit = t.type === 'Credit' || t.transactionType === 'deposito';
                  return sum + (isCredit ? t.value : -t.value);
                }, 0);
                
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-2 px-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase">
                          {month}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {monthTransactions.length}
                        </span>
                      </div>
                      <div className={`text-xs font-semibold ${
                        total >= 0 ? 'text-[#4caf50]' : 'text-red-500'
                      }`}>
                        {total >= 0 ? '+' : ''} {(total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      {monthTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} {...transaction} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
