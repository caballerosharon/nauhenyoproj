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
                type="text"
                id="username"
                v-model="username"
                required
                class="w-full px-4 py-3 bg-transparent border-b border-white border-opacity-50 text-white text-base transition-all duration-300 focus:outline-none focus:border-white peer"
                @focus="handleFocus"
                @blur="handleBlur"
              />
              <label
                for="username"
                class="absolute left-4 top-3 text-white text-opacity-70 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-1.25rem] peer-focus:text-sm peer-focus:text-white peer-focus:text-opacity-90"
                :class="{ 'top-[-1.25rem] text-sm text-white text-opacity-90': username }"
              >
                Username
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
            <a href="#" class="opacity-70 hover:opacity-100 transition-opacity duration-300">Forgot Password?</a>
            <a href="#" class="opacity-70 hover:opacity-100 transition-opacity duration-300">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/pnpbg.png' 

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImage})`  // Use the imported image
}))

const handleLogin = () => {
  console.log('Login attempt with:', {
    username: username.value,
    password: password.value
  })
  // Redirect to NPS dashboard
  router.push('/npsdashboard')
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
</style>