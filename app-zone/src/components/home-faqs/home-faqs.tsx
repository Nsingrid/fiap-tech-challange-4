"use client";
import { useState } from "react";

export const HomeFaqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "O que você precisa para abrir uma conta ByteBank?",
      answer: "Você pode abrir uma conta bancária ByteBank online pelo App Store (para smartphones com iOS) ou pelo Google Play (para smartphones com Android). Você precisa ter pelo menos 18 anos, ser residente de um país suportado, não possuir já uma conta no ByteBank e ter um documento suportado aplicável ao país em que você reside."
    },
    {
      question: "Como eu abro uma conta ByteBank?",
      answer: "Baixe nosso aplicativo e siga o processo simples de cadastro. Você precisará de um documento de identidade válido e apenas alguns minutos do seu tempo."
    },
    {
      question: "Quais são os benefícios do ByteBank?",
      answer: "Aproveite zero taxas mensais, transferências instantâneas, ferramentas avançadas de orçamento e suporte ao cliente 24/7."
    },
    {
      question: "Quanto custa a conta ByteBank?",
      answer: "A conta é completamente gratuita, sem taxas de manutenção mensal ou cobranças ocultas."
    },
    {
      question: "O que são Espaços e como posso usá-los?",
      answer: "Espaços são sub-contas que você pode criar para organizar seu dinheiro. Use-os para separar economias, pagar contas ou guardar dinheiro para objetivos específicos."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border-b border-gray-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4 text-sm">
                    {faq.question}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-45' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="pb-5 text-gray-500 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
