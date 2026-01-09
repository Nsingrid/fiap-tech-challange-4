"use client";

export const HomeStats = () => {
  return (
    <section className="py-16 bg-[#e8f5e9] rounded-3xl">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Side - Quick and Easy */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rápido e fácil</h3>
            <p className="text-gray-500 text-sm mb-6">
              Sua jornada é simples, segura e sem fricção. Não é necessária uma conta bancária tradicional.
            </p>
            
            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-4">
              <div className="w-40 h-40 bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-5 gap-1">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className={`w-5 h-5 ${Math.random() > 0.5 ? 'bg-white' : 'bg-gray-900'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gray-900">●</span>
                ))}
              </div>
              <span>Nota 4.8/5, mais de 13.000 avaliações</span>
            </div>
          </div>

          {/* Right Side - Transaction Preview */}
          <div className="bg-[#c8e6c9] rounded-2xl p-6">
            <div className="bg-white rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">● BRL</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <span className="text-2xl font-semibold text-gray-900">R$ 5.000</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Para</span>
                  <span className="text-gray-900">221,20</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxa de transferência</span>
                  <span className="text-gray-900">R$ 0,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Valor total</span>
                  <span className="text-gray-900">R$ 5.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Data prevista</span>
                  <span className="text-gray-900">Hoje</span>
                </div>
              </div>
              
              <button className="w-full mt-4 py-3 bg-[#4caf50] text-white rounded-lg font-medium text-sm hover:bg-[#43a047] transition-colors">
                CONTINUAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
