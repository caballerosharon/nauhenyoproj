<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-poppins relative pb-16">
    <!-- Header -->
    <header class="bg-white shadow-neu-header fixed top-0 w-full z-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-8 w-8" />
            <h1 class="ml-3 text-xl font-semibold text-gray-800">Report Crime</h1>
          </div>

          <!-- Profile -->
          <div class="flex items-center">
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
              >
                <UserCircle class="w-6 h-6 text-gray-600" />
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="isDropdownOpen = false"
                >
                  Profile
                </router-link>
                <button
                  @click="openLogoutModal"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-20 pb-24 px-4 md:px-6 lg:px-8">
      <form @submit.prevent="submitReport" class="max-w-8xl mx-auto py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Panel -->
          <div class="bg-white rounded-lg shadow-neu p-6 space-y-6">
            <!-- Incident Type -->
            <div class="space-y-2">
              <label for="incidentType" class="block text-sm font-medium text-gray-700">Incident Type</label>
              <select v-model="incidentType" id="incidentType" required
                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 transition-all duration-300">
                <option value="">Select Incident Type</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>

            <!-- Subcategory -->
            <div class="space-y-2">
              <label for="incidentSub" class="block text-sm font-medium text-gray-700">Incident Subcategory</label>
              <select v-model="incidentSub" id="incidentSub" required
                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 transition-all duration-300">
                <option value="">Select Subcategory</option>
                <option v-for="subCategory in filteredSubCategories" :key="subCategory" :value="subCategory">
                  {{ subCategory }}
                </option>
              </select>
            </div>

            <!-- Location -->
            <div class="space-y-2">
              <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
              <input ref="locationInput" type="text" id="location" v-model="location" 
                     placeholder="Enter incident location" required
                     class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 transition-all duration-300" />
              <div ref="map" class="h-64 w-full rounded-md shadow-neu mt-2"></div>
            </div>
          </div>

          <!-- Middle Panel -->
          <div class="bg-white rounded-lg shadow-neu p-6 space-y-6">
            <!-- Description -->
            <div class="space-y-2">
              <label for="description" class="block text-sm font-medium text-gray-700">Incident Description</label>
              <textarea v-model="description" id="description" rows="6" 
                        placeholder="Describe the incident in detail" required
                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 transition-all duration-300"></textarea>
            </div>

            <!-- Date and Time -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Date and Time</label>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="date" type="date" required
                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 transition-all duration-300" />
                <div class="flex">
                  <input v-model="time" type="time" required
                         class="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-l-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 transition-all duration-300" />
                  <button type="button" @click="setCurrentTime" 
                          class="px-3 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300">
                    <Clock class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Enhanced File Upload -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Upload Proof</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-teal-500 transition-all duration-300">
                <div class="space-y-1 text-center">
                  <div v-if="previewImages.length === 0">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                        <span>Browse to upload photo</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple @change="handleFileUpload" accept="image/*" />
                      </label>
                    </div>
                    <p class="text-xs text-gray-500">Supports: JPG, PNG</p>
                  </div>
                  <div v-else class="grid grid-cols-2 gap-4">
                    <div v-for="(image, index) in previewImages" :key="index" class="relative">
                      <img :src="image" alt="Preview" class="h-32 w-full object-cover rounded-lg shadow-neu" />
                      <button @click="removeImage(index)" type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-300">
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                    <div v-if="previewImages.length < 4" class="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-all duration-300">
                      <label for="additional-images" class="cursor-pointer">
                        <Plus class="w-8 h-8 text-gray-400" />
                        <input id="additional-images" type="file" class="sr-only" multiple @change="handleFileUpload" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button and Circular Progress -->
            <div class="flex justify-end items-center pt-4 space-x-4">
              <div class="relative">
                <svg class="w-12 h-12 transform -rotate-90">
                  <circle
                    class="text-gray-200"
                    stroke-width="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="20"
                    cx="24"
                    cy="24"
                  />
                  <circle
                    class="text-teal-500"
                    stroke-width="4"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="dashOffset"
                    stroke-linecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="20"
                    cx="24"
                    cy="24"
                  />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                  {{ progressPercentage }}%
                </span>
              </div>
              <button type="submit" 
                      class="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-neu">
                Submit
              </button>
            </div>
          </div>

          <!-- Right Panel - Crime Safety Tips -->
          <div class="bg-white rounded-lg shadow-neu overflow-hidden">
            <div class="p-6 space-y-6">
              <!-- Header -->
              <div class="relative">
                <h2 class="text-3xl font-bold text-center text-gray-800 relative z-10">
                  CRIME
                  <span class="block text-xl text-teal-600">SAFETY TIPS</span>
                </h2>
              </div>
  
              <!-- Tips Grid -->
              <div class="grid grid-cols-2 gap-4 mt-8">
                <div v-for="(tip, index) in safetyTips" :key="index"
                     class="flex flex-col items-center space-y-2 bg-gray-50 p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-neu border border-gray-200">
                  <div class="flex-shrink-0 bg-teal-100 rounded-full p-3">
                    <component :is="tip.icon" class="w-6 h-6 text-teal-600" />
                  </div>
                  <p class="text-sm text-gray-600 text-center font-medium">{{ tip.text }}</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-6 text-center">
                <p class="text-xs text-gray-500">For more information visit www.crimesafety.com</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-neu-bottom z-50">
      <div class="max-w-screen-xl mx-auto">
        <div class="flex justify-between h-16">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.path"
            class="flex flex-col items-center justify-center w-full hover:bg-gray-50 transition-all duration-300"
            :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
          >
            <component 
              :is="item.icon" 
              class="w-6 h-6 mb-1"
              :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
            />
            <span class="text-xs">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Success Modal -->
    <Transition enter-active-class="ease-out duration-300" 
                enter-from-class="opacity-0" 
                enter-to-class="opacity-100" 
                leave-active-class="ease-in duration-200" 
                leave-from-class="opacity-100" 
                leave-to-class="opacity-0">
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity flex items-center justify-center z-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-neu transform transition-all sm:max-w-lg sm:w-full mx-4 border border-gray-200">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 sm:mx-0 sm:h-10 sm:w-10">
                <CheckCircle class="h-6 w-6 text-teal-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Report Submitted Successfully</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Your crime report has been successfully submitted. Thank you for your contribution to community safety.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button @click="closeModal" class="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200">
            <span class="sr-only">Close</span>
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Logout Modal -->
    <div v-if="isLogoutModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p class="mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-4">
          <button @click="closeLogoutModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCrimeReportStore } from '@/stores/crimeReportStore';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Flame,
  FolderOpen, 
  MapPin, 
  UserCircle,
  Clock,
  CheckCircle,
  X,
  Plus,
  AlertTriangle,
  ShieldAlert,
  KeyRound,
  PhoneCall,
  UserPlus,
  Eye,
  UserX,
  Lock
} from 'lucide-vue-next';
import axios from 'axios';

