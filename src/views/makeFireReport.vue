<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-poppins relative">
    <!-- Header -->
    <header class="bg-white shadow-neu-header fixed top-0 w-full z-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-8 w-8" />
          </div>

          <!-- Navigation Items -->
          <nav class="flex-1 flex justify-center space-x-8">
            <router-link
              v-for="(item, index) in navItems"
              :key="index"
              :to="item.path"
              class="flex flex-col items-center group px-4"
            >
              <div class="flex flex-col items-center">
                <component 
                  :is="item.icon" 
                  class="w-5 h-5 mb-0.5"
                  :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
                />
                <span 
                  class="text-xs"
                  :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
                >
                  {{ item.label }}
                </span>
              </div>
              <div 
                class="h-0.5 w-full mt-1 transition-all duration-300"
                :class="$route.path === item.path ? 'bg-teal-600' : 'bg-transparent'"
              ></div>
            </router-link>
          </nav>

          <!-- Profile -->
          <div class="flex items-center">
            <router-link
              to="/profile"
              class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
            >
              <UserCircle class="w-6 h-6 text-gray-600" />
            </router-link>
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

          <!-- Right Panel - Fire Safety Tips -->
          <div class="bg-white rounded-lg shadow-neu overflow-hidden">
            <div class="p-6 space-y-6">
              <!-- Header -->
              <div class="relative">
                <h2 class="text-3xl font-bold text-center text-gray-800 relative z-10">
                  FIRE
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
                <p class="text-xs text-gray-500">For more information visit www.firesafety.com</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>

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
                    Your fire report has been successfully submitted. Thank you for your contribution to community safety.
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFireReportStore } from '@/stores/fireReportStore';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
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
  Cigarette,
  Lightbulb,
  Droplet,
  Fuel,
  ShieldAlert
} from 'lucide-vue-next';

const fireReportStore = useFireReportStore();

const categories = ['Building Fire Incidents', 'Vehicle Fire', 'Wildland or Vegetation Fires', 'Electrical Fire'];

const subCategories = {
  'Building Fire Incidents': ['Residential', 'Commercial', 'Industrial', 'Institutional'],
  'Vehicle Fire': ['Passenger Vehicle', 'Commercial Vehicle'],
  'Wildland or Vegetation Fires': ['Wildfire', 'Forest Fire'],
  'Electrical Fire': ['Fire due to Appliance', 'Wiring Fire', 'Utility Fire'],
};

const safetyTips = [
  {
    icon: AlertTriangle,
    text: 'Keep flammable materials away from heat sources'
  },
  {
    icon: ShieldAlert,
    text: 'Keep matches and flammable objects out of children\'s reach'
  },
  {
    icon: Droplet,
    text: 'Store flammable liquids outside the house'
  },
  {
    icon: Flame,
    text: 'Never leave open flames unattended'
  },
  {
    icon: Cigarette,
    text: 'Avoid smoking inside the house'
  },
  {
    icon: AlertTriangle,
    text: 'Install smoke detectors on every floor'
  },
  {
    icon: Lightbulb,
    text: 'Avoid electrical overload and inspect wiring regularly'
  },
  {
    icon: Fuel,
    text: 'Store fuel and combustibles in well-ventilated areas'
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

const handleFileUpload = (event) => {
  const newFiles = Array.from(event.target.files);
  files.value = [...files.value, ...newFiles];
  
  newFiles.forEach(file => {
    if (previewImages.value.length < 4) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImages.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
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
    status: 'Pending'
  };

  try {
    await fireReportStore.addFireReport(reportData);
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