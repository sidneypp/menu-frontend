export function addLoading(container) {
  this.$vs.loading({
    background: "rgba(255, 255, 255, 0.5)",
    container,
    scale: 0.6
  });
}

export function removeLoading(container) {
  this.$vs.loading.close(`${container} > .con-vs-loading`);
}

export function formatMoney(price) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
