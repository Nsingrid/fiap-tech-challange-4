"use client";

export type HomeGlobalProps = Readonly<{
  onSignUpClick: () => void;
}>;

export const HomeGlobal = ({ onSignUpClick }: HomeGlobalProps) => {
  return (
    <section className="py-20 bg-[#e8f5e9] rounded-3xl">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            E envie para todo o mundo também
          </h2>
          
          {/* Currency Icons */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl border border-gray-100">
              €
            </div>
            <div className="w-24 h-24 bg-[#c8e6c9] rounded-full flex items-center justify-center text-5xl">
              ¥
            </div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl border border-gray-100">
              $
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">
            Seja para o Japão ou México, você pode transferir para lá – muito, muito rápido. Ah, e as taxas são tão boas quanto você ouviu falar.
          </p>
          
          <button
            onClick={onSignUpClick}
            className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            COMEÇAR AGORA
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
