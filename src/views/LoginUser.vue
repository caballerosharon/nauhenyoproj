<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Left side with logo -->
    <div class="w-full md:w-1/2 bg-[#062654] flex items-center justify-center p-8 md:fixed md:top-0 md:left-0 md:bottom-0">
      <img src="@/assets/naulogo.png" alt="Nauhenyo Logo" class="w-48 md:w-64 lg:w-96 h-auto">
    </div>

    <!-- Right side with form -->
    <div class="w-full md:w-1/2 md:ml-[50%] bg-white flex items-center justify-center p-4 md:p-8 min-h-screen">
      <div class="w-full max-w-md">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Sign In</h1>

          <div class="space-y-4">
            <div class="flex flex-col">
              <label for="email" class="text-sm text-gray-700 mb-1 text-left">Email</label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required 
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
                placeholder="Enter your email"
              >
            </div>

            <div class="flex flex-col">
              <label for="password" class="text-sm text-gray-700 mb-1 text-left">Password</label>
              <div class="relative">
                <input 
                  id="password" 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
                  placeholder="Enter your password"
                >
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                  <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#062654] hover:bg-[#083472] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#062654] transition-colors"
          >
            Log in
          </button>

          <div class="text-sm text-center">
            <span class="text-gray-600">Don't have an account? </span>
            <a @click="handleSignUp" class="text-[#062654] hover:text-[#083472] cursor-pointer font-medium">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="error" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <button @click="closeModal" class="float-right text-gray-600 hover:text-gray-800">
          <XIcon class="h-6 w-6" />
        </button>
        <p class="text-red-600 mt-4">{{ error }}</p>
      </div>
    </div>

    <!-- Success Progress Bar Modal -->
    <div v-if="isLoggingIn" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl">
        <h2 class="text-xl font-semibold mb-6 text-center">Logging in...</h2>
        <div class="relative">
          <div class="overflow-hidden h-3 rounded-full bg-gray-100">
            <div 
              class="h-full rounded-full bg-gradient-to-r from-[#062654] via-[#083472] to-[#062654] animate-gradient transition-all duration-500 ease-out bg-[length:200%_100%]"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign Up Spinner -->
    <div v-if="isSigningUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div class="absolute inset-0 rounded-full border-4 border-[#062654] border-t-transparent animate-spin"></div>
        </div>
        <p class="text-gray-700 font-medium">Redirecting to Sign Up...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeOffIcon, XIcon } from 'lucide-vue-next';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const router = useRouter();
const form = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const error = ref('');
const isLoggingIn = ref(false);
const isSigningUp = ref(false);
const progress = ref(0);

const handleSubmit = async () => {
  error.value = '';
  isLoggingIn.value = true;
  progress.value = 0;

  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 10;
    }
  }, 200);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, form.value.email, form.value.password);
    console.log('User logged in:', userCredential.user);

    clearInterval(progressInterval);
    progress.value = 100;

    setTimeout(() => {
      isLoggingIn.value = false;
      router.push('/dashboard');
    }, 500);

  } catch (err) {
    console.error('Login failed:', err.message);
    clearInterval(progressInterval);
    isLoggingIn.value = false;
    error.value = 'Invalid email or password. Please try again.';
  }
};

const handleSignUp = () => {
  isSigningUp.value = true;
  setTimeout(() => {
    router.push('/signup');
  }, 1000);
};

const closeModal = () => {
  error.value = '';
};
</script>

<style>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}
</style>