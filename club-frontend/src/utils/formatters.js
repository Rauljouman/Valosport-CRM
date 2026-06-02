export const formatoEuros = (valor) => {
  return `${Number(valor || 0).toFixed(2)} €`;
};

export const formatDateForApi = (date) => {
  return date.toISOString().split("T")[0];
};