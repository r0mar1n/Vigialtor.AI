<template>
  <main class="auth">
    <section class="logo-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo-image" height="550px" width="550px" />
      <h1 class="app-name">vigilator.AI</h1>
    </section>
    <section class="form-container">
      <div class="toggle-buttons">
        <button :class="{ active: isLogin }" @click="isLogin = true">Login</button>
        <button :class="{ active: !isLogin }" @click="isLogin = false">Register</button>
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="login" class="auth-form">
        <h2>Login</h2>
        <label for="login-email">Email</label>
        <input id="login-email" name="email" type="email" placeholder="e.g. johndoe@gmail.com" v-model="login_form.email" />
        <label for="login-password">Password</label>
        <input id="login-password" name="pwd" type="password" placeholder="Enter your password" v-model="login_form.password" />
        <input type="submit" value="Login" class="auth-button" />
        <a href="#" class="forgot-password" @click.prevent="showForgotPassword">Forgot password?</a>

        <div class="google-login">
          <button class="google-button" @click.prevent="signInWithGoogle">Continue with Google</button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="register" class="auth-form">
        <h2>Register</h2>
        <label for="register-name">Name</label>
        <input id="register-name" name="name" type="text" placeholder="e.g. John Doe" v-model="register_form.name" />
        <label for="register-email">Email</label>
        <input id="register-email" name="email" type="email" placeholder="e.g. johndoe@gmail.com" v-model="register_form.email" />
        <label for="register-password">Password</label>
        <input id="register-password" name="pwd" type="password" placeholder="Enter a password" v-model="register_form.password" />
        <label for="register-confirm-password">Confirm Password</label>
        <input id="register-confirm-password" name="confirmp" type="password" placeholder="Confirm your password" v-model="register_form.confirmPassword" />
        <input type="submit" value="Register" class="auth-button" />
      </form>

      <!-- Forgot Password Component -->
      <ForgotPassword v-if="isForgotPasswordVisible" />

    </section>
  </main>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import ForgotPassword from '../views/ForgotPassword.vue';// Import the ForgotPassword component

export default {
  name: 'LoginView',
  components: {
    ForgotPassword,
  },
  setup() {
    const isLogin = ref(true);
    const isForgotPasswordVisible = ref(false); // Define this reactive variable
    const login_form = ref({
      email: '',
      password: ''
    });
    const register_form = ref({
      name: '', // Ensure name is included
      email: '',
      password: '',
      confirmPassword: ''
    });
    const store = useStore();

    const login = () => {
      store.dispatch('login', login_form.value);
    };

    const register = () => {
      if (register_form.value.password !== register_form.value.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      store.dispatch('register', {
        name: register_form.value.name, // Include name in the registration payload
        email: register_form.value.email,
        password: register_form.value.password,
      });
    };

    const showForgotPassword = () => {
      isForgotPasswordVisible.value = true; // Show the Forgot Password component
    };

    const signInWithGoogle = () => {
      store.dispatch('googleLogin'); // Dispatch the Google login action
    };

    return {
      isLogin,
      isForgotPasswordVisible, // Return the reactive variable
      login_form,
      register_form,
      login,
      register,
      signInWithGoogle,
      showForgotPassword,
    };
  },
};
</script>

<style scoped>
/* Main Layout */
.auth {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #121212;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #000000;
}
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 50px;
  margin-bottom: 30px;
  height: 550px;
  width: 550px;
}
.logo-image {
  width: 500px;
  margin-bottom: 20px;
  margin-right: 75px;
}
.app-name {
  color: #a653e7;
  font-size: 50px;
  font-family: 'Jersey 10', 'sans-serif';
  font-weight: normal;
  text-align: center;
}

/* Form Container */
.form-container {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 0px 15px rgba(255, 20, 147, 0.6);
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-buttons button {
  background: none;
  border: none;
  font-size: 1rem;
  padding: 10px;
  cursor: pointer;
  color: #a0a0a0;
}

.toggle-buttons .active {
  font-weight: bold;
  color: #a653e7;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.auth-form h2 {
  color: #ffffff;
  margin-bottom: 10px;
}

.auth-form label {
  color: #a0a0a0;
  margin: 10px 0 5px;
  font-size: 0.9rem;
}

.auth-form input[type="email"],
.auth-form input[type="password"],
.auth-form input[type="text"] {
  padding: 10px;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #2e2e2e;
  color: #ffffff;
}

.auth-button {
  background-color: #a653e7;
  color: #ffffff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.auth-button:hover {
  background-color: #7d43b2;
}

.forgot-password {
  color: #a653e7;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: 10px;
}

/* Google Login Button */
.google-login {
  margin-top: 20px;
}

.google-button {
  background: #ffffff;
  color: #000000;
  padding: 10px;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.google-button:hover {
  background: #f1f1f1;
}
</style>