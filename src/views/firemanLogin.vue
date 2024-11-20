<template>
  <div class="signin-container">
    <div class="logo-container">
      <img src="@/assets/naulogo.png" alt="Logo" class="logo">
    </div>

    <form @submit.prevent="handleSubmit" class="signin-form">
      <h1>Sign In</h1>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required>
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

    <!-- Error Modal -->
    <div v-if="error" class="modal">
      <div class="modal-content error-modal">
        <button @click="closeModal" class="close-button">X</button>
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal">
      <div class="modal-content success-modal">
        <h2>Login Successful!</h2>
        <p>You will be redirected to the dashboard shortly.</p>
      </div>
    </div>

    <!-- Progress Modal -->
    <div v-if="isLoggingIn" class="modal">
      <div class="modal-content progress-modal">
        <h2>Logging in...</h2>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';
import { auth, db } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const router = useRouter();
const form = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const error = ref('');
const isLoggingIn = ref(false);
const progress = ref(0);
const showSuccessModal = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isLoggingIn.value = true;
  progress.value = 0;

  const progressInterval = setInterval(() => {
    if (progress.value < 80) {
      progress.value += 10;
    }
  }, 200);

  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, form.value.email, form.value.password);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'firefighters', user.uid));

    if (!userDoc.exists()) {
      throw new Error('User not found in Firestore');
    }

    // Complete progress bar animation
    clearInterval(progressInterval);
    progress.value = 100;

    // Show success modal
    isLoggingIn.value = false;
    showSuccessModal.value = true;

    setTimeout(() => {
      showSuccessModal.value = false;
      router.push('/dashboard');
    }, 2000);

  } catch (err) {
    console.error('Login failed:', err.message);

    clearInterval(progressInterval);
    isLoggingIn.value = false;

    error.value = 'Invalid email or password. Please try again.';
  }
};

const closeModal = () => {
  error.value = '';
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 100px;
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
  background-color: #05808C;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
}

.error-modal {
  background-color: #ffcccc;
}

.success-modal {
  background-color: #ccffcc;
}

.progress-modal {
  background-color: white;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.progress-bar {
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  width: 0;
  background-color: #05808C;
  transition: width 0.3s ease;
}
</style>