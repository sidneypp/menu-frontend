export default {
    ADD_CUSTOMER (state, customer) {
      state.items.unshift(customer)
    },
    SET_CUSTOMERS (state, customers) {
      state.items = customers
    },
    UPDATE_CUSTOMER (state, customer) {
      const customerIndex = state.items.findIndex(({ id }) => id === customer.id)
      Object.assign(state.items[customerIndex], customer)
    },
    REMOVE_CUSTOMER (state, customerId) {
      const customerIndex = state.items.findIndex((p) => p.id === customerId)
      state.items.splice(customerIndex, 1)
    }
  }
  