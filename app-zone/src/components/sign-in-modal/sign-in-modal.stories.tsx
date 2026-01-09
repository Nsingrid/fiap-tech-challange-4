import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SignInModal } from "./sign-in-modal";

const meta: Meta<typeof SignInModal> = {
  title: "Components/SignInModal",
  component: SignInModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Modal de autenticação do usuário.

Inclui:
- Campo de email
- Campo de senha
- Botão de entrar

**Props:**
- \`open\`: controla se o modal está visível
- \`onClose\`: função chamada ao fechar o modal
- \`onSignIn\`: função chamada ao enviar email/senha
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
    onSignIn: {
      action: "signIn",
      description: "Função chamada ao enviar email/senha.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SignInModal>;

export const Basic: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
        <SignInModal
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSignIn={args.onSignIn}
        />
      </>
    );
  },
};