const router = useRouter();
const crimeReportStore = useCrimeReportStore();

const categories = ['Women Abuse', 'Robbery', 'Accident', 'Assault', 'Theft', 'Cybercrime', 'Drug-related Crime'];

const subCategories = {
  'Women Abuse': ['Physical abuse', 'Emotional abuse', 'Sexual harassment', 'Domestic violence', 'Economic abuse'],
  'Robbery': ['Armed robbery', 'Carjacking', 'Home invasion'],
  'Accident': ['Traffic accident', 'Workplace accident', 'Public place accident', 'Domestic accident'],
  'Assault': ['Physical assault', 'Sexual assault', 'Verbal assault'],
  'Theft': ['Grand theft', 'Shoplifting', 'Pickpocketing', 'Identity theft'],
  'Cybercrime': ['Online fraud', 'Cyberbullying', 'Identity theft', 'Hacking', 'Phishing'],
  'Drug-related Crime': ['Possession', 'Distribution', 'Manufacturing', 'Trafficking']
};

const safetyTips = [
  {
    icon: AlertTriangle,
    text: 'Stay alert and aware of your surroundings'
  },
  {
    icon: ShieldAlert,
    text: 'Trust your instincts if you feel unsafe'
  },
  {
    icon: KeyRound,
    text: 'Always lock doors and windows'
  },
  {
    icon: PhoneCall,
    text: 'Keep emergency numbers handy'
  },
  {
    icon: UserPlus,
    text: 'Travel in groups when possible'
  },
  {
    icon: Eye,
    text: 'Be cautious of your personal information online'
  },
  {
    icon: UserX,
    text: 'Avoid sharing travel plans on social media'
  },
  {
    icon: Lock,
    text: 'Use strong, unique passwords for online accounts'
  }
];

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/reportcrime', icon: FileText, label: 'Report Crime' },
  { path: '/reportfire', icon: Flame, label: 'Report Fire' },
  { path: '/usermap', icon: MapPin, label: 'Map' },
  { path: '/history', icon: FolderOpen, label: 'My Reports' },
];

