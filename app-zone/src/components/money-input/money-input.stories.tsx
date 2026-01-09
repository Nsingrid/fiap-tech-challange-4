import type { Meta, StoryObj } from "@storybook/react";
import { MoneyInput } from "./money-input";

const meta: Meta<typeof MoneyInput> = {
  title: "Components/MoneyInput",
  component: MoneyInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Componente de entrada de valores monetários com rótulo.

**Props:**
- \`value\`: valor do input (controlado externamente).
- \`onChange\`: função chamada ao alterar o conteúdo.

**Exemplo de uso:**
\`\`\`tsx
<MoneyInput value="100,00" onChange={(e) => console.log(e.target.value)} />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Valor exibido no campo de entrada.",
      defaultValue: "0,00",
    },
    onChange: {
      action: "valueChanged",
      description: "Função chamada ao alterar o valor do input.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MoneyInput>;

export const Basic: Story = {
  args: {
    value: "123,45",
  },
};
