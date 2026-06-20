// Shared general purpose utilities

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]!;
};

export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPercent = (val: number): string => {
  return `${Math.round(val * 100)}%`;
};
