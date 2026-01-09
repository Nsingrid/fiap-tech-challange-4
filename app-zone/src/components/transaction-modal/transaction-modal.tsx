"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/button/button";
import { Dropdown } from "~/components/dropdown/dropdown";
import { MoneyInput } from "~/components/money-input/money-input";
import { InvestmentSelector, type InvestmentItem } from "~/components/investment-selector/investment-selector";
import { useCreateTransaction, useCategories, useInvestmentCatalog } from "~/hooks/useQueries";
import type { DropdownOption } from "~/models/dropdown-option.model";
import { TransactionType } from "~/types/services";

const dropdownOptions: DropdownOption[] = [
  { label: "Depósito", value: "deposito", selected: false },
  { label: "Saque", value: "saque", selected: false },
];

const transactionTypeMap: Record<string, 'Credit' | 'Debit'> = {
  deposito: 'Credit',
  saque: 'Debit',
};

export type TransactionModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export const TransactionModal = ({ open, onClose }: TransactionModalProps) => {
  const queryClient = useQueryClient();
  const createTransactionMutation = useCreateTransaction();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: investmentCatalog, isLoading: loadingInvestments } = useInvestmentCatalog();

  const [currentTransactionType, setCurrentTransactionType] =
    useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentItem | null>(null);
  const [moneyValue, setMoneyValue] = useState("0,00");
  const [error, setError] = useState<string | null>(null);

  const handleMoneyChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, "");
    
    // Pad com zeros à esquerda se necessário
    if (value.length === 0) {
      setMoneyValue("0,00");
      return;
    }
    
    // Garantir pelo menos 3 dígitos (centavos + 1 real)
    while (value.length < 3) {
      value = "0" + value;
    }
    
    // Formatar: 1000 -> 10,00 | 100000 -> 1.000,00
    const numberValue = parseFloat(value) / 100;
    const formatted = numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    setMoneyValue(formatted);
    setError(null);
  };

  const handleSubmitTransaction = async () => {
    if (!currentTransactionType) {
      setError("Selecione um tipo de transação");
      return;
    }

    if (!selectedCategory) {
      setError("Selecione uma categoria");
      return;
    }

    // Se categoria é "Investimentos", exigir seleção de tipo de investimento
    if (selectedCategory === "Investimentos" && !selectedInvestment) {
      setError("Selecione o tipo de investimento");
      return;
    }

    // Remover milhar (.) e converter vírgula (,) para ponto
    const cleanValue = moneyValue.replace(/\./g, '').replace(',', '.');
    const valueInCents = Math.round(parseFloat(cleanValue) * 100);

    if (valueInCents <= 0) {
      setError("Digite um valor válido");
      return;
    }

    try {
      // Preparar payload
      const payload: any = {
        type: transactionTypeMap[currentTransactionType] || 'Credit',
        value: valueInCents,
        category: selectedCategory,
      };

      // Se há investimento selecionado, adicionar investmentCategory com o código/ID
      if (selectedInvestment) {
        payload.investmentCategory = selectedInvestment.code;
      }
      
      await createTransactionMutation.mutateAsync(payload);

      // Invalidate queries para atualizar saldo e extrato
      queryClient.invalidateQueries({ queryKey: ['statement'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });

      setMoneyValue("0,00");
      setCurrentTransactionType(null);
      setSelectedCategory(null);
      setSelectedInvestment(null);
      setError(null);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar transação"
      );
    }
  };

  const loading = createTransactionMutation.isPending;

  // Filtrar categorias baseado no tipo de transação
  const getCategoriesForType = () => {
    if (!categories || !currentTransactionType) return [];
    
    const type = transactionTypeMap[currentTransactionType]; // 'Credit' ou 'Debit'
    const categoryKey = type.toLowerCase() as 'credit' | 'debit'; // Converter para lowercase
    const categoryList = categories[categoryKey];
    
    return categoryList || [];
  };

  const availableCategories = getCategoriesForType();
  const isInvestmentCategory = selectedCategory === "Investimentos";

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[8000]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[8500] w-full max-w-2xl p-0 m-0"
        style={{ maxHeight: '90vh' }}
      >
        <div className="bg-white p-8 rounded-2xl shadow-2xl overflow-y-auto relative" style={{ maxHeight: '90vh' }}>
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 z-10"
            onClick={onClose}
            aria-label="Fechar modal"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nova Transação</h2>
            <p className="text-sm text-gray-600 mt-1">Preencha os dados para registrar uma nova transação</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {createTransactionMutation.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              {String((createTransactionMutation.error as Error).message || 'Erro ao criar transação')}
            </div>
          ) : null}

          <div className="space-y-6">
            {/* Tipo de Transação */}
            <Dropdown
              label="Tipo de transação"
              options={dropdownOptions}
            onSelect={({ value }) => {
              setCurrentTransactionType(value);
              setSelectedCategory(null);
              setSelectedInvestment(null);
              setError(null);
            }}
            disabled={loading}
          />

          {/* Categoria */}
          {currentTransactionType && (
            loadingCategories ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            ) : availableCategories.length > 0 ? (
              <Dropdown
                label="Categoria"
                options={availableCategories.map(cat => ({
                  label: cat,
                  value: cat,
                  selected: false
                }))}
                onSelect={({ value }) => {
                  setSelectedCategory(value);
                  setSelectedInvestment(null); // Reset investment ao mudar categoria
                  setError(null);
                }}
                disabled={loading}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                  Nenhuma categoria disponível
                </div>
              </div>
            )
          )}

          {/* Seletor de Investimentos (condicional) */}
          {isInvestmentCategory && (
            loadingInvestments ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Tipo de Investimento</label>
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            ) : investmentCatalog && investmentCatalog.length > 0 ? (
              <InvestmentSelector
                label="Tipo de Investimento"
                categories={investmentCatalog}
                onSelect={(investment, categoryId) => {
                  setSelectedInvestment(investment);
                  setError(null);
                }}
                disabled={loading}
                selected={selectedInvestment}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Tipo de Investimento</label>
                <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                  Catálogo de investimentos não disponível
                </div>
              </div>
            )
          )}

          {/* Informações do Investimento Selecionado */}
          {selectedInvestment && (
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{selectedInvestment.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{selectedInvestment.description}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs px-2 py-1 bg-white rounded border border-gray-200">
                      <span className="text-gray-500">Risco:</span> <span className="font-medium">{selectedInvestment.riskLevel}</span>
                    </span>
                    <span className="text-xs px-2 py-1 bg-white rounded border border-gray-200">
                      <span className="text-gray-500">Liquidez:</span> <span className="font-medium">{selectedInvestment.liquidity}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Valor */}
          <MoneyInput 
            value={moneyValue} 
            onChange={handleMoneyChange}
            disabled={loading}
          />
          
          {/* Botão de Submit */}
          <button
            onClick={handleSubmitTransaction}
            disabled={
              loading || 
              !currentTransactionType || 
              !selectedCategory || 
              (isInvestmentCategory && !selectedInvestment) ||
              moneyValue === "0,00"
            }
            className="w-full bg-primary-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              "Concluir transação"
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
