<template>
  <div class="signin-container">
    <!-- Logo Image at the top center -->
    <div class="logo-container">
      <img src="@/assets/naulogo.png" alt="Logo" class="logo">
    </div>

    <!-- Form with the title inside -->
    <form @submit.prevent="handleSubmit" class="signin-form">
      <h1>Sign In</h1>

      <div class="form-group">
        <label for="fullname">Full Name</label>
        <input id="fullname" v-model="form.fullname" type="text" required>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input 
            id="password" 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            required
          >
          <button type="button" @click="showPassword = !showPassword" class="toggle-password">
            <EyeIcon v-if="!showPassword" />
            <EyeOffIcon v-else />
          </button>
        </div>
      </div>

      <button type="submit" class="submit-button">Sign In</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';

const router = useRouter();
const form = ref({
  fullname: '',
  password: ''
});

const showPassword = ref(false);

const handleSubmit = () => {
  console.log('Form submitted:', form.value);

  router.push('/dashboard');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

.signin-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 100px; /* Adjust logo size as needed */
}

.signin-form {
  background-color: rgba(249, 249, 249, 0.9);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: left;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  text-align: left;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #062654;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #f58e08;
}
</style>
