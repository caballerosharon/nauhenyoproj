<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black">
    <!-- Fixed panel at the top -->
    <div class="fixed top-0 left-0 right-0 w-full h-full bg-gradient-to-br from-gray-900 to-black shadow-2xl overflow-auto">
      <!-- Centered content -->
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div class="p-8 relative">
            <!-- Centered Logo and X Button -->
            <div class="flex justify-center items-center mb-8 relative">
              <img src="@/assets/naulogo.png" alt="Nauhenyo Logo" class="w-24 h-24">
              <button @click="goToLandingPage" class="absolute right-0 top-0 text-gray-400 hover:text-white transition-colors duration-300">
                <XIcon class="h-6 w-6" />
              </button>
            </div>

            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-white">Welcome Back</h2>
              <p class="text-gray-400 mt-2">Sign in to your account</p>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
                  placeholder="Enter your email"
                >
              </div>
              
              <div>
                <label for="password" class="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
                    placeholder="Enter your password"
                  >
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                    <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
                  :disabled="isLoggingIn"
                >
                  <span v-if="!isLoggingIn">Sign In</span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                </button>
              </div>
            </form>
            
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-400">
                Don't have an account?
                <a @click="handleSignUp" class="font-medium text-red-500 hover:text-red-400 cursor-pointer transition duration-300">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="error" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-white">Error</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors duration-300">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <p class="text-red-400">{{ error }}</p>
      </div>
    </div>
    
    <!-- Redirection Spinner Modal -->
    <div v-if="isRedirecting" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-gray-800 rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <div class="relative w-24 h-24 mx-auto mb-4">
          <div class="absolute inset-0 rounded-full border-4 border-gray-700"></div>
          <div class="absolute inset-0 rounded-full border-t-4 border-red-500 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <p class="text-white font-medium text-lg">Redirecting...</p>
        <p class="text-gray-400 mt-2">Please wait while we prepare your dashboard</p>
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
const isRedirecting = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isLoggingIn.value = true;

  try {
    // Check for admin credentials first
    if (form.value.email === 'nauhenyobfp@gmail.com' && form.value.password === 'nauhenyobfp') {
      isRedirecting.value = true;
      setTimeout(() => {
        isLoggingIn.value = false;
        isRedirecting.value = false;
        router.push('/bfpdashboard');
      }, 2000);
    } else if (form.value.email === 'nauhenyonps@gmail.com' && form.value.password === 'nauhenyonps') {
      isRedirecting.value = true;
      setTimeout(() => {
        isLoggingIn.value = false;
        isRedirecting.value = false;
        router.push('/npsdashboard');
      }, 2000);
    } else {
      // If not admin, try regular user login
      const userCredential = await signInWithEmailAndPassword(auth, form.value.email, form.value.password);
      console.log('User logged in:', userCredential.user);

      isRedirecting.value = true;
      setTimeout(() => {
        isLoggingIn.value = false;
        isRedirecting.value = false;
        router.push('/dashboard');
      }, 2000);
    }
  } catch (err) {
    console.error('Login failed:', err.message);
    isLoggingIn.value = false;
    error.value = 'Invalid email or password. Please try again.';
  }
};

const handleSignUp = () => {
  router.push('/signup');
};

const closeModal = () => {
  error.value = '';
};

const goToLandingPage = () => {
  router.push('/');
};
</script>

<style scoped>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}
</style>

