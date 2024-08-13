<template>
  <div class="wrapper">
    <div class="login">
      <h2 class="title">Авторизация</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Логин или Телефон</label>
          <div class="input-wrapper">
            <span class="input-icon">📞</span>
            <span class="input-prefix"></span>
            <input v-model="username" id="username" type="text" />
          </div>
        </div>
        <div class="input-group">
          <label for="password">Пароль</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              v-model="password"
              id="password"
              :type="passwordVisible ? 'text' : 'password'"
            />
            <span class="toggle-password" @click="togglePasswordVisibility">{{
              passwordVisible ? "🙈" : "👁️"
            }}</span>
          </div>
        </div>
        <button class="btn" type="submit">Login</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      username: "+7",
      password: "",
      passwordVisible: false,
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      const success = await this.login({
        username: this.username,
        password: this.password,
      });

      if (success) {
        this.$router.push("/");
      } else {
        this.errorMessage = "Invalid login credentials";
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login {
  max-width: 338px;
  margin: auto;
  padding: 1em;
  border: 1px solid rgba($color: #000000, $alpha: 0.5);
  border-radius: 10px;

  .title {
    width: 306px;
    height: 58px;
    background-color: #44a248;
    font-size: 16px;
    border-radius: 10px;
    display: flex;
    color: white;
    align-items: center;
    justify-content: center;
    margin-top: -40px;
  }
  .btn {
    background-color: #44a248;
    color: white;
    width: 110px;
    height: 36px;
    border: none;
    border-radius: 10px;
  }

  .input-group {
    margin-bottom: 1em;
    position: relative;

    label {
      display: block;
      margin-bottom: 0.5em;
      color: #555;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      label {
        color: #44a248;
      }

      .input-icon {
        position: absolute;
        left: 0;
        padding-left: 0.5em;
        color: #555;
      }

      .input-prefix {
        color: #555;
      }

      input {
        flex: 1;
        border: none;
        border-bottom: 1px solid #ccc;
        padding: 0.5em 2em;
        padding-left: 2.5em;
        outline: none;
      }

      .toggle-password {
        position: absolute;
        right: 0.5em;
        cursor: pointer;
        user-select: none;
        font-size: 1.2em;
      }
    }
  }

  .error {
    color: red;
  }
}
</style>
