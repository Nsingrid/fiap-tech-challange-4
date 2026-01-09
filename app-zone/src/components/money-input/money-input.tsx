import type { ChangeEvent } from "react";

export type MoneyInputProps = Readonly<{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}>;

export const MoneyInput = ({ value, onChange, disabled = false }: MoneyInputProps) => (
  <div className={`flex flex-col gap-2 ${disabled ? 'opacity-50' : ''}`}>
    <label 
      className="text-sm font-medium text-gray-700" 
      htmlFor="money-input"
    >
      Valor
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
      <input
        id="money-input"
        className="w-full pl-12 pr-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
        type="text"
        inputMode="numeric"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  </div>
);