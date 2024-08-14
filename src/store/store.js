import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    requests: [],
    pagination: {
      count: 0,
      pages: 1,
      pageSize: 10,
      currentPage: 1,
    },
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    SET_COUNT_PAGE(state, count) {
      state.pagination.pageSize = count;
    },
    CLEAR_USER(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    SET_REQUESTS(state, requests) {
      state.requests = requests;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post("auth/login/", credentials);
        const { key, employee_id } = response.data;

        const user = {
          key,
          employee_id,
        };
        commit("SET_USER", user);

        return true;
      } catch (error) {
        Vue.notify({
          group: "api",
          type: "error",
          title: "Ошибка",
          text: error?.response?.data?.detail || "Неизвестная ошибка",
        });
        console.error("Login failed", error);
        return false;
      }
    },
    logout({ commit }) {
      commit("CLEAR_USER");
    },
    async fetchRequests(
      { commit, state },
      {
        search = "",
        page = state.pagination.currentPage,
        pageSize = state.pagination.pageSize,
      } = {}
    ) {
      try {
        const response = await axios.get("/appeals/v1.0/appeals/", {
          params: { search, page, page_size: pageSize },
        });

        commit("SET_REQUESTS", response.data.results);
        commit("SET_PAGINATION", {
          count: response.data.count,
          pages: response.data.pages,
          pageSize: response.data.page_size,
          currentPage: response.data.page,
        });
      } catch (error) {
        console.error("Fetching requests failed", error);
        this.$notify({
          group: "api",
          type: "error",
          title: "Ошибка",
          text: error?.response?.data?.detail || "Неизвестная ошибка",
        });
      }
    },
    async createRequest({ dispatch }, requestData) {
      try {
        try {
          await axios.post("appeals/v1.0/appeals/", {
            ...requestData,
          });
        } catch (error) {
          Vue.notify({
            group: "api",
            type: "error",
            title: "Ошибка",
            text: error?.response?.data?.detail || "Неизвестная ошибка",
          });
        }
        dispatch("fetchRequests");
      } catch (error) {
        console.error("Creating request failed", error);
        Vue.notify({
          group: "api",
          type: "error",
          title: "Ошибка",
          text: error?.response?.data?.detail || "Неизвестная ошибка",
        });
        throw error;
      }
    },
    async updateRequest({ dispatch }, { id, requestData }) {
      try {
        try {
          await axios.patch(`appeals/v1.0/appeals/${id}/`, requestData);
        } catch (error) {
          Vue.notify({
            group: "api",
            type: "error",
            title: "Ошибка",
            text:
              (error?.response?.data?.detail && error?.response?.status) ||
              "Неизвестная ошибка c Обновлением",
          });
        }
        dispatch("fetchRequests");
      } catch (error) {
        Vue.notify({
          group: "api",
          type: "error",
          title: "Ошибка",
          text: error?.response?.data?.detail || "Неизвестная ошибка",
        });
        console.error("Updating request failed", error);
        throw error;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getRequests: (state) => state.requests,
    getPagination: (state) => state.pagination,
    pageSize: (state) => state.pageSize,
    totalCount: (state) => state.pagination.count,
    currentPageRange: (state) => {
      const start =
        (state.pagination.currentPage - 1) * state.pagination.pageSize + 1;
      const end = Math.min(
        state.pagination.currentPage * state.pagination.pageSize,
        state.pagination.count
      );
      return `${start}-${end}`;
    },
  },
});
