<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside :class="[
      'bg-[#070b0d] flex flex-col fixed inset-y-0 left-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 bg-[#070b0d]">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
          </svg>
          <span v-if="!isSidebarCollapsed" class="ml-2 text-white font-semibold">BFP Admin</span>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-2 py-4">
        <ul>
          <li v-for="item in navigationItems" :key="item.name" class="mb-2">
            <a :href="item.path" :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              item.active ? 'bg-[#002855] text-white' : 'text-gray-300 hover:bg-[#002855] hover:text-white'
            ]">
              <component :is="item.icon" :class="['h-6 w-6', isSidebarCollapsed ? 'mr-0' : 'mr-3']" />
              <span :class="{ 'hidden': isSidebarCollapsed, 'ml-3': !isSidebarCollapsed }">
                {{ item.name }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Panel -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#070b0d] text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-1 mr-4 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
            <ChevronLeft v-else class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold">Fire Report Map - Naujan, Oriental Mindoro</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="toggleNotifications" class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 relative">
            <Bell class="h-6 w-6" />
            <span v-if="fireReportStore.unreadNotifications > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ fireReportStore.unreadNotifications }}
            </span>
          </button>
          <button class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Settings class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Map and Panels Container -->
      <div class="flex-1 p-6 overflow-auto">
        <div class="flex gap-6 h-full">
          <!-- Map Panel -->
          <div class="flex-grow bg-white rounded-lg shadow-md p-4">
            <h2 class="text-lg font-semibold mb-4 text-[#002855]">Fire Incident Map</h2>
            <div id="map" class="h-[calc(100%-2rem)] w-full"></div>
          </div>

          <!-- Side Panels -->
          <div class="w-1/4 space-y-6">
            <!-- Highest Fire Rate Area Panel -->
            <div class="bg-white rounded-lg shadow-md p-4">
              <h2 class="text-lg font-semibold mb-4 text-[#002855]">Highest Fire Rate Area</h2>
              <div v-if="highestFireRateArea" class="text-center">
                <p class="text-2xl font-bold text-red-600">{{ highestFireRateArea.name }}</p>
                <p class="text-gray-600">{{ highestFireRateArea.count }} incidents</p>
              </div>
              <p v-else class="text-gray-600 text-center">No data available</p>
            </div>

            <!-- Recent Reports Panel -->
            <div class="bg-white rounded-lg shadow-md p-4">
              <h2 class="text-lg font-semibold mb-4 text-[#002855]">Recent Reports</h2>
              <ul class="space-y-2">
                <li v-for="report in fireReportStore.recentFireReports" :key="report.id" class="border-b pb-2">
                  <p class="font-semibold">{{ report.incidentType }}</p>
                  <p class="text-sm text-gray-600">{{ report.location }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(report.dateTime) }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Modal -->
      <div v-if="showNotifications" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Notifications</h2>
            <button @click="toggleNotifications" class="text-gray-500 hover:text-gray-700">
              <X class="h-6 w-6" />
            </button>
          </div>
          <ul class="space-y-4">
            <li v-for="notification in fireReportStore.notifications" :key="notification.id" class="border-b pb-2">
              <p class="font-semibold">{{ notification.title }}</p>
              <p class="text-sm text-gray-600">{{ notification.body }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(notification.timestamp) }}</p>
              <button v-if="!notification.read" @click="markAsRead(notification.id)" class="text-blue-500 text-sm mt-1">
                Mark as Read
              </button>
            </li>
          </ul>
          <button @click="clearAllNotifications" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200">
            Clear All Notifications
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  User,
  Menu,
  ChevronLeft,
  Bell,
  Settings,
  X
} from 'lucide-vue-next';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useFireReportStore } from '@/stores/fireReportStore';

const fireReportStore = useFireReportStore();

const isSidebarCollapsed = ref(false);
const map = ref(null);
const showNotifications = ref(false);
let unsubscribe = null;

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/bfpdashboard', active: false },
  { name: 'Fire Reports', icon: FileText, path: '/bfpreports', active: false },
  { name: 'Incident History', icon: History, path: '/bfphistory', active: false },
  { name: 'Fire Analytics', icon: BarChart2, path: '/bfpmap', active: false },
  { name: 'Account', icon: User, path: '/account', active: false },
];

