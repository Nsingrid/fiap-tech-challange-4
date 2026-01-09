export const HomeHighlight = () => {
  const highlights = [
    {
      title: "Gerencie suas contas",
      text: "Nosso aplicativo se integra perfeitamente com suas contas bancárias, permitindo que você acesse todas as suas informações financeiras em um só lugar.",
      icon: "📋"
    },
    {
      title: "Seguro e confiável",
      text: "Entendemos a importância da segurança quando se trata de suas finanças. Nosso aplicativo emprega criptografia robusta.",
      icon: "🔒"
    },
    {
      title: "Suporte multi-dispositivo",
      text: "Entrega através de múltiplos canais, incluindo mobile, tablet e desktop.",
      icon: "💻"
    },
    {
      title: "Sem malabarismo de apps",
      text: "Sem troca de aplicativos ou etapas de inserção de pagamento. Comece e termine no mesmo lugar.",
      icon: "📱"
    },
    {
      title: "Pagamentos econômicos",
      text: "Diga adeus às altas taxas de cartão. Nós ajudamos a definir pagamentos sem atrito e econômicos.",
      icon: "💳"
    },
  ];

  return (
    <section className="py-20 bg-gray-900 rounded-3xl">
      <div className="container mx-auto px-8 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comece sua jornada para a liberdade financeira
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
          {highlights.map((item, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="w-10 h-10 bg-[#4caf50]/20 rounded-xl flex items-center justify-center mb-4 text-xl">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-400 text-sm mb-8 max-w-2xl mx-auto">
          O ByteBank utiliza totalmente os padrões Open Banking pelo mundo, desbloqueando experiências de pagamento inovadoras e jornadas de pagamento positivas para os clientes.
        </p>
        
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors">
            EXPLORAR MAIS
          </button>
        </div>
      </div>
    </section>
  );
};
