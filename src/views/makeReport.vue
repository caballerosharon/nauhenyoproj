<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside :class="[
      'bg-[#05808C] flex flex-col fixed inset-y-0 left-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]">
      <div class="flex-1 flex flex-col p-4">
        <div :class="['flex items-center mb-8', isSidebarCollapsed ? 'justify-center' : 'gap-3']">
          <div class="w-8 h-8 bg-[#E3EFF6] rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-[#05808C] font-bold">N</span>
          </div>
          <h1 :class="['text-xl font-bold text-white transition-opacity duration-300', isSidebarCollapsed ? 'hidden' : 'block']">NauHenyo</h1>
        </div>

        <nav class="flex-1">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.name">
              <a :href="item.to" 
                 :class="[
                   'flex items-center rounded-lg transition-colors duration-200',
                   item.current ? 'bg-[#04454B] text-white' : 'text-gray-300 hover:bg-[#04454B]/50',
                   isSidebarCollapsed ? 'justify-center p-2' : 'gap-3 px-4 py-3'
                 ]"
                 :title="item.name">
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span :class="['transition-opacity duration-300', isSidebarCollapsed ? 'hidden' : 'block']">{{ item.name }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#05808C] text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-[#04454B] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Menu class="w-6 h-6" />
            <span class="sr-only">Toggle menu</span>
          </button>
          <h2 class="text-xl font-semibold">Report an Incident</h2>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-1 rounded-full hover:bg-[#04454B] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Bell class="w-6 h-6" />
            <span class="sr-only">Notifications</span>
          </button>
          <button class="p-1 rounded-full hover:bg-[#04454B] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Settings class="w-6 h-6" />
            <span class="sr-only">Settings</span>
          </button>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto p-8">
        <form @submit.prevent="submitReport" class="bg-white shadow-md rounded-lg p-6 space-y-6">
          <!-- Form fields (same as in the original code) -->
          <div class="grid grid-cols-1 gap-6">
            <div class="flex items-center">
              <label for="incidentType" class="w-1/4 text-sm font-medium text-gray-700">Incident Type</label>
              <select v-model="incidentType" id="incidentType" required
                      class="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Incident Type</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
            <div class="flex items-center">
              <label for="incidentSub" class="w-1/4 text-sm font-medium text-gray-700">Incident Subcategory</label>
              <select v-model="incidentSub" id="incidentSub" required
                      class="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Subcategory</option>
                <option v-for="subCategory in filteredSubCategories" :key="subCategory" :value="subCategory">
                  {{ subCategory }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-start">
            <label for="location" class="w-1/4 text-sm font-medium text-gray-700 pt-2">Location</label>
            <div class="w-3/4">
              <input ref="locationInput" type="text" id="location" v-model="location" 
                     placeholder="Enter incident location" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              <div ref="map" class="mt-2 h-64 w-full rounded-md shadow-sm"></div>
            </div>
          </div>

          <div class="flex items-start">
            <label for="description" class="w-1/4 text-sm font-medium text-gray-700 pt-2">Description</label>
            <textarea v-model="description" id="description" rows="4" 
                      placeholder="Describe the incident in detail" required
                      class="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="flex items-center">
            <label class="w-1/4 text-sm font-medium text-gray-700">Date and Time</label>
            <div class="w-3/4 flex space-x-2">
              <input v-model="date" type="date" required
                     class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              <div class="flex-1 flex">
                <input v-model="time" type="time" required
                       class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <button type="button" @click="setCurrentTime" 
                        class="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                  <Clock class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <label for="photos" class="w-1/4 text-sm font-medium text-gray-700">Upload Photos (if any)</label>
            <input type="file" id="photos" multiple @change="handleFileUpload"
                   class="w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div class="flex justify-end">
            <button type="submit" 
                    class="px-4 py-2 bg-[#05808C] text-white rounded-md hover:bg-[#003366] focus:outline-none focus:ring-2 focus:ring-[#05808C] focus:ring-offset-2 transition-colors">
              <Send class="w-5 h-5 mr-2 inline-block" /> Submit Report
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Success Modal (same as in the original code) -->
    <Transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center z-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <CheckCircle class="h-6 w-6 text-green-600" />
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
          <button @click="closeModal" class="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
import { db, auth } from '../firebase/config';
import { setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Flame,
  FolderOpen, 
  MapPin, 
  UserCircle,
  Menu,
  Bell,
  Settings,
  Clock,
  Send,
  CheckCircle,
  X
} from 'lucide-vue-next';

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, current: false },
  { name: 'Report Crime', to: '/reportcrime', icon: FileText, current: true },
  { name: 'Report Fire Incident', to: '/reportfire', icon: Flame, current: false },
  { name: 'My Reports', to: '/history', icon: FolderOpen, current: false },
  { name: 'Map', to: '/usermap', icon: MapPin, current: false },
  { name: 'Profile', to: '/', icon: UserCircle, current: false },
];

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

const incidentType = ref('');
const incidentSub = ref('');
const location = ref('');
const description = ref('');
const date = ref('');
const time = ref('');
const files = ref([]);
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
  files.value = event.target.files;
};

const setCurrentTime = () => {
  const now = new Date();
  time.value = now.toTimeString().split(' ')[0].slice(0, 5);
};

// Function to generate a custom unique ID
const generateCustomId = () => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CR-${timestamp}-${randomString}`;
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
    }
  };

  try {
    await setDoc(doc(db, 'crimeReports', customId), reportData);
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

      // Capture the latitude and longitude of the selected place
      latitude.value = place.geometry.location.lat();
      longitude.value = place.geometry.location.lng();
      console.log("Coordinates:", latitude.value, longitude.value);
    }
  });
};

onMounted(() => {
  if (!window.google) {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places";
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
}

#app {
  height: 100vh;
}

*, *::before, *::after {
  box-sizing: border-box;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

:focus-visible {
  outline: 2px solid #05808C;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>