<template>
  <div class="request-list">
    <h2 class="request-title">Список заявок</h2>
    <div class="tableWrapper">
      <button class="create-btn" @click="openCreateModal">Создать</button>
      <div class="search-block">
        <div class="form-group search-input">
          <label for="search">Поиск (№ заявки, название)</label>
          <div class="input-container">
            <input
              id="search"
              v-model="search"
              @input="fetchFilteredRequests"
              type="text"
            />
            <span class="icon">&#128269;</span>
          </div>
        </div>
        <div class="form-group">
          <label for="premise_id">Дом</label>
          <div class="input-container">
            <select v-model="form.premise_id" id="premise_id">
              <option value="" disabled selected>Выберите дом</option>
              <option
                v-for="premise in premises"
                :key="premise.id"
                :value="premise.id"
              >
                {{ premise.address }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Создана</th>
          <th>Адрес</th>
          <th>Заявитель</th>
          <th>Описание</th>
          <th>Срок</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="request in requests"
          :key="request.number"
          @click="editRequest(request)"
        >
          <td>
            <span class="number">{{ request.number }}</span>
          </td>
          <td>{{ formatDate(request.created_at) }}</td>
          <td>{{ formatAddress(request) }}</td>
          <td>{{ formatApplicant(request.applicant) }}</td>
          <td>{{ request.description || "No description provided" }}</td>
          <td>{{ formatDate(request.due_date) }}</td>
          <td>{{ request.status.name }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <div class="pagination-info">
        <span>{{ currentPageRange }} из {{ totalCount }} записей</span>
        <div class="select-container">
          <select
            class="pageSizeSelect"
            v-model="pageSize"
            id="pageSize"
            @change="updatePageSize"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div class="pagination-btns">
        <button @click="previousPage" :disabled="pagination.currentPage <= 1">
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="pagination.currentPage >= pagination.pages"
        >
          Next
        </button>
      </div>
    </div>

    <EditRequestModal
      v-if="isEditing"
      :request="selectedRequest"
      @close="closeModal"
    />
    <CreateRequestModal v-if="isCreating" @close="closeModal" />
  </div>
</template>

<script>
import EditRequestModal from "@/components/EditRequestModal.vue";
import CreateRequestModal from "@/components/CreateRequestModal.vue";
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    EditRequestModal,
    CreateRequestModal,
  },
  data() {
    return {
      search: "",
      premises: null,
      selectedRequest: null,
      isEditing: false,
      isCreating: false,
      pageSize: 10,
      form: {
        premise_id: null,
      },
    };
  },
  computed: {
    ...mapGetters(["totalCount", "currentPageRange"]),
    requests() {
      return this.$store.getters.getRequests;
    },
    pagination() {
      return this.$store.getters.getPagination;
    },
  },
  mounted() {
    this.fetchPremises();
  },
  methods: {
    ...mapMutations(["SET_COUNT_PAGE"]),
    updatePageSize() {
      this.SET_COUNT_PAGE(this.pageSize);
      this.fetchFilteredRequests();
    },
    fetchFilteredRequests() {
      this.$store.dispatch("fetchRequests", {
        search: this.search,
        premise_id: this.form.premise_id,
        pageSize: this.pageSize,
      });
    },
    editRequest(request) {
      this.selectedRequest = request;
      this.isEditing = true;
    },
    openCreateModal() {
      this.isCreating = true;
    },
    closeModal() {
      this.isEditing = false;
      this.isCreating = false;
      this.selectedRequest = null;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("ru-RU", options);
    },
    formatAddress(request) {
      return `${request.premise?.short_address} ${
        request.apartment?.label || "No address"
      }`;
    },
    formatApplicant(applicant) {
      return `${applicant.last_name} ${applicant.first_name} ${applicant.patronymic_name}`;
    },
    nextPage() {
      if (this.pagination.currentPage < this.pagination.pages) {
        this.$store.dispatch("fetchRequests", {
          search: this.search,
          page: this.pagination.currentPage + 1,
          pageSize: this.pagination.pageSize,
        });
      }
    },
    previousPage() {
      if (this.pagination.currentPage > 1) {
        this.$store.dispatch("fetchRequests", {
          search: this.search,
          page: this.pagination.currentPage - 1,
          pageSize: this.pagination.pageSize,
        });
      }
    },
    async fetchPremises() {
      try {
        const response = await axios.get(
          `https://dev.moydomonline.ru/api/geo/v2.0/user-premises/`
        );
        this.premises = response.data.results;
      } catch (error) {
        this.$notify({
          group: "api",
          type: "error",
          title: "Ошибка",
          text: error.response?.data?.detail || "Неизвестная ошибка",
        });
        console.error("Error fetching premises:", error.response?.data);
      }
    },
  },
  created() {
    if (!this.$store.getters.isAuthenticated) {
      this.$router.push("/login");
    } else {
      this.$store.dispatch("fetchRequests");
    }
  },
};
</script>

<style lang="scss">
.request-list {
  padding: 1em;

  .request-title {
    text-align: start;
    font-size: 20px;
  }

  .tableWrapper {
    display: flex;
    width: auto;
    flex-direction: column;
    align-items: flex-end;
    height: 100%;
    background-color: #f2f2f2;
    border-radius: 10px 10px 0 0;
    padding: 15px;
  }
  .create-btn {
    background-color: #44a248;
    color: white;
    width: 110px;
    height: 36px;
    border: none;
    border-radius: 10px;
  }
  .search-block {
    display: flex;
    align-items: center;
    gap: 50px;
    justify-content: space-between;
    width: 100%;

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;

      label {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
      }

      .input-container {
        position: relative;
        width: 100%;

        input,
        select {
          width: 95%;
          padding-right: 30px;
          padding-left: 10px;
          padding-top: 8px;
          padding-bottom: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .icon {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          font-size: 16px;
          color: #999;
          pointer-events: none;
        }
      }
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    .number {
      background-color: #44a248;
      color: white;
      width: auto;
      height: 36px;
      padding: 5px;
      border: none;
      border-radius: 10px;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      height: 58px;
      max-width: 250px;
      width: auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    th {
      background-color: #f2f2f2;
    }
  }
  button {
    margin: 0.5em;
  }
  .pagination {
    display: flex;
    width: 100%;
    margin-top: 20px;
    justify-content: space-between;

    .pagination-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pageCount {
      width: 89px;
      height: 40px;
    }
    .pageSizeSelect {
      width: 89px;
      height: 40px;
      padding: auto 10px;
      font-size: 16px;
    }
    .pagination-btns > button {
      background-color: #44a248;
      color: white;
      max-width: 110px;
      padding: 0 15px;
      height: 36px;
      border: none;
      border-radius: 10px;

      &:disabled {
        pointer-events: none;
        background-color: #626c63;
        color: black;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
