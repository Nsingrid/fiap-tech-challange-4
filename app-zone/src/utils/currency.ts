export const formatCurrencyBRL = (valueInCents: number): string => {
  const value = valueInCents / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
