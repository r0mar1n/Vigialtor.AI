<template>
    <main class="forgot-password">
      <section class="form-container">
        <h2>Forgot Password</h2>
        <p>Please enter your registered email address. We will send you a link to reset your password.</p>
        <form @submit.prevent="sendResetEmail" class="auth-form">
          <label for="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            placeholder="e.g. johndoe@gmail.com"
            v-model="email"
            required
          />
          <input type="submit" value="Send Reset Link" class="auth-button" />
        </form>
        <p v-if="message" class="message">{{ message }}</p>
      </section>
    </main>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
  
  export default {
    name: 'ForgotPassword',
    setup() {
      const email = ref('');
      const message = ref('');
  
      const sendResetEmail = async () => {
        const auth = getAuth();
        try {
          await sendPasswordResetEmail(auth, email.value);
          message.value = "Password reset email sent! Please check your inbox.";
        } catch (error) {
          message.value = "Error: " + error.message;
        }
      };
  
      return {
        email,
        message,
        sendResetEmail,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Main Layout */
  .forgot-password {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #121212;
  }
  .form-container {
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 30px;
    width: 350px;
    text-align: center;
    box-shadow: 0px 0px 15px rgba(255, 20, 147, 0.6);
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
  .auth-form input[type="email"] {
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
  .message {
    color: #a653e7;
    margin-top: 10px;
  }
  </style>