const incidentType = ref('');
const incidentSub = ref('');
const location = ref('');
const description = ref('');
const date = ref('');
const time = ref('');
const files = ref([]);
const previewImages = ref([]);
const showModal = ref(false);
const latitude = ref(null);
const longitude = ref(null);
const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);

const filteredSubCategories = computed(() => {
  return incidentType.value ? subCategories[incidentType.value] : [];
});

const locationInput = ref(null);
const map = ref(null);

const userId = ref(null);
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.value = user.uid;
  } else {
    userId.value = null;
  }
});

const handleFileUpload = async (event) => {
  const newFiles = Array.from(event.target.files);
  files.value = [...files.value, ...newFiles];
  
  for (const file of newFiles) {
    if (previewImages.value.length < 4) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post('http://localhost:3000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data && response.data.path) {
          const imagePath = response.data.path;
          previewImages.value.push(imagePath);
        } else {
          console.error('Invalid response from server:', response);
          throw new Error('Invalid server response');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // You might want to show an error message to the user here
      }
    }
  }
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
};

const setCurrentTime = () => {
  const now = new Date();
  time.value = now.toTimeString().split(' ')[0].slice(0, 5);
};

const generateCustomId = () => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FR-${timestamp}-${randomString}`;
};

const submitReport = async () => {
  const dateTime = new Date(`${date.value}T${time.value}`);
  const customId = generateCustomId();
  const reportData = {
    incidentType: incidentType.value,
    incidentSub: incidentSub.value,
    location: location.value,
    description: description.value,
    dateTime: dateTime,
    userId: userId.value,
    reportId: customId,
    coordinates: {
      latitude: latitude.value,
      longitude: longitude.value
    },
    status: 'Pending',
    imagePaths: previewImages.value // Store the image paths in Firestore
  };

  try {
    await crimeReportStore.addCrimeReport(reportData);
    console.log('Report submitted with custom ID:', customId);
    console.log('Report data:', reportData);

    showModal.value = true;
    resetForm();
  } catch (error) {
    console.error('Error submitting report:', error);
  }
};

const resetForm = () => {
  incidentType.value = '';
  incidentSub.value = '';
  location.value = '';
  description.value = '';
  date.value = '';
  time.value = '';
  files.value = [];
  previewImages.value = [];
  latitude.value = null;
  longitude.value = null;
};

const closeModal = () => {
  showModal.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const openLogoutModal = () => {
  isDropdownOpen.value = false;
  isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false;
};

const logout = async () => {
  try {
    await signOut(auth);
    closeLogoutModal();
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const initializeMap = () => {
  const input = locationInput.value;
  const mapContainer = map.value;

  const autocomplete = new window.google.maps.places.Autocomplete(input);
  const googleMap = new window.google.maps.Map(mapContainer, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      googleMap.setCenter(place.geometry.location);
      new window.google.maps.Marker({
        position: place.geometry.location,
        map: googleMap
      });

      latitude.value = place.geometry.location.lat();
      longitude.value = place.geometry.location.lng();
      console.log("Coordinates:", latitude.value, longitude.value);
    }
  });
};

const progressPercentage = computed(() => {
  let filledFields = 0;
  const totalFields = 6; // incidentType, incidentSub, location, description, date, time

  if (incidentType.value) filledFields++;
  if (incidentSub.value) filledFields++;
  if (location.value) filledFields++;
  if (description.value) filledFields++;
  if (date.value) filledFields++;
  if (time.value) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
});

const circumference = 2 * Math.PI * 20;
const dashOffset = computed(() => {
  return circumference - (progressPercentage.value / 100) * circumference;
});

onMounted(() => {
  if (!window.google) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  } else {
    initializeMap();
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Poppins', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f3f4f6;
  color: #1f2937;
}

#app {
  height: 100vh;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.shadow-neu {
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
}

.shadow-neu-header {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-neu-inset {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.safety-tip-icon {
  animation: rotate 10s linear infinite, blink 2s ease-in-out infinite;
}
</style>