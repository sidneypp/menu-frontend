import axios from '@/axios.js'

export default {
  addItem ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.post('/customers', {...item})
        .then(({ data }) => {
          commit('ADD_CUSTOMER', data)
          resolve(data)
        })
        .catch(({ data }) => { reject(data) })
    })
  },
  fetchDataListItems ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/customers')
        .then(({ data }) => {
          commit('SET_CUSTOMERS', data)
          resolve(data)
        })
        .catch(({ data }) => { reject(data) })
    })
  },
  updateItem ({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.put(`/customers/${item.id}`, {...item})
        .then((response) => {
          commit('UPDATE_CUSTOMER', response.data)
          resolve(response)
        })
        .catch(({ data }) => { reject(data) })
    })
  },
  removeItem ({ commit }, itemId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/customers/${itemId}`)
        .then((response) => {
          commit('REMOVE_CUSTOMER', itemId)
          resolve(response)
        })
        .catch(({ data }) => { reject(data) })
    })
  }
}
