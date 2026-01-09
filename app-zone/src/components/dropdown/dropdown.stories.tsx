import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./dropdown";
import type { DropdownOption } from "~/models/dropdown-option.model";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Componente Dropdown reutilizável com suporte à seleção de uma opção entre várias.

**Propriedades:**
- \`label\`: texto exibido quando nenhuma opção está selecionada.
- \`options\`: lista de opções exibidas.
- \`onSelect\`: função chamada ao selecionar uma opção.

**Exemplo de uso:**
\`\`\`tsx
<Dropdown
  label="Selecione"
  options={[
    { label: "Opção 1", value: "1", selected: false },
    { label: "Opção 2", value: "2", selected: false }
  ]}
  onSelect={(option) => console.log(option)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Texto exibido quando nenhuma opção está selecionada.",
      defaultValue: "Select an option",
    },
    options: {
      control: { type: "object" },
      description: "Lista de opções disponíveis no dropdown.",
    },
    onSelect: {
      action: "selected",
      description: "Função chamada ao selecionar uma opção.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

const baseOptions: DropdownOption[] = [
  { label: "Depósito", value: "deposito", selected: false },
  { label: "Saque", value: "saque", selected: false },
];

export const Basic: Story = {
  args: {
    label: "Selecione o tipo de transação",
    options: baseOptions,
  },
};
