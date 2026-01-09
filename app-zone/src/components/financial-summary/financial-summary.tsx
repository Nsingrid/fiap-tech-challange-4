"use client";
import { useState, useEffect } from "react";
import { useAccount } from "~/hooks/useQueries";
import { formatDateLong } from "~/utils/date";
import { formatCurrencyBRL } from "~/utils/currency";

export type FinancialSummaryProps = {
  username: string | null;
  date: number;
  onNewTransactionButtonClick?: () => void;
};

export const FinancialSummary = ({
  username,
  date,
  onNewTransactionButtonClick,
}: FinancialSummaryProps) => {
  const [mounted, setMounted] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const { data: account, isLoading } = useAccount();
  const total = account?.balance ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {username ? `Olá, ${username}! 👋` : `Olá! 👋`}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{formatDateLong(date)}</p>
      </div>

      {/* Balance Card */}
      <div className="bg-[#e8f5e9] rounded-2xl p-8 border border-[#c8e6c9]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Saldo Disponível</h3>
          <button 
            onClick={() => setHideBalance(!hideBalance)}
            className="p-2 hover:bg-[#c8e6c9] rounded-xl transition-colors"
            title={hideBalance ? "Mostrar saldo" : "Ocultar saldo"}
          >
            {hideBalance ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Balance Amount */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Conta Corrente</p>
          {!mounted || isLoading ? (
            <div className="h-12 w-48 bg-[#c8e6c9] rounded-lg animate-pulse" />
          ) : hideBalance ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#c8e6c9] rounded-lg" />
              <div className="w-20 h-12 bg-[#c8e6c9] rounded-lg" />
            </div>
          ) : (
            <p className="text-5xl font-bold tracking-tight text-gray-900">
              {formatCurrencyBRL(total)}
            </p>
          )}
        </div>

        {/* New Transaction Button */}
        {onNewTransactionButtonClick && (
          <button
            onClick={onNewTransactionButtonClick}
            className="w-full bg-gray-900 text-white font-medium py-4 px-6 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
          >
            <svg 
              className="w-5 h-5 group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            NOVA TRANSAÇÃO
          </button>
        )}
      </div>
    </div>
  );
};
