<template>
  <div class="fixed inset-0 bg-cover bg-center flex items-center justify-center" :style="backgroundStyle">
    <div class="w-full max-w-[500px] mx-auto p-10 bg-black bg-opacity-50 backdrop-blur-sm flex flex-col justify-center rounded-lg">
      <div class="w-full">
        <div class="flex flex-col items-center w-full">
          <div class="mb-10">
            <img class="h-24 w-auto" src="@/assets/naulogo.png" alt="Logo" />
          </div>

          <form @submit.prevent="handleLogin" class="w-full">
            <div class="relative mb-6">
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="w-full px-4 py-3 bg-transparent border-b border-white border-opacity-50 text-white text-base transition-all duration-300 focus:outline-none focus:border-white peer"
                @focus="handleFocus"
                @blur="handleBlur"
              />
              <label
                for="email"
                class="absolute left-4 top-3 text-white text-opacity-70 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-1.25rem] peer-focus:text-sm peer-focus:text-white peer-focus:text-opacity-90"
                :class="{ 'top-[-1.25rem] text-sm text-white text-opacity-90': email }"
              >
                Email
              </label>
            </div>

            <div class="relative mb-6">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                class="w-full px-4 py-3 bg-transparent border-b border-white border-opacity-50 text-white text-base transition-all duration-300 focus:outline-none focus:border-white peer"
                @focus="handleFocus"
                @blur="handleBlur"
              />
              <label
                for="password"
                class="absolute left-4 top-3 text-white text-opacity-70 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-1.25rem] peer-focus:text-sm peer-focus:text-white peer-focus:text-opacity-90"
                :class="{ 'top-[-1.25rem] text-sm text-white text-opacity-90': password }"
              >
                Password
              </label>
              <span
                class="absolute right-2 top-3 text-white cursor-pointer text-sm"
                @click="togglePassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </span>
            </div>

            <button
              type="submit"
              class="w-full py-3 mt-6 bg-transparent border border-white border-opacity-50 rounded-lg text-white text-base cursor-pointer transition-all duration-300 hover:bg-white hover:bg-opacity-10 hover:border-white"
            >
              Login
            </button>
          </form>

          <div class="flex justify-between w-full mt-8 text-sm text-white">
            <a href="#" @click.prevent="handleForgotPassword" class="opacity-70 hover:opacity-100 transition-opacity duration-300">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <transition name="fade">
      <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-black bg-opacity-50 backdrop-blur-sm p-8 rounded-lg shadow-lg text-white text-center">
          <h2 class="text-2xl font-bold mb-4">Login Successful</h2>
          <p class="mb-6">Welcome, BFP Admin!</p>
          <FlameSpinner />
          <p class="mt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    </transition>

    <!-- Error Modal -->
    <transition name="fade">
      <div v-if="showErrorModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-black bg-opacity-50 backdrop-blur-sm p-8 rounded-lg shadow-lg text-white text-center">
          <h2 class="text-2xl font-bold mb-4">Login Failed</h2>
          <p class="mb-6">{{ errorMessage }}</p>
          <button @click="showErrorModal = false" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/bfpbg.png'
import { auth } from '@/firebase/config'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import FlameSpinner from '@/views/FlameSpinner.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImage})`
}))

const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    if (user.email === 'nauhenyobfp@gmail.com') {
      showSuccessModal.value = true
      setTimeout(() => {
        router.push('/bfpdashboard')
      }, 3000) // Redirect after 3 seconds
    } else {
      throw new Error('Access denied. Only BFP Admin can log in.')
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.'
    showErrorModal.value = true
  }
}

const handleForgotPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Please enter your email address.'
    showErrorModal.value = true
    return
  }
  try {
    await sendPasswordResetEmail(auth, email.value)
    errorMessage.value = 'Password reset email sent. Please check your inbox.'
    showErrorModal.value = true
  } catch (error) {
    console.error('Password reset error:', error)
    errorMessage.value = 'Failed to send password reset email. Please try again.'
    showErrorModal.value = true
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleFocus = (event) => {
  event.target.classList.add('input-focused')
}

const handleBlur = (event) => {
  if (!event.target.value) {
    event.target.classList.remove('input-focused')
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
}

input:-webkit-autofill {
  caret-color: white;
}

.input-focused + label,
input:not(:placeholder-shown) + label {
  top: -1.25rem !important;
  font-size: 0.875rem !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>