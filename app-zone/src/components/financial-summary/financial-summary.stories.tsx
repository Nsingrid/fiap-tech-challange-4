import type { Meta, StoryObj } from "@storybook/react";
import { FinancialSummary } from "./financial-summary";

const meta: Meta<typeof FinancialSummary> = {
  title: "Components/FinancialSummary",
  component: FinancialSummary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Componente de resumo financeiro que exibe:
- Saudações ao usuário
- Data formatada
- Saldo da conta corrente
- Botão para iniciar uma nova transação

**Propriedades:**
- \`username\` (opcional): nome do usuário.
- \`date\`: timestamp da data exibida.
- \`checkingAccountValue\`: valor da conta corrente em centavos/reais.
- \`onNewTransactionButtonClick\`: função disparada ao clicar no botão "Nova transação".

**Exemplo de uso:**
\`\`\`tsx
<FinancialSummary
  username="João"
  date={Date.now()}
  checkingAccountValue={1500}
  onNewTransactionButtonClick={() => console.log("Nova transação")}
 />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    username: {
      control: "text",
      description: "Nome do usuário exibido na saudação.",
      defaultValue: "João",
    },
    date: {
      control: "date",
      description: "Data usada para exibição formatada.",
      defaultValue: Date.now(),
    },
    onNewTransactionButtonClick: {
      action: "clicked",
      description: "Função chamada ao clicar no botão 'Nova transação'.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FinancialSummary>;

export const Default: Story = {
  args: {
    username: "João",
    date: Date.now(),
  },
};

export const WithoutUserName: Story = {
  args: {
    username: undefined,
    date: Date.now(),
  },
};
