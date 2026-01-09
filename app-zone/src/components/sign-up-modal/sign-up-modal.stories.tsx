import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SignUpModal } from "./sign-up-modal";

const meta: Meta<typeof SignUpModal> = {
  title: "Components/SignUpModal",
  component: SignUpModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Modal de cadastro de novo usuário.

Inclui:
- Campo de nome completo
- Campo de email
- Campo de senha
- Botão de cadastrar

**Props:**
- \`open\`: controla se o modal está visível
- \`onClose\`: função chamada ao fechar o modal
- \`onSignUp\`: função chamada ao enviar dados de cadastro
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
    onSignUp: {
      action: "signUp",
      description: "Função chamada ao enviar dados de cadastro.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SignUpModal>;

export const Basic: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
        <SignUpModal
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSignUp={args.onSignUp}
        />
      </>
    );
  },
};
