import axios from "axios";

axios.defaults.baseURL = "https://dev.moydomonline.ru/api/";

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.key) {
      config.headers.Authorization = `Token ${user?.key}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
