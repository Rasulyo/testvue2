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
    userItems: [
      { id: 1, name: "Shoes 1" },
      { id: 2, name: "Shoes 2" },
      { id: 3, name: "Shoes 3" },
      { id: 4, name: "Shoes 4" },
      { id: 5, name: "T-shirt 1" },
      { id: 6, name: "T-shirt 2" },
      { id: 7, name: "T-shirt 3" },
      { id: 8, name: "T-shirt 4" },
    ],
    availableItems: [
      { id: 11, name: "Jacket 1" },
      { id: 12, name: "Jacket 2" },
      { id: 13, name: "Jacket 3" },
      { id: 14, name: "Jacket 4" },
      { id: 15, name: "Hoodie 1" },
      { id: 16, name: "Hoodie 2" },
      { id: 17, name: "Hoodie 3" },
      { id: 18, name: "Hoodie 4" },
    ],
    selectedUserItems: [],
    selectedAvailableItem: null,
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
    SELECT_USER_ITEM(state, item) {
      if (!state.selectedUserItems.includes(item)) {
        if (state.selectedUserItems.length >= 6) {
          state.selectedUserItems.pop();
        }
        state.selectedUserItems.push(item);
      }
    },
    SELECT_AVAILABLE_ITEM(state, item) {
      state.selectedAvailableItem = item;
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
    selectUserItem({ commit }, item) {
      commit("SELECT_USER_ITEM", item);
    },
    selectAvailableItem({ commit }, item) {
      commit("SELECT_AVAILABLE_ITEM", item);
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
    getUserItems: (state) => state.userItems,
    getAvailableItems: (state) => state.availableItems,
    getSelectedUserItems: (state) => state.selectedUserItems,
    getSelectedAvailableItem: (state) => state.selectedAvailableItem,
  },
});
