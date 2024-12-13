<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
    <div class="w-full max-w-4xl bg-gray-800 bg-opacity-95 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
      <div class="p-8 relative">
        <!-- Centered Logo -->
        <div class="flex justify-center mb-8">
          <img src="@/assets/naulogo.png" alt="Nauhenyo Logo" class="w-24 h-24">
        </div>

        <!-- Close button -->
        <button @click="goToLandingPage" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300">
          <XIcon class="h-6 w-6" />
        </button>

        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-white">Create Account</h2>
          <p class="text-gray-400 mt-2">Sign up to get started with NauHenyo</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="fullname" class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              id="fullname"
              v-model="form.fullname"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
              placeholder="Enter your full name"
            >
          </div>

          <div>
            <label for="birthday" class="block text-sm font-medium text-gray-300 mb-1">Birthday</label>
            <input
              id="birthday"
              v-model="form.birthday"
              type="date"
              required
              class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
            >
          </div>

          <div>
            <label for="gender" class="block text-sm font-medium text-gray-300 mb-1">Gender</label>
            <select
              id="gender"
              v-model="form.gender"
              required
              class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label for="contactNumber" class="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
            <input
              id="contactNumber"
              v-model="form.contactNumber"
              type="tel"
              required
              class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
              placeholder="Enter your contact number"
            >
          </div>

          <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-300 mb-1">Address</label>
            <div class="relative">
              <input
                id="address"
                v-model="form.address"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
                placeholder="Enter your address"
              >
              <button
                type="button"
                @click="openMap"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <MapPinIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email</label>
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
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
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
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="md:col-span-2">
            <button
              type="submit"
              class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
              :disabled="isSigningUp"
            >
              <span v-if="!isSigningUp">Sign Up</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Up...
              </span>
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            Already have an account?
            <a @click="goToLogin" class="font-medium text-red-500 hover:text-red-400 cursor-pointer transition duration-300">Log in</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Map Modal -->
    <div v-if="showMap" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Select Location</h2>
          <button @click="closeMap" class="text-gray-400 hover:text-white transition-colors duration-300">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="mb-4 relative">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search for a location"
            class="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
          >
        </div>
        <div id="map" class="h-96 w-full rounded-lg"></div>
        <div class="mt-4 flex justify-end">
          <button
            @click="selectLocation"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Select Location
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="error" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-white">Error</h3>
          <button @click="error = ''" class="text-gray-400 hover:text-white transition-colors duration-300">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <p class="text-red-400">{{ error }}</p>
      </div>
    </div>

    <!-- Sign-up Progress Modal -->
    <div v-if="isSigningUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-gray-800 rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <h2 class="text-xl font-semibold mb-6 text-white">Signing Up</h2>
        <div class="relative">
          <div class="overflow-hidden h-2 rounded-full bg-gray-700">
            <div 
              class="h-full rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-gradient transition-all duration-500 ease-out bg-[length:200%_100%]"
              :style="{ width: `${signupProgress}%` }"
            ></div>
          </div>
        </div>
        <p class="mt-4 text-gray-300">{{ signupStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
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

const searchQuery = ref('');
const map = ref(null);
const geocoder = ref(null);
const marker = ref(null);
const searchInput = ref(null);
const autocomplete = ref(null);

const initMap = async () => {
  await nextTick();
  /* eslint-disable */
  if (typeof google === 'undefined') {
    console.error('Google Maps API not loaded');
    return;
  }

  const mapOptions = {
    center: { lat: 13.3247, lng: 121.1863 }, // Naujan, Oriental Mindoro
    zoom: 8
  };
  map.value = new google.maps.Map(document.getElementById('map'), mapOptions);
  geocoder.value = new google.maps.Geocoder();
  
  map.value.addListener('click', (e) => {
    placeMarker(e.latLng);
  });

  autocomplete.value = new google.maps.places.Autocomplete(searchInput.value, {
    types: ['geocode']
  });

  autocomplete.value.addListener('place_changed', () => {
    const place = autocomplete.value.getPlace();
    if (place.geometry) {
      map.value.setCenter(place.geometry.location);
      placeMarker(place.geometry.location);
    }
  });
  /* eslint-enable */
};

const placeMarker = (location) => {
  if (marker.value) {
    marker.value.setMap(null);
  }
  /* eslint-disable */
  marker.value = new google.maps.Marker({
    position: location,
    map: map.value
  });
  map.value.panTo(location);
  /* eslint-enable */
};

const selectLocation = () => {
  if (marker.value) {
    const lat = marker.value.getPosition().lat();
    const lng = marker.value.getPosition().lng();
    if (!geocoder.value) {
      console.error('Geocoder not initialized');
      return;
    }
    /* eslint-disable */
    geocoder.value.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          form.value.address = results[0].formatted_address;
          closeMap();
        } else {
          error.value = 'No results found';
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
        error.value = 'Failed to retrieve address. Please try again.';
      }
    });
    /* eslint-enable */
  } else {
    error.value = 'Please select a location on the map';
  }
};

const closeMap = () => {
  showMap.value = false;
};

const openMap = async () => {
  showMap.value = true;
  await nextTick();
  initMap();
};

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

const goToLandingPage = () => {
  router.push('/');
};

const goToLogin = () => {
  router.push('/login');
};

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places";
  
  script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    await loadGoogleMapsScript();
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
  }
});

onUnmounted(() => {
  if (marker.value) {
    marker.value.setMap(null);
  }
});
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