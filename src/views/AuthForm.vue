<template>
  <div class="auth-form">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <label for="email">Email</label>
      <input type="email" v-model="localFormData.email" required />

      <label for="password">Password</label>
      <input type="password" v-model="localFormData.password" required />

      <div v-if="!isLogin">
        <label for="name">Name</label>
        <input type="text" v-model="localFormData.name" required />
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" v-model="localFormData.confirmPassword" required />
      </div>

      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
      <a @click="$emit('forgot-password')">Forgot Password?</a>
      <button @click="$emit('google-login')">Sign in with Google</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
    isLogin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // Create a local copy of the formData prop
      localFormData: { ...this.formData },
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.localFormData);
    },
  },
  watch: {
    // Update localFormData if formData prop changes
    formData: {
      handler(newVal) {
        this.localFormData = { ...newVal };
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
