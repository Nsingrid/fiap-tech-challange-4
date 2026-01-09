"use client";

export const HomeCard = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Obtenha um cartão de débito Mastercard, aceito em todo o mundo
              </h2>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Escolha um novo e elegante cartão Mastercard na cor de sua escolha para usar com sua conta bancária - Classic, Sand, Premium, Navy ou Slate. Aproveite 4 saques ATM sem tarifas todo mês.
              </p>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Faça pagamentos mobile e comece a gastar antes que seu cartão físico chegue.
              </p>
              
              <button className="text-gray-900 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all">
                SOLICITAR SEU CARTÃO
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Right - Card Image */}
            <div className="relative flex justify-center">
              <div className="relative">
                {/* Back Card */}
                <div className="w-64 h-40 bg-gradient-to-br from-[#81c784] to-[#4caf50] rounded-2xl p-5 transform rotate-6 absolute top-4 left-4">
                  <div className="flex justify-between items-start">
                    <div className="text-white font-bold text-sm">bytebank</div>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <div className="text-white/80 text-xs">**** **** **** 1234</div>
                  </div>
                  <div className="absolute bottom-5 right-5">
                    <div className="w-8 h-6 flex">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2"></div>
                    </div>
                  </div>
                </div>
                
                {/* Front Card */}
                <div className="w-64 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="text-white font-bold text-sm">bytebank</div>
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <div className="text-white/80 text-xs">**** **** **** 5678</div>
                  </div>
                  <div className="absolute bottom-5 right-5">
                    <div className="w-8 h-6 flex">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
