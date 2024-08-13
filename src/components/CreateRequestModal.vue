<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Создание заявки</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="premise_id">Дом</label>
          <select
            v-model="form.premise_id"
            id="premise_id"
            @change="fetchApartments"
          >
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
        <div class="form-group">
          <label for="apartment_id">Квартира</label>
          <select
            v-model="form.apartment_id"
            id="apartment_id"
            :disabled="!form.premise_id"
          >
            <option value="" disabled selected>Выберите квартиру</option>
            <option
              v-for="apartment in apartments"
              :key="apartment.id"
              :value="apartment.id"
            >
              {{ apartment.number }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="last_name">Фамилия</label>
          <input
            v-model="form.applicant.last_name"
            type="text"
            id="last_name"
          />
        </div>
        <div class="form-group">
          <label for="first_name">Имя</label>
          <input
            v-model="form.applicant.first_name"
            type="text"
            id="first_name"
          />
        </div>
        <div class="form-group">
          <label for="patronymic_name">Отчество</label>
          <input
            v-model="form.applicant.patronymic_name"
            type="text"
            id="patronymic_name"
          />
        </div>
        <div class="form-group">
          <label for="username">Телефон</label>
          <input v-model="form.applicant.username" type="text" id="username" />
        </div>
        <div class="form-group">
          <label for="description">Описание заявки</label>
          <textarea v-model="form.description" id="description"></textarea>
        </div>
        <div class="form-group">
          <label for="due_date">Срок</label>
          <input v-model="form.due_date" type="datetime-local" id="due_date" />
        </div>
        <div class="form-actions">
          <button type="submit">Создать</button>
          <button type="button" @click="$emit('close')">Назад</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        premise_id: null,
        apartment_id: "",
        applicant: {
          last_name: "",
          first_name: "",
          patronymic_name: "",
          username: "",
        },
        description: "",
        due_date: "",
        status_id: 1,
      },
      premises: [],
      apartments: [],
    };
  },
  mounted() {
    this.fetchPremises();
  },
  methods: {
    ...mapActions(["createRequest"]),
    async fetchPremises() {
      try {
        const response = await axios.get(
          `https://dev.moydomonline.ru/api/geo/v2.0/user-premises/`
        );
        this.premises = response.data.results;
      } catch (error) {
        console.error("Error fetching premises:", error.response.data);
      }
    },
    async fetchApartments() {
      if (!this.form.premise_id) return;

      try {
        const response = await axios.get(
          `https://dev.moydomonline.ru/api/geo/v1.0/apartments/`,
          {
            params: { premise_id: this.form.premise_id },
          }
        );
        this.apartments = response.data.results;
      } catch (error) {
        console.error("Error fetching apartments:", error.response.data);
      }
    },
    async handleSubmit() {
      try {
        const formData = {
          ...this.form,
          apartment_id: parseInt(this.form.apartment_id, 10),
        };

        await this.$store.dispatch("createRequest", formData);
        this.$emit("close");
      } catch (error) {
        console.error("Error creating request:", error.response.data);
        this.$notify({
          group: "api",
          type: "error",
          title: "Ошибка",
          text: error.response.data.detail || "Неизвестная ошибка",
        });
      }
    },
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }

  .form-actions button {
    margin-left: 10px;
    padding: 8px 15px;
  }
}
</style>
