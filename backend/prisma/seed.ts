import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { TransactionCategory } from '../src/domain/entities/TransactionCategory';

const prisma = new PrismaClient();

// Função para gerar data aleatória dentro de um intervalo
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Função para gerar número aleatório entre min e max
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes
  await prisma.transaction.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
    },
  });

  console.log('👤 Created user:', user.username);

  // Criar conta para o usuário
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      accountNumber: '123456789',
      accountType: 'CHECKING',
      balance: BigInt(0), // Será calculado baseado nas transações
    },
  });

  console.log('💰 Created account:', account.accountNumber);

  // Categorias de crédito
  const creditCategories = [
    TransactionCategory.SALARIO,
    TransactionCategory.FREELANCE,
    TransactionCategory.INVESTIMENTOS,
    TransactionCategory.VENDAS,
    TransactionCategory.PRESENTES,
    TransactionCategory.REEMBOLSO,
    TransactionCategory.TRANSFERENCIA_RECEBIDA,
    TransactionCategory.OUTRAS_RECEITAS,
  ];

  // Categorias de débito
  const debitCategories = [
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
    TransactionCategory.OUTRAS_DESPESAS,
  ];

  // Gerar transações dos últimos 12 meses (incluindo dados recentes)
  const transactions: Array<{
    accountId: string;
    type: 'Credit' | 'Debit';
    value: bigint;
    date: Date;
    category: string;
    investmentCategory?: string | null;
  }> = [];
  
  // Data atual: Janeiro 2026
  const now = new Date('2026-01-09');
  const startDate = new Date('2025-01-01');
  const endDate = now; // Até hoje
  let currentBalance = BigInt(0);

  // Garantir transações bem distribuídas
  const numTransactions = 150;

  // Adicionar algumas transações nos últimos 7 dias para garantir dados recentes
  const recentDaysCount = 15;
  const recentStartDate = new Date(now);
  recentStartDate.setDate(now.getDate() - 7); // Últimos 7 dias

  console.log('📅 Generating transactions from', startDate.toISOString(), 'to', endDate.toISOString());

  for (let i = 0; i < numTransactions; i++) {
    // 20% das transações serão dos últimos 7 dias
    const isRecent = i < recentDaysCount;
    const date = isRecent 
      ? randomDate(recentStartDate, endDate)
      : randomDate(startDate, recentStartDate);
    
    const isCredit = Math.random() > 0.4; // 60% crédito, 40% débito
    
    let value: bigint;
    let type: 'Credit' | 'Debit';
    let category: string;
    
    if (isCredit) {
      type = 'Credit';
      // Valores de crédito: R$ 100,00 a R$ 10.000,00
      value = BigInt(randomInt(10000, 1000000));
      category = creditCategories[randomInt(0, creditCategories.length - 1)];
      currentBalance += value;
    } else {
      type = 'Debit';
      // Valores de débito: R$ 20,00 a R$ 2.000,00
      value = BigInt(randomInt(2000, 200000));
      category = debitCategories[randomInt(0, debitCategories.length - 1)];
      currentBalance -= value;
    }

    transactions.push({
      accountId: account.id,
      type,
      value,
      date,
      category,
      investmentCategory: null,
    });
  }

  // Ordenar transações por data
  transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  console.log('💸 Creating', transactions.length, 'transactions...');

  // Criar transações no banco
  let createdCount = 0;
  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
    createdCount++;
    if (createdCount % 50 === 0) {
      console.log(`   Created ${createdCount}/${transactions.length} transactions...`);
    }
  }

  console.log('✅ Created', transactions.length, 'transactions');

  // Atualizar saldo da conta
  await prisma.account.update({
    where: { id: account.id },
    data: { balance: currentBalance },
  });

  const balanceInReais = Number(currentBalance) / 100;
  console.log('💰 Account balance updated to: R$', balanceInReais.toFixed(2));

  // Tipos de investimentos
  const investmentTypes = [
    { type: 'Renda Fixa', category: 'Tesouro Direto' },
    { type: 'Renda Fixa', category: 'CDB' },
    { type: 'Renda Fixa', category: 'LCI' },
    { type: 'Renda Fixa', category: 'LCA' },
    { type: 'Renda Fixa', category: 'Fundos de investimento' },
    { type: 'Renda Variável', category: 'Ações' },
    { type: 'Renda Variável', category: 'Bolsa de Valores' },
    { type: 'Renda Variável', category: 'Fundos Imobiliários' },
    { type: 'Renda Variável', category: 'Previdência Privada' },
    { type: 'Renda Variável', category: 'ETF' },
    { type: 'Criptomoedas', category: 'Bitcoin' },
    { type: 'Criptomoedas', category: 'Ethereum' },
    { type: 'Criptomoedas', category: 'Stablecoins' },
  ];

  // Gerar investimentos
  const investments: Array<{
    accountId: string;
    type: string;
    category: string;
    value: bigint;
    createdAt: Date;
  }> = [];
  const numInvestments = 80;

  console.log('📊 Generating', numInvestments, 'investments...');

  for (let i = 0; i < numInvestments; i++) {
    const date = randomDate(startDate, endDate);
    const investmentType = investmentTypes[randomInt(0, investmentTypes.length - 1)];
    // Valores de investimento: R$ 500,00 a R$ 50.000,00
    const value = BigInt(randomInt(50000, 5000000));

    investments.push({
      accountId: account.id,
      type: investmentType.type,
      category: investmentType.category,
      value,
      createdAt: date,
    });
  }

  // Ordenar investimentos por data
  investments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Criar investimentos no banco
  createdCount = 0;
  for (const investment of investments) {
    await prisma.investment.create({ data: investment });
    createdCount++;
    if (createdCount % 25 === 0) {
      console.log(`   Created ${createdCount}/${investments.length} investments...`);
    }
  }

  console.log('✅ Created', investments.length, 'investments');

  // Estatísticas finais
  const totalCredits = transactions.filter(t => t.type === 'Credit').length;
  const totalDebits = transactions.filter(t => t.type === 'Debit').length;
  const totalCreditValue = transactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + Number(t.value), 0) / 100;
  const totalDebitValue = transactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + Number(t.value), 0) / 100;

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📝 Test credentials:');
  console.log('   Email: admin@admin.com');
  console.log('   Password: 123456');
  console.log('\n📈 Generated data:');
  console.log(`   - User: ${user.username} (${user.email})`);
  console.log(`   - Account: ${account.accountNumber}`);
  console.log(`   - Balance: R$ ${balanceInReais.toFixed(2)}`);
  console.log(`   - ${transactions.length} transactions (${totalCredits} credits, ${totalDebits} debits)`);
  console.log(`   - Total Credits: R$ ${totalCreditValue.toFixed(2)}`);
  console.log(`   - Total Debits: R$ ${totalDebitValue.toFixed(2)}`);
  console.log(`   - ${investments.length} investments`);
  console.log(`   - Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log('\n🎉 Database is ready for testing!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
