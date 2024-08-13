<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Редактирование заявки №{{ request.number }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="created_at">Создана</label>
          <input
            v-model="form.created_at"
            type="text"
            id="created_at"
            disabled
          />
        </div>
        <div class="form-group">
          <label for="premise_id">Дом</label>
          <input
            v-model="form.premise_id"
            type="text"
            id="premise_id"
            disabled
          />
        </div>
        <div class="form-group">
          <label for="apartment_id">Квартира</label>
          <input
            v-model="form.apartment_id"
            type="text"
            id="apartment_id"
            disabled
          />
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
        <div class="form-group">
          <label for="status">Статус</label>
          <input v-model="form.status" type="text" id="status" disabled />
        </div>
        <div class="form-actions">
          <button type="submit">Сохранить</button>
          <button type="button" @click="$emit('close')">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        created_at: this.request.created_at,
        premise_id: this.request.premise_id,
        apartment_id: this.request.apartment_id,
        applicant: {
          last_name: this.request.applicant.last_name,
          first_name: this.request.applicant.first_name,
          patronymic_name: this.request.applicant.patronymic_name,
          username: this.request.applicant.username,
        },
        description: this.request.description,
        due_date: this.request.due_date,
        status: this.request.status,
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$store.dispatch("updateRequest", {
          id: this.request.number,
          requestData: this.form,
        });
        this.$emit("close");
      } catch (error) {
        console.error("Ошибка при обновлении заявки:", error.response.data);
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
