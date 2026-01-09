"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { SideMenu } from "~/components/side-menu/side-menu";
import { TransactionModal } from "~/components/transaction-modal/transaction-modal";
import { useInvestmentTransactions } from "~/hooks/useQueries";
import { formatCurrencyBRL } from "~/utils/currency";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type InvestmentCategory = {
  name: string;
  value: number;
  percentage: number;
  color: string;
  type: 'fixa' | 'variavel';
};

type InvestmentSummary = {
  total: number;
  totalPositivo: number;
  totalNegativo: number;
  rendaFixa: number;
  rendaVariavel: number;
  categories: InvestmentCategory[];
};
export const InvestmentMain = () => {
  const windowWidth = useWindowWidth();
  const { data, isLoading, error } = useInvestmentTransactions();
  const investmentSummaryData = data?.investmentSummary || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Processar sumário de investimentos da API
  const investmentSummary = useMemo((): InvestmentSummary => {
    if (!investmentSummaryData.length) {
      return {
        total: 0,
        totalPositivo: 0,
        totalNegativo: 0,
        rendaFixa: 0,
        rendaVariavel: 0,
        categories: [],
      };
    }

    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6', '#F97316', '#06B6D4'];
    let colorIndex = 0;
    let totalInvested = 0;
    let totalPositivo = 0;
    let totalNegativo = 0;

    // Converter sumário da API para formato do componente
    const categories: InvestmentCategory[] = investmentSummaryData
      .filter((item: { totalInvested: number }) => item.totalInvested !== 0)
      .map((item: { investmentType?: string; totalInvested: number }) => {
        const investmentType = item.investmentType || 'Outros';
        const value = item.totalInvested; // Já vem em centavos
        
        totalInvested += value;
        if (value > 0) {
          totalPositivo += value;
        } else if (value < 0) {
          totalNegativo += value;
        }

        // Determinar tipo baseado no nome do investimento
        const isRendaFixa = investmentType.toLowerCase().includes('tesouro') ||
                          investmentType.toLowerCase().includes('cdb') ||
                          investmentType.toLowerCase().includes('lci') ||
                          investmentType.toLowerCase().includes('lca') ||
                          investmentType.toLowerCase().includes('debênture') ||
                          investmentType.toLowerCase().includes('cri') ||
                          investmentType.toLowerCase().includes('cra');

        const category: InvestmentCategory = {
          name: investmentType,
          value: value,
          percentage: 0, // Será calculado depois
          color: colors[colorIndex % colors.length],
          type: isRendaFixa ? 'fixa' : 'variavel'
        };

        colorIndex++;
        return category;
      });

    // Calcular percentuais
    categories.forEach(cat => {
      cat.percentage = totalInvested > 0 ? (cat.value / totalInvested) * 100 : 0;
    });

    // Ordenar por valor (maior primeiro)
    categories.sort((a, b) => b.value - a.value);

    const rendaFixa = categories
      .filter(c => c.type === 'fixa')
      .reduce((sum, c) => sum + c.value, 0);

    const rendaVariavel = categories
      .filter(c => c.type === 'variavel')
      .reduce((sum, c) => sum + c.value, 0);

    return {
      total: totalInvested,
      totalPositivo,
      totalNegativo,
      rendaFixa,
      rendaVariavel,
      categories,
    };
  }, [investmentSummaryData]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut" as const,
      background: "transparent",
    },
    labels: investmentSummary.categories.map(c => c.name),
    colors: investmentSummary.categories.map(c => c.color),
    legend: {
      show: true,
      position: "bottom" as const,
      fontSize: "12px",
      fontFamily: "Inter, sans-serif",
      horizontalAlign: "center" as const,
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
      labels: {
        colors: "#374151",
      },
      markers: {
        size: 6,
        offsetX: -3,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              color: "#374151",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "Inter, sans-serif",
              color: "#111827",
              formatter: (val: string) => formatCurrencyBRL(parseFloat(val)),
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6B7280",
              formatter: () => formatCurrencyBRL(investmentSummary.total),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatCurrencyBRL(val),
      },
    },
  };

  // Estado de loading
  if (isLoading) {
    return (
      <main className="flex-1 p-6 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {windowWidth > 768 && <SideMenu />}
            <div className="flex-1">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-100 rounded-xl w-64"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-32 bg-gray-100 rounded-2xl"></div>
                  <div className="h-32 bg-gray-100 rounded-2xl"></div>
                  <div className="h-32 bg-gray-100 rounded-2xl"></div>
                </div>
                <div className="h-96 bg-gray-100 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <main className="flex-1 p-6 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {windowWidth > 768 && <SideMenu />}
            <div className="flex-1">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-xl font-semibold">Erro ao carregar investimentos</p>
                <p className="text-gray-500 text-sm mt-2">Tente novamente mais tarde</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const hasInvestments = investmentSummary.categories.length > 0;

  return (
    <>
      <main className="flex-1 p-4 md:p-6 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {windowWidth > 768 && <SideMenu />}
            
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Investimentos</h1>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Investido</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrencyBRL(investmentSummary.total)}</p>
                </div>
              </div>

              {!hasInvestments ? (
                /* Estado Vazio */
                <div className="bg-[#e8f5e9] rounded-2xl p-12 text-center border border-[#c8e6c9]">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-[#c8e6c9] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Comece a Investir</h2>
                    <p className="text-gray-600 mb-6">Você ainda não possui investimentos. Faça uma transação com categoria &ldquo;Investimentos&rdquo; para começar a construir seu portfólio.</p>
                    <button 
                      onClick={openModal}
                      className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-colors"
                    >
                      FAZER PRIMEIRO INVESTIMENTO
                    </button>
                  </div>
                </div>
              ) : (
              <>
                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total Líquido */}
                  <div className="bg-[#e8f5e9] rounded-2xl p-6 border border-[#c8e6c9]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Total Líquido</h3>
                      <div className="w-10 h-10 bg-[#c8e6c9] rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrencyBRL(investmentSummary.total)}</p>
                    <p className="text-xs text-gray-500">Saldo atual</p>
                  </div>

                  {/* Total Positivo */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Aplicações</h3>
                      <div className="w-10 h-10 bg-[#e8f5e9] rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-[#4caf50] mb-1">{formatCurrencyBRL(investmentSummary.totalPositivo)}</p>
                    <p className="text-xs text-gray-500">Valores investidos</p>
                  </div>

                  {/* Total Negativo */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Resgates</h3>
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-500 mb-1">{formatCurrencyBRL(investmentSummary.totalNegativo)}</p>
                    <p className="text-xs text-gray-500">Valores resgatados</p>
                  </div>

                </div>

                {/* Distribuição por Categoria */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Categoria</h2>
                  
                  {/* Gráfico */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-full max-w-md">
                      <Chart
                        options={chartOptions}
                        series={investmentSummary.categories.map(c => c.value)}
                        type="donut"
                        height={350}
                      />
                    </div>
                  </div>

                  {/* Lista de categorias */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {investmentSummary.categories.map((category, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{category.name}</p>
                            <p className="text-xs text-gray-500">{category.type === 'fixa' ? 'Renda Fixa' : 'Renda Variável'}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base font-bold text-gray-900">
                            {formatCurrencyBRL(category.value)}
                          </p>
                          <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dicas de Investimento */}
                <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#c8e6c9] rounded-xl">
                      <svg className="w-6 h-6 text-[#4caf50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Dica de Diversificação</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Manter um equilíbrio entre renda fixa e variável ajuda a reduzir riscos. 
                        Seu portfólio atual tem {((investmentSummary.rendaFixa / investmentSummary.total) * 100).toFixed(0)}% em renda fixa e {((investmentSummary.rendaVariavel / investmentSummary.total) * 100).toFixed(0)}% em renda variável.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>

    {/* Transaction Modal */}
    <TransactionModal open={isModalOpen} onClose={closeModal} />
  </>
  );
};
