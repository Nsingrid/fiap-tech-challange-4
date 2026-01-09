import { InvestmentType } from './InvestmentType';

// Interfaces
export interface InvestmentItem {
  code: InvestmentType;
  name: string;
  description: string;
  riskLevel: 'BAIXO' | 'MEDIO' | 'ALTO' | 'MUITO_ALTO';
  liquidity: 'IMEDIATA' | 'DIARIA' | 'MENSAL' | 'NO_VENCIMENTO' | 'BAIXA' | 'VARIAVEL';
}

export interface InvestmentSubcategory {
  id: string;
  name: string;
  items: InvestmentItem[];
}

export interface InvestmentCategory {
  id: string;
  name: string;
  description: string;
  subcategories: InvestmentSubcategory[];
}

// Catálogo Completo
export const InvestmentCatalog: InvestmentCategory[] = [
  /* =========================================
   * 1. RENDA FIXA
   * ========================================= */
  {
    id: 'RENDA_FIXA',
    name: 'Renda Fixa',
    description: 'Investimentos previsíveis com regras de remuneração definidas',
    subcategories: [
      {
        id: 'TITULOS_PUBLICOS',
        name: 'Tesouro Direto',
        items: [
          {
            code: InvestmentType.TESOURO_SELIC,
            name: 'Tesouro Selic',
            description: 'Pós-fixado, ideal para reserva de emergência',
            riskLevel: 'BAIXO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.TESOURO_PREFIXADO,
            name: 'Tesouro Prefixado',
            description: 'Taxa fixa garantida se levado ao vencimento',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.TESOURO_IPCA,
            name: 'Tesouro IPCA+',
            description: 'Proteção contra inflação + juros reais',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
        ],
      },
      {
        id: 'EMISSAO_BANCARIA',
        name: 'Emissão Bancária (CDB/LCI/LCA)',
        items: [
          {
            code: InvestmentType.POUPANCA,
            name: 'Poupança',
            description: 'Isento de IR, rentabilidade básica',
            riskLevel: 'BAIXO',
            liquidity: 'IMEDIATA',
          },
          {
            code: InvestmentType.CDB_DI,
            name: 'CDB Pós-fixado (DI)',
            description: 'Acompanha o CDI, garantido pelo FGC',
            riskLevel: 'BAIXO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.CDB_PREFIXADO,
            name: 'CDB Prefixado',
            description: 'Taxa fixa definida na contratação',
            riskLevel: 'MEDIO',
            liquidity: 'NO_VENCIMENTO',
          },
          {
            code: InvestmentType.CDB_HIBRIDO,
            name: 'CDB Híbrido (IPCA+)',
            description: 'Inflação + taxa fixa',
            riskLevel: 'MEDIO',
            liquidity: 'NO_VENCIMENTO',
          },
          {
            code: InvestmentType.LCI,
            name: 'LCI',
            description: 'Lastro imobiliário, isento de IR',
            riskLevel: 'BAIXO',
            liquidity: 'NO_VENCIMENTO',
          },
          {
            code: InvestmentType.LCA,
            name: 'LCA',
            description: 'Lastro agro, isento de IR',
            riskLevel: 'BAIXO',
            liquidity: 'NO_VENCIMENTO',
          },
          {
            code: InvestmentType.LCD,
            name: 'LCD',
            description: 'Letra de Crédito do Desenvolvimento',
            riskLevel: 'BAIXO',
            liquidity: 'NO_VENCIMENTO',
          },
        ],
      },
      {
        id: 'CREDITO_PRIVADO',
        name: 'Crédito Privado',
        items: [
          {
            code: InvestmentType.DEBENTURES_SIMPLES,
            name: 'Debêntures Simples',
            description: 'Dívida corporativa, incide IR',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.DEBENTURES_INCENTIVADAS,
            name: 'Debêntures Incentivadas',
            description: 'Infraestrutura, isento de IR',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.CRI,
            name: 'CRI',
            description: 'Recebíveis imobiliários, isento de IR',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.CRA,
            name: 'CRA',
            description: 'Recebíveis do agro, isento de IR',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
        ],
      },
      {
        id: 'FUNDOS_RF',
        name: 'Fundos de Renda Fixa',
        items: [
          {
            code: InvestmentType.FUNDOS_RENDA_FIXA_SIMPLES,
            name: 'Fundos RF Simples',
            description: '95% em títulos públicos ou baixo risco',
            riskLevel: 'BAIXO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.FUNDOS_RENDA_FIXA_CREDITO_PRIVADO,
            name: 'Fundos Crédito Privado',
            description: 'Carteira com debêntures, FIDCs, etc',
            riskLevel: 'MEDIO',
            liquidity: 'VARIAVEL',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 2. RENDA VARIÁVEL (BOLSA BRASIL)
   * ========================================= */
  {
    id: 'RENDA_VARIAVEL',
    name: 'Renda Variável',
    description: 'Ativos negociados em bolsa (B3)',
    subcategories: [
      {
        id: 'ACOES',
        name: 'Ações',
        items: [
          {
            code: InvestmentType.ACOES_NACIONAIS,
            name: 'Ações Nacionais',
            description: 'Ações gerais listadas na B3',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.BLUE_CHIPS,
            name: 'Blue Chips',
            description: 'Empresas líderes, grande liquidez',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.MID_CAPS,
            name: 'Mid Caps',
            description: 'Empresas de médio porte',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.SMALL_CAPS,
            name: 'Small Caps',
            description: 'Menor valor de mercado, maior potencial/risco',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.UNITS,
            name: 'Units',
            description: 'Pacote de ações ON e PN',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
        ],
      },
      {
        id: 'FIIS',
        name: 'Fundos Imobiliários (FIIs)',
        items: [
          {
            code: InvestmentType.FUNDOS_IMOBILIARIOS_TIJOLO,
            name: 'FIIs de Tijolo',
            description: 'Imóveis físicos (Shoppings, Lajes)',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.FUNDOS_IMOBILIARIOS_PAPEL,
            name: 'FIIs de Papel',
            description: 'Títulos de dívida (CRI/LCI)',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.FUNDOS_IMOBILIARIOS_HIBRIDOS,
            name: 'FIIs Híbridos',
            description: 'Carteira mista de tijolo e papel',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.FUNDOS_IMOBILIARIOS_DESENVOLVIMENTO,
            name: 'FIIs de Desenvolvimento',
            description: 'Construção para venda',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.FUNDOS_FIAGRO,
            name: 'Fiagro',
            description: 'Fundos de cadeias do agronegócio',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
        ],
      },
      {
        id: 'ETFS_BDRS',
        name: 'ETFs e BDRs',
        items: [
          {
            code: InvestmentType.ETFs_NACIONAIS,
            name: 'ETFs Nacionais',
            description: 'Fundos de índice (ex: Ibovespa)',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.BDRS_NIVEL_1,
            name: 'BDRs Nível 1',
            description: 'Empresas estrangeiras não registradas na CVM',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.BDRS_NIVEL_2,
            name: 'BDRs Nível 2',
            description: 'Empresas estrangeiras registradas na CVM',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.BDRS_NIVEL_3,
            name: 'BDRs Nível 3',
            description: 'Oferta pública registrada no Brasil',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 3. FUNDOS DE INVESTIMENTO
   * ========================================= */
  {
    id: 'FUNDOS_INVESTIMENTO',
    name: 'Fundos de Investimento',
    description: 'Gestão profissional em cotas',
    subcategories: [
      {
        id: 'ESTRATEGIAS',
        name: 'Estratégias',
        items: [
          {
            code: InvestmentType.FUNDOS_MULTIMERCADO,
            name: 'Multimercado',
            description: 'Diversos fatores de risco',
            riskLevel: 'MEDIO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.FUNDOS_LONG_SHORT,
            name: 'Long & Short',
            description: 'Operações compradas e vendidas',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.FUNDOS_MACRO,
            name: 'Macro',
            description: 'Estratégias baseadas em cenários econômicos',
            riskLevel: 'MEDIO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.FUNDOS_QUANTITATIVOS,
            name: 'Quantitativos',
            description: 'Gestão baseada em algoritmos',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.FUNDOS_ACOES,
            name: 'Fundos de Ações',
            description: 'Mínimo 67% em ações',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.FUNDOS_SETORIAIS,
            name: 'Setoriais',
            description: 'Foco em um setor específico',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.FUNDOS_CAMBIAIS,
            name: 'Cambiais',
            description: 'Variação de moedas estrangeiras',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.FUNDOS_IMOBILIARIOS,
            name: 'Fundos Imobiliários (Cotas)',
            description: 'Categoria genérica de FIIs',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 4. INTERNACIONAL
   * ========================================= */
  {
    id: 'INTERNACIONAL',
    name: 'Investimentos Internacionais',
    description: 'Exposição ao mercado global',
    subcategories: [
      {
        id: 'RENDA_VARIAVEL_EXT',
        name: 'Ações e ETFs Globais',
        items: [
          {
            code: InvestmentType.ACOES_INTERNACIONAIS,
            name: 'Stocks (Ações)',
            description: 'Ações diretas nos EUA/Europa',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.ETFs_INTERNACIONAIS,
            name: 'ETFs Globais',
            description: 'Cestas de ativos estrangeiros',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.REITS,
            name: 'REITs',
            description: 'Real Estate Investment Trusts',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
        ],
      },
      {
        id: 'RENDA_FIXA_EXT',
        name: 'Renda Fixa Global',
        items: [
          {
            code: InvestmentType.BONDS_INTERNACIONAIS,
            name: 'Bonds',
            description: 'Títulos de dívida corporativa estrangeira',
            riskLevel: 'MEDIO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.TREASURIES_EUA,
            name: 'Treasuries EUA',
            description: 'Títulos do governo americano (Risco livre)',
            riskLevel: 'BAIXO',
            liquidity: 'DIARIA',
          },
        ],
      },
      {
        id: 'FUNDOS_EXT',
        name: 'Fundos Offshore',
        items: [
          {
            code: InvestmentType.FUNDOS_OFFSHORE,
            name: 'Fundos Offshore',
            description: 'Sediados no exterior',
            riskLevel: 'ALTO',
            liquidity: 'MENSAL',
          },
          {
            code: InvestmentType.HEDGE_FUNDS,
            name: 'Hedge Funds',
            description: 'Fundos de proteção e alavancagem',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.PRIVATE_EQUITY_GLOBAL,
            name: 'PE Global',
            description: 'Private Equity internacional',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'BAIXA',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 5. CRIPTOATIVOS
   * ========================================= */
  {
    id: 'CRIPTO',
    name: 'Criptoativos & Web3',
    description: 'Ativos digitais descentralizados',
    subcategories: [
      {
        id: 'MOEDAS',
        name: 'Criptomoedas',
        items: [
          {
            code: InvestmentType.BITCOIN,
            name: 'Bitcoin',
            description: 'Reserva de valor digital',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'IMEDIATA',
          },
          {
            code: InvestmentType.ETHEREUM,
            name: 'Ethereum',
            description: 'Plataforma de contratos inteligentes',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'IMEDIATA',
          },
          {
            code: InvestmentType.ALTCOINS,
            name: 'Altcoins',
            description: 'Outras criptomoedas alternativas',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'IMEDIATA',
          },
          {
            code: InvestmentType.STABLECOINS,
            name: 'Stablecoins',
            description: 'Lastreadas em moeda fiduciária',
            riskLevel: 'MEDIO',
            liquidity: 'IMEDIATA',
          },
        ],
      },
      {
        id: 'DEFI_WEB3',
        name: 'DeFi e Tokens',
        items: [
          {
            code: InvestmentType.TOKENS_DEFI,
            name: 'Tokens DeFi',
            description: 'Finanças descentralizadas',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'IMEDIATA',
          },
          {
            code: InvestmentType.YIELD_FARMING,
            name: 'Yield Farming',
            description: 'Provisão de liquidez para rendimentos',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.STAKING,
            name: 'Staking',
            description: 'Renda passiva validando redes PoS',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.LIQUID_STAKING,
            name: 'Liquid Staking',
            description: 'Staking com liquidez via token derivativo',
            riskLevel: 'ALTO',
            liquidity: 'IMEDIATA',
          },
          {
            code: InvestmentType.NFTs,
            name: 'NFTs',
            description: 'Tokens não fungíveis',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.METAVERSO_TOKENS,
            name: 'Metaverso',
            description: 'Economias virtuais',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'IMEDIATA',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 6. COMMODITIES
   * ========================================= */
  {
    id: 'COMMODITIES',
    name: 'Commodities',
    description: 'Matérias-primas e recursos',
    subcategories: [
      {
        id: 'METAIS',
        name: 'Metais',
        items: [
          {
            code: InvestmentType.OURO_FISICO,
            name: 'Ouro Físico',
            description: 'Barra ou lingote custodiado',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.OURO_PAPEL,
            name: 'Ouro Financeiro',
            description: 'Contratos de ouro na bolsa',
            riskLevel: 'MEDIO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.PRATA,
            name: 'Prata',
            description: 'Metal precioso e industrial',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.COBRE,
            name: 'Cobre',
            description: 'Metal industrial essencial',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
        ],
      },
      {
        id: 'ENERGIA',
        name: 'Energia',
        items: [
          {
            code: InvestmentType.PETROLEO,
            name: 'Petróleo',
            description: 'WTI/Brent Contracts',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.GAS_NATURAL,
            name: 'Gás Natural',
            description: 'Commodity energética volátil',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
        ],
      },
      {
        id: 'AGRO',
        name: 'Agrícolas',
        items: [
          {
            code: InvestmentType.AGRICOLAS_SOJA,
            name: 'Soja',
            description: 'Futuros de Soja',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.AGRICOLAS_MILHO,
            name: 'Milho',
            description: 'Futuros de Milho',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.AGRICOLAS_CAFE,
            name: 'Café',
            description: 'Futuros de Café Arábica/Robusta',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.AGRICOLAS_BOI,
            name: 'Boi Gordo',
            description: 'Futuros de arroba bovina',
            riskLevel: 'ALTO',
            liquidity: 'DIARIA',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 7. IMOBILIÁRIO (ATIVOS REAIS)
   * ========================================= */
  {
    id: 'REAL_ESTATE',
    name: 'Imóveis e Ativos Reais',
    description: 'Investimento direto na economia real',
    subcategories: [
      {
        id: 'PROPRIEDADES',
        name: 'Propriedades',
        items: [
          {
            code: InvestmentType.IMOVEIS_RESIDENCIAIS,
            name: 'Residenciais',
            description: 'Casas e apartamentos',
            riskLevel: 'BAIXO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.IMOVEIS_COMERCIAIS,
            name: 'Comerciais',
            description: 'Lojas e escritórios',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.TERRENOS,
            name: 'Terrenos',
            description: 'Lotes para construção',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.IMOVEIS_PARA_RENDA,
            name: 'Imóveis de Renda',
            description: 'Foco em aluguel',
            riskLevel: 'BAIXO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.IMOVEIS_PARA_FLIP,
            name: 'Flip (Revenda)',
            description: 'Reforma rápida para revenda',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
        ],
      },
      {
        id: 'ATIVOS_AMBIENTAIS',
        name: 'Ativos Ambientais',
        items: [
          {
            code: InvestmentType.FLORESTAS,
            name: 'Florestas',
            description: 'Madeira e crédito de carbono',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.ENERGIA_RENOVAVEL,
            name: 'Energia Renovável',
            description: 'Usinas solares/eólicas diretas',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 8. ALTERNATIVOS & ESTRUTURADOS
   * ========================================= */
  {
    id: 'ALTERNATIVOS',
    name: 'Alternativos e Estruturados',
    description: 'Modalidades sofisticadas de investimento',
    subcategories: [
      {
        id: 'PRIVATE_MARKETS',
        name: 'Mercados Privados',
        items: [
          {
            code: InvestmentType.PRIVATE_EQUITY,
            name: 'Private Equity',
            description: 'Participação em empresas consolidadas',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.VENTURE_CAPITAL,
            name: 'Venture Capital',
            description: 'Investimento em Startups',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.INVESTIMENTO_ANJO,
            name: 'Investimento Anjo',
            description: 'Capital semente em startups',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.CROWDFUNDING_EQUITY,
            name: 'Equity Crowdfunding',
            description: 'Vaquinha online para investir em empresas',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.FIDCS,
            name: 'FIDC',
            description: 'Fundo de Direitos Creditórios',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
        ],
      },
      {
        id: 'DERIVATIVOS_ESTRUTURADOS',
        name: 'Derivativos e Estruturados',
        items: [
          {
            code: InvestmentType.COES,
            name: 'COE',
            description: 'Certificado de Operações Estruturadas',
            riskLevel: 'ALTO',
            liquidity: 'NO_VENCIMENTO',
          },
          {
            code: InvestmentType.DERIVATIVOS,
            name: 'Derivativos (Geral)',
            description: 'Contratos derivados de outros ativos',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.OPCOES,
            name: 'Opções',
            description: 'Direito de compra/venda futura',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.FUTUROS,
            name: 'Mercado Futuro',
            description: 'Contratos futuros (Índice, Dólar)',
            riskLevel: 'MUITO_ALTO',
            liquidity: 'DIARIA',
          },
          {
            code: InvestmentType.SWAPS,
            name: 'Swaps',
            description: 'Troca de indexadores de rentabilidade',
            riskLevel: 'ALTO',
            liquidity: 'VARIAVEL',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 9. PREVIDÊNCIA & PLANEJAMENTO
   * ========================================= */
  {
    id: 'PREVIDENCIA_SEGUROS',
    name: 'Previdência e Planejamento',
    description: 'Longo prazo e sucessão patrimonial',
    subcategories: [
      {
        id: 'PREVIDENCIA_PRIVADA',
        name: 'Planos de Previdência',
        items: [
          {
            code: InvestmentType.PREVIDENCIA_PRIVADA_PGBL,
            name: 'PGBL',
            description: 'Dutível do IR (Modelo completo)',
            riskLevel: 'BAIXO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.PREVIDENCIA_PRIVADA_VGBL,
            name: 'VGBL',
            description: 'Ideal para isentos ou simplificado',
            riskLevel: 'BAIXO',
            liquidity: 'VARIAVEL',
          },
          {
            code: InvestmentType.PLANO_DE_APOSENTADORIA_EMPRESARIAL,
            name: 'Fundo de Pensão',
            description: 'Plano fechado corporativo',
            riskLevel: 'BAIXO',
            liquidity: 'NO_VENCIMENTO',
          },
        ],
      },
      {
        id: 'SEGUROS',
        name: 'Seguros Resgatáveis',
        items: [
          {
            code: InvestmentType.SEGURO_DE_VIDA_RESGATAVEL,
            name: 'Seguro Resgatável',
            description: 'Proteção com acumulação de capital',
            riskLevel: 'BAIXO',
            liquidity: 'VARIAVEL',
          },
        ],
      },
    ],
  },

  /* =========================================
   * 10. COLECIONÁVEIS
   * ========================================= */
  {
    id: 'COLECIONAVEIS',
    name: 'Colecionáveis (Paixão)',
    description: 'Ativos de valor subjetivo e escassez',
    subcategories: [
      {
        id: 'LUXO_ARTE',
        name: 'Luxo e Arte',
        items: [
          {
            code: InvestmentType.OBRAS_DE_ARTE,
            name: 'Obras de Arte',
            description: 'Pinturas e esculturas renomadas',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.VINHOS,
            name: 'Vinhos Finos',
            description: 'Vinhos de guarda e investimento',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.RELOGIOS,
            name: 'Relógios',
            description: 'Alta relojoaria (Rolex, Patek, etc)',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.CARROS_CLASSICOS,
            name: 'Carros Clássicos',
            description: 'Veículos históricos e raros',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.JOIAS,
            name: 'Joias',
            description: 'Metais e pedras preciosas trabalhadas',
            riskLevel: 'MEDIO',
            liquidity: 'BAIXA',
          },
          {
            code: InvestmentType.COLECIONAVEIS,
            name: 'Colecionáveis Gerais',
            description: 'Moedas raras, selos, memorabilia',
            riskLevel: 'ALTO',
            liquidity: 'BAIXA',
          },
        ],
      },
    ],
  },
];

/**
 * Busca o nome do investimento no catálogo baseado no código (enum)
 * @param code - Código do investimento (InvestmentType enum value)
 * @returns Nome do investimento ou null se não encontrado
 */
export function getInvestmentNameByCode(code: string | null | undefined): string | null {
  if (!code) {
    return null;
  }

  for (const category of InvestmentCatalog) {
    for (const subcategory of category.subcategories) {
      const item = subcategory.items.find((item) => item.code === code);
      if (item) {
        return item.name;
      }
    }
  }

  return null;
}
