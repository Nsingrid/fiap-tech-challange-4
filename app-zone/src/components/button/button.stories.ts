import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Botão reutilizável com suporte a diferentes variantes de estilo e tamanhos.

**Variantes disponíveis:**
- homePrimary
- homeSecondary
- dashPrimary
- modalPrimary
- ghost

**Tamanhos disponíveis:**
- small
- medium
- large

**Exemplo de uso:**
\`\`\`tsx
<Button variant="homePrimary" size="medium">Clique aqui</Button>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "homePrimary",
        "homeSecondary",
        "dashPrimary",
        "modalPrimary",
        "ghost",
      ],
      description: "Define o estilo visual do botão.",
      defaultValue: "homePrimary",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Define o tamanho do botão.",
      defaultValue: "medium",
    },
    children: {
      control: "text",
      description: "Conteúdo exibido dentro do botão.",
      defaultValue: "Button",
    },
    onClick: {
      action: "clicked",
      description: "Função chamada ao clicar no botão.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: {
    children: "Button",
    variant: "ghost",
    size: "medium",
  },
};

export const HomePrimary: Story = {
  args: {
    children: "Home Primary",
    variant: "homePrimary",
    size: "medium",
  },
};

export const HomeSecondary: Story = {
  args: {
    children: "Home Secondary",
    variant: "homeSecondary",
    size: "medium",
  },
};

export const DashPrimary: Story = {
  args: {
    children: "Dashboard",
    variant: "dashPrimary",
    size: "medium",
  },
};

export const ModalPrimary: Story = {
  args: {
    children: "Modal",
    variant: "modalPrimary",
    size: "medium",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    variant: "homePrimary",
    size: "small",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    variant: "homePrimary",
    size: "large",
  },
};
