import axios from "@/axios.js";

export default {
  addItem({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios
        .post("/orders", { ...item })
        .then(({ data }) => {
          commit("ADD_ORDER", data);
          resolve(data);
        })
        .catch(({ data }) => {
          reject(data);
        });
    });
  },
  fetchDataListItems({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get("/orders")
        .then(({ data }) => {
          commit("SET_ORDERS", data);
          resolve(data);
        })
        .catch(({ data }) => {
          reject(data);
        });
    });
  },
  updateItem({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios
        .put(`/orders/${item.id}`, { ...item })
        .then(response => {
          commit("UPDATE_ORDER", response.data);
          resolve(response);
        })
        .catch(({ data }) => {
          reject(data);
        });
    });
  },
  removeItem({ commit }, itemId) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/orders/${itemId}`)
        .then(response => {
          commit("REMOVE_ORDER", itemId);
          resolve(response);
        })
        .catch(({ data }) => {
          reject(data);
        });
    });
  }
};
