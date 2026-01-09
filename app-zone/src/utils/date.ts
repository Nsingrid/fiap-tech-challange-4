export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export const getMonthName = (monthIndex: number): string => {
  return MONTHS[monthIndex];
};

export const formatDateLong = (timestamp: number): string => {
  const data = new Date(timestamp);

  const dayName = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(data);
  const day = String(data.getDate()).padStart(2, "0");
  const month = String(data.getMonth() + 1).padStart(2, "0");
  const year = data.getFullYear();

  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  return `${capitalizedDayName}, ${day}/${month}/${year}`;
};

export const getDateShort = (): string => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
};
