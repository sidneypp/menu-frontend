export default {
    ADD_CUSTOMER (state, item) {
      state.items.unshift(item)
    },
    SET_CUSTOMERS (state, customers) {
      state.items = customers
    },
    UPDATE_CUSTOMER (state, customer) {
      const customerIndex = state.items.findIndex(({ id }) => id === customer.id)
      Object.assign(state.items[customerIndex], customer)
    },
    REMOVE_CUSTOMER (state, itemId) {
      const ItemIndex = state.items.findIndex((p) => p.id === itemId)
      state.items.splice(ItemIndex, 1)
    }
  }
  