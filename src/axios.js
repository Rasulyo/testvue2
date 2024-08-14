import axios from "axios";
import Vue from "vue";
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
    Vue.notify({
      group: "api",
      type: "error",
      title: "Ошибка",
      text: error?.response?.data?.detail || "Неизвестная ошибка",
    });
    return Promise.reject(error);
  }
);