const convertLocationToCoordinates = (location) => {
  // This is a placeholder function. In a real application, you would use a geocoding service.
  // For demonstration purposes, we'll return coordinates within Naujan, Oriental Mindoro.
  const naujanCenter = [13.3167, 121.3000]; // Approximate center of Naujan
  
  // Use the location parameter to generate a deterministic offset
  // This is just for demonstration; in a real app, you'd use actual geocoding
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const latOffset = (hash % 100) / 1000; // Creates an offset between -0.05 and 0.05
  const lngOffset = ((hash * 31) % 100) / 1000; // Different offset for longitude

  const lat = naujanCenter[0] + latOffset;
  const lng = naujanCenter[1] + lngOffset;
  
  return [lat, lng];
};

const fireReportsWithCoordinates = computed(() => {
  return fireReportStore.fireReports.map(report => ({
    ...report,
    coordinates: convertLocationToCoordinates(report.location)
  }));
});

const groupedFireReports = computed(() => {
  const grouped = {};
  fireReportsWithCoordinates.value.forEach(report => {
    const key = report.coordinates.join(',');
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(report);
  });
  return grouped;
});

const highestFireRateArea = computed(() => {
  const areaCounts = fireReportStore.fireReports.reduce((acc, report) => {
    acc[report.location] = (acc[report.location] || 0) + 1;
    return acc;
  }, {});

  if (Object.keys(areaCounts).length === 0) {
    return null;
  }

  const highestArea = Object.entries(areaCounts).reduce((a, b) => a[1] > b[1] ? a : b);
  return { name: highestArea[0], count: highestArea[1] };
});

const formatDate = (date) => {
  if (date && date.seconds) {
    return new Date(date.seconds * 1000).toLocaleString();
  }
  return new Date(date).toLocaleString();
};

const markAsRead = (notificationId) => {
  fireReportStore.markNotificationAsRead(notificationId);
};

const clearAllNotifications = () => {
  fireReportStore.clearNotifications();
  showNotifications.value = false;
};

onMounted(async () => {
  unsubscribe = await fireReportStore.fetchFireReports();
  
  // Initialize the map
  map.value = L.map('map').setView([13.3167, 121.3000], 12); // Center on Naujan, Oriental Mindoro
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);

  // Create a custom fire icon
  const fireIcon = L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#ef4444">
        <path d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-15.75c1.5 0 2.75.75 2.75 2.25 0 1.5-1.25 3-2.75 5.25-1.5-2.25-2.75-3.75-2.75-5.25 0-1.5 1.25-2.25 2.75-2.25z"/>
      </svg>
    `,
    className: 'custom-fire-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });

  // Function to update markers
  const updateMarkers = () => {
    // Clear existing markers
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value.removeLayer(layer);
      }
    });

    // Add markers for each group of fire reports
    Object.entries(groupedFireReports.value).forEach(([key, reports]) => {
      const [lat, lng] = key.split(',').map(Number);
      const marker = L.marker([lat, lng], { icon: fireIcon }).addTo(map.value);
      
      const popupContent = `
        <div class="p-4 max-w-xs">
          <h3 class="font-bold text-lg mb-2">${reports[0].incidentType}</h3>
          <div class="space-y-1">
            <p class="text-sm"><span class="font-semibold">Location:</span> ${reports[0].location}</p>
            <p class="text-sm"><span class="font-semibold">Date:</span> ${formatDate(reports[0].dateTime)}</p>
            <p class="text-sm"><span class="font-semibold">Status:</span> 
              <span class="px-2 py-1 rounded-full text-xs ${
                reports[0].status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                reports[0].status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }">${reports[0].status}</span>
            </p>
          </div>
          ${reports.length > 1 ? `
            <div class="mt-2 pt-2 border-t">
              <p class="text-sm text-gray-600">${reports.length - 1} more incident${reports.length - 1 > 1 ? 's' : ''} at this location</p>
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });
    });
  };

  // Initial update of markers
  updateMarkers();

  // Watch for changes in fireReports and update markers
  watch(() => fireReportStore.fireReports, updateMarkers, { deep: true });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
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
  outline: 2px solid #070b0d;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

.custom-fire-icon {
  background: none;
  border: none;
}

.custom-fire-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

:deep(.custom-popup) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.leaflet-popup-content-wrapper) {
  padding: 0;
  border-radius: 8px;
}

:deep(.leaflet-popup-content) {
  margin: 0;
}

:deep(.leaflet-popup-close-button) {
  padding: 8px;
  color: #666;
}
</style>