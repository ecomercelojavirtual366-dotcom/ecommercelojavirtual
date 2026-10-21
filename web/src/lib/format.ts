export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("pt-BR");
}
