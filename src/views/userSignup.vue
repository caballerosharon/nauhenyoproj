<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Left side with form -->
    <div class="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-8">
      <div class="w-full max-w-md">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Sign Up</h1>

          <div class="space-y-4">
            <div class="flex flex-col">
              <label for="fullname" class="text-sm text-gray-500 mb-1 text-left">Full Name</label>
              <input 
                id="fullname" 
                v-model="form.fullname" 
                type="text" 
                required
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
              >
            </div>

            <div class="flex flex-col">
              <label for="birthday" class="text-sm text-gray-500 mb-1 text-left">Birthday</label>
              <input 
                id="birthday" 
                v-model="form.birthday" 
                type="date" 
                required
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
              >
            </div>

            <div class="flex gap-4">
              <div class="flex flex-col w-1/2">
                <label for="gender" class="text-sm text-gray-500 mb-1 text-left">Gender</label>
                <select 
                  id="gender" 
                  v-model="form.gender" 
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="flex flex-col w-1/2">
                <label for="contactNumber" class="text-sm text-gray-500 mb-1 text-left">Contact Number</label>
                <input 
                  id="contactNumber" 
                  v-model="form.contactNumber" 
                  type="tel" 
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
                >
              </div>
            </div>

            <div class="flex flex-col">
              <label for="address" class="text-sm text-gray-500 mb-1 text-left">Address</label>
              <div class="relative">
                <input 
                  id="address" 
                  v-model="form.address" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
                >
                <button 
                  type="button" 
                  @click="showMap = true"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <MapPinIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="flex flex-col">
              <label for="email" class="text-sm text-gray-500 mb-1 text-left">Email</label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
              >
            </div>

            <div class="flex flex-col">
              <label for="password" class="text-sm text-gray-500 mb-1 text-left">Password</label>
              <div class="relative">
                <input 
                  id="password" 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#062654] focus:border-[#062654]"
                >
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                  <EyeOffIcon v-else class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#062654] hover:bg-[#083472] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#062654] transition-colors"
          >
            Sign Up
          </button>

          <div v-if="error" class="text-red-600 text-center text-sm">
            {{ error }}
          </div>
        </form>
      </div>
    </div>

    <!-- Right side with logo -->
    <div class="w-full md:w-1/2 bg-[#062654] flex items-center justify-center p-8 md:fixed md:top-0 md:right-0 md:bottom-0">
      <img src="@/assets/naulogo.png" alt="Nauhenyo Logo" class="w-48 md:w-64 lg:w-96 h-auto">
    </div>

    <!-- Map Modal -->
    <div v-if="showMap" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Select Location in the Philippines</h2>
          <button @click="showMap = false" class="text-gray-500 hover:text-gray-700">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Blank_map_of_the_Philippines.svg/800px-Blank_map_of_the_Philippines.svg.png" 
            alt="Map of the Philippines"
            class="w-full h-full object-contain"
          >
        </div>
      </div>
    </div>

    <!-- Sign-up Progress Modal -->
    <div v-if="isSigningUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl">
        <h2 class="text-xl font-semibold mb-6 text-center">Signing Up</h2>
        <div class="relative">
          <div class="overflow-hidden h-2 rounded-full bg-gray-100">
            <div 
              class="h-full rounded-full bg-gradient-to-r from-[#062654] via-[#083472] to-[#062654] animate-gradient transition-all duration-500 ease-out bg-[length:200%_100%]"
              :style="{ width: `${signupProgress}%` }"
            ></div>
          </div>
        </div>
        <p class="mt-4 text-center text-gray-600">{{ signupStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MapPinIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-vue-next';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const router = useRouter();
const form = ref({
  fullname: '',
  birthday: '',
  gender: '',
  contactNumber: '',
  address: '',
  email: '',
  password: ''
});

const showPassword = ref(false);
const showMap = ref(false);
const error = ref('');
const isSigningUp = ref(false);
const signupProgress = ref(0);
const signupStatus = ref('');

const handleSubmit = async () => {
  isSigningUp.value = true;
  signupProgress.value = 0;
  signupStatus.value = 'Creating your account...';
  error.value = '';

  try {
    // Create user with email and password
    signupProgress.value = 25;
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password);
    const user = userCredential.user;

    signupProgress.value = 50;
    signupStatus.value = 'Account created. Saving your details...';

    // Store additional user details in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      fullname: form.value.fullname,
      birthday: form.value.birthday,
      gender: form.value.gender,
      contactNumber: form.value.contactNumber,
      address: form.value.address,
      email: form.value.email
    });

    signupProgress.value = 100;
    signupStatus.value = 'Sign up successful!';

    console.log('User signed up successfully');
    
    // Delay to show the completed progress bar
    setTimeout(() => {
      isSigningUp.value = false;
      router.push('/login');
    }, 1000);

  } catch (e) {
    console.error('Error during signup:', e);
    error.value = 'An error occurred during sign up. Please try again later.';
    isSigningUp.value = false;
    signupProgress.value = 0;
    signupStatus.value = '';
  }
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