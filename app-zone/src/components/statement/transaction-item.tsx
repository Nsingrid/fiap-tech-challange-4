import { TransactionType } from "~/types/services";
import { formatCurrencyBRL } from "~/utils/currency";

export type TransactionProps = Readonly<{
  id: string;
  transactionType: TransactionType;
  type?: 'Credit' | 'Debit';
  category?: string;
  value: number; // em centavos
  date: string;
  accountId?: string;
  from?: string;
  to?: string;
  anexo?: string;
}>;

const transactionTypeToWrapper: Record<TransactionType, string> = {
  deposito: "Depósito",
  saque: "Saque",
};

const transactionTypeToIcon: Record<TransactionType, string> = {
  deposito: "↓",
  saque: "↑",
};

const transactionTypeToColor: Record<TransactionType, { bg: string; text: string; icon: string }> = {
  deposito: { bg: "bg-green-100", text: "text-green-800", icon: "text-green-600" },
  saque: { bg: "bg-red-100", text: "text-red-800", icon: "text-red-600" },
};

// Cores para cada categoria
const categoryColors: Record<string, { bg: string; text: string }> = {
  // Crédito (tons de verde e azul)
  "Salário": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Freelance": { bg: "bg-teal-100", text: "text-teal-700" },
  "Investimentos": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "Vendas": { bg: "bg-sky-100", text: "text-sky-700" },
  "Presentes": { bg: "bg-pink-100", text: "text-pink-700" },
  "Reembolso": { bg: "bg-lime-100", text: "text-lime-700" },
  "Transferência Recebida": { bg: "bg-green-100", text: "text-green-700" },
  "Outras Receitas": { bg: "bg-blue-100", text: "text-blue-700" },
  
  // Débito (tons variados)
  "Alimentação": { bg: "bg-orange-100", text: "text-orange-700" },
  "Transporte": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Moradia": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Saúde": { bg: "bg-red-100", text: "text-red-700" },
  "Educação": { bg: "bg-purple-100", text: "text-purple-700" },
  "Lazer": { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
  "Compras": { bg: "bg-violet-100", text: "text-violet-700" },
  "Contas": { bg: "bg-slate-100", text: "text-slate-700" },
  "Assinaturas": { bg: "bg-zinc-100", text: "text-zinc-700" },
  "Viagens": { bg: "bg-amber-100", text: "text-amber-700" },
  "Pessoal": { bg: "bg-rose-100", text: "text-rose-700" },
  "Pets": { bg: "bg-brown-100", text: "text-brown-700" },
  "Doações": { bg: "bg-pink-100", text: "text-pink-700" },
  "Impostos": { bg: "bg-gray-100", text: "text-gray-700" },
  "Outras Despesas": { bg: "bg-stone-100", text: "text-stone-700" },
};

const getCategoryColor = (category: string) => {
  return categoryColors[category] || { bg: "bg-gray-100", text: "text-gray-600" };
};

export const TransactionItem = ({
  transactionType,
  type,
  category,
  value,
  date,
}: TransactionProps) => {
  // Usar type (Credit/Debit) se disponível, senão fallback para transactionType
  const isCredit = type === 'Credit' || transactionType === 'deposito';
  const isDebit = type === 'Debit' || transactionType === 'saque';
  
  const colors = isCredit
    ? { bg: "bg-green-100", text: "text-green-800", icon: "text-green-600" }
    : isDebit
    ? { bg: "bg-red-100", text: "text-red-800", icon: "text-red-600" }
    : { bg: "bg-gray-100", text: "text-gray-800", icon: "text-gray-600" };
  
  const icon = isCredit ? "↓" : isDebit ? "↑" : "•";
  const label = type === 'Credit' ? 'Crédito' : type === 'Debit' ? 'Débito' : transactionTypeToWrapper[transactionType] || transactionType;
  
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 flex-1">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-lg font-bold ${colors.icon}`}>
            {icon}
          </span>
        </div>

        {/* Type, Category and Date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium text-sm">
              {label}
            </p>
            {category && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(category).bg} ${getCategoryColor(category).text}`}>
                {category}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">
            {new Date(date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Value */}
      <div className="ml-4 flex-shrink-0">
        <p className={`text-sm font-semibold ${colors.text}`}>
          {isCredit ? "+" : "-"} {formatCurrencyBRL(value)}
        </p>
      </div>
    </div>
  );
};
