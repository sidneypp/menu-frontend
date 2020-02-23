export default {
  ADD_ORDER(state, item) {
    state.items.unshift(item);
  },
  SET_ORDERS(state, orders) {
    state.items = orders;
  },
  UPDATE_ORDER(state, order) {
    const orderIndex = state.items.findIndex(({ id }) => id === order.id);
    Object.assign(state.items[orderIndex], order);
  },
  REMOVE_ORDER(state, orderId) {
    const orderIndex = state.items.findIndex(p => p.id === orderId);
    state.items.splice(orderIndex, 1);
  }
};
