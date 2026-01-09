import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TransactionModal } from "./transaction-modal";

const meta: Meta<typeof TransactionModal> = {
  title: "Components/TransactionModal",
  component: TransactionModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Modal de criação de nova transação financeira.

Inclui:
- Dropdown com tipo de transação
- Campo de entrada monetária
- Botão de envio

**Props:**
- \`open\`: controla se o modal está visível
- \`onClose\`: função chamada ao fechar o modal
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: false,
      description: "Controla se o modal está visível.",
    },
    onClose: {
      action: "closed",
      description: "Função chamada ao clicar no botão de fechar.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TransactionModal>;

export const Basic: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
        <TransactionModal
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
};
