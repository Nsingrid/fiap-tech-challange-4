export enum TransactionCategory {
  // Receitas (Credit)
  SALARIO = 'Salário',
  FREELANCE = 'Freelance',
  INVESTIMENTOS = 'Investimentos',
  VENDAS = 'Vendas',
  PRESENTES = 'Presentes',
  REEMBOLSO = 'Reembolso',
  TRANSFERENCIA_RECEBIDA = 'Transferência Recebida',
  OUTRAS_RECEITAS = 'Outras Receitas',

  // Despesas (Debit)
  ALIMENTACAO = 'Alimentação',
  TRANSPORTE = 'Transporte',
  MORADIA = 'Moradia',
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  LAZER = 'Lazer',
  COMPRAS = 'Compras',
  CONTAS = 'Contas',
  ASSINATURAS = 'Assinaturas',
  VIAGENS = 'Viagens',
  PESSOAL = 'Pessoal',
  PETS = 'Pets',
  DOACOES = 'Doações',
  IMPOSTOS = 'Impostos',
  OUTRAS_DESPESAS = 'Outras Despesas',
}

export const CreditCategories = [
  TransactionCategory.SALARIO,
  TransactionCategory.FREELANCE,
  TransactionCategory.INVESTIMENTOS,
  TransactionCategory.VENDAS,
  TransactionCategory.PRESENTES,
  TransactionCategory.REEMBOLSO,
  TransactionCategory.TRANSFERENCIA_RECEBIDA,
  TransactionCategory.OUTRAS_RECEITAS,
];

export const DebitCategories = [
  TransactionCategory.ALIMENTACAO,
  TransactionCategory.TRANSPORTE,
  TransactionCategory.MORADIA,
  TransactionCategory.SAUDE,
  TransactionCategory.EDUCACAO,
  TransactionCategory.LAZER,
  TransactionCategory.COMPRAS,
  TransactionCategory.CONTAS,
  TransactionCategory.ASSINATURAS,
  TransactionCategory.VIAGENS,
  TransactionCategory.PESSOAL,
  TransactionCategory.PETS,
  TransactionCategory.DOACOES,
  TransactionCategory.IMPOSTOS,
  TransactionCategory.INVESTIMENTOS,
  TransactionCategory.OUTRAS_DESPESAS,
];
