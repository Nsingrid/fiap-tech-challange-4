"use client";

export const HomeInsights = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Spending Card */}
          <div className="bg-[#f5f5f5] rounded-2xl p-6">
            <div className="bg-white rounded-xl p-5">
              <div className="text-xs text-gray-400 mb-1">Total gasto</div>
              <div className="text-3xl font-bold text-gray-900 mb-6">R$ 1.240,80</div>
              
              {/* Chart Bars */}
              <div className="flex items-end gap-3 h-32 mb-4">
                {[40, 65, 35, 80, 50, 45, 55].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t ${i === 3 ? 'bg-[#4caf50]' : 'bg-gray-200'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-400">
                      {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'][i]}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Budget Goal */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Orçamento</div>
                    <div className="text-xs text-gray-500">Meta mensal definida</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Domine seus gastos com insights
            </h2>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Categorização automática de transações</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Isso elimina a necessidade de registro manual, dando a você uma visão clara de para onde seu dinheiro está indo.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ferramentas de orçamento</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Você pode então acompanhar seu progresso em relação às suas metas e receber alertas quando estiver ultrapassando seus limites.
                </p>
              </div>
            </div>
            
            <button className="mt-8 text-gray-900 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all">
              EXPLORAR MAIS RECURSOS
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
