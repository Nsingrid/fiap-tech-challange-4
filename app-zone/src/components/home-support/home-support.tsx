"use client";

export const HomeSupport = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Suporte ao cliente via chat e telefone
              </h2>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Seja para relatar um problema ou apenas ter uma dúvida sobre sua conta bancária, seja o que for, nossa equipe de Suporte ao Cliente estará sempre pronta para ajudá-lo em Português, Inglês e Espanhol.
              </p>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Simplesmente fale com nossos especialistas diretamente no aplicativo, visite o Centro de Suporte ByteBank para respostas rápidas às suas perguntas, ou agende uma ligação no horário reservado para clientes premium.
              </p>
              
              <button className="text-gray-900 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all">
                CENTRO DE SUPORTE
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Right - Chat Preview */}
            <div className="flex justify-center">
              <div className="bg-[#f5f5f5] rounded-2xl p-6 max-w-sm w-full">
                {/* Chat Messages */}
                <div className="space-y-4 mb-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-[#e8f5e9] rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-gray-900">
                        Olá, estou tendo um problema com meu extrato recente.
                      </p>
                    </div>
                  </div>
                  
                  {/* Support Message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#4caf50] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Bytebank Help</div>
                      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3">
                        <p className="text-sm text-gray-900">
                          Oi! Estou aqui para ajudar. Sou Sara. Você poderia me contar um pouco mais sobre o problema?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Input */}
                <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem..." 
                    className="flex-1 text-sm outline-none"
                  />
                  <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
