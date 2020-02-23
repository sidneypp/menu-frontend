// axios
import axios from "axios";

const baseURL = "http://localhost/";

const instance = axios.create({
  baseURL: baseURL,
  responseType: "json"
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    return Promise.reject(error.response);
  }
);

export default instance;
