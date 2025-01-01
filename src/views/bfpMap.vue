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
              item.active ? 'bg-[#f97316] text-white' : 'text-gray-300 hover:bg-[#333333] hover:text-white'
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
            <div class="flex mb-4 space-x-2">
              <input
                ref="searchInput"
                type="text"
                placeholder="Search for a location"
                class="flex-grow p-2 border border-gray-300 rounded-md"
              />
              <button
                @click="openInGoogleMaps"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Open in Google Maps
              </button>
            </div>
            <div id="map" class="h-[calc(100%-4rem)] w-full"></div>
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
                  <p class="font-semibold">{{ report.subType }}</p>
                  <p class="text-sm text-gray-600">{{ report.location }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(report.timestamp) }}</p>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useFireReportStore } from '../stores/fireReportStore';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  Users,
  Menu,
  ChevronLeft,
  Bell,
  Settings,
  X
} from 'lucide-vue-next';

// Declare google as a global variable to avoid ESLint errors
/* global google */

// Map variables
let map = null;
let heatmap = null;
let autocomplete = null;
const markers = ref([]);
const infoWindows = ref([]);
const allReports = ref([]);
const searchInput = ref(null);

const fireReportStore = useFireReportStore();

const isSidebarCollapsed = ref(false);
const showNotifications = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/bfpdashboard", active: false },
  { name: "Fire Reports", icon: FileText, path: "/bfpreports", active: false },
  { name: "Firefighters", icon: Users, path: "/bfpfireman", active: false },
  { name: "Incident History", icon: History, path: "/bfphistory", active: false },
  { name: "Fire Analytics", icon: BarChart2, path: "/bfpmap", active: true },
];

// Initialize map
const initMap = () => {
  const defaultCenter = { lat: 12.8797, lng: 121.7740 };
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultCenter,
    zoom: 6,
    styles: [
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ visibility: "simplified" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }]
      }
    ]
  });

  // Initialize Autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
    types: ['geocode']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  });
};

// Get directions
const openInGoogleMaps = () => {
  const fireStation = { lat: 13.324295157229585, lng: 121.30357728456404 };
  const destination = autocomplete.getPlace();

  if (!destination || !destination.geometry) {
    alert("Please select a valid destination from the autocomplete suggestions.");
    return;
  }

  const url = `https://www.google.com/maps/dir/?api=1&origin=${fireStation.lat},${fireStation.lng}&destination=${destination.geometry.location.lat()},${destination.geometry.location.lng()}&travelmode=driving`;
  window.open(url, '_blank');
};


// Format date helper
const formatDate = (date) => {
  if (date && date.seconds) {
    return new Date(date.seconds * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Load and process reports
const loadUserReports = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const data = [];
    
    // Query all fire reports
    const allFireReportsQuery = query(
      collection(db, 'fireReports'), 
      where('userId', '==', currentUser.uid)
    );
    const allFireSnapshot = await getDocs(allFireReportsQuery);
    
    allFireSnapshot.forEach((doc) => {
      const report = doc.data();
      if (report.coordinates) {
        data.push({
          id: doc.id,
          lat: report.coordinates.latitude,
          lng: report.coordinates.longitude,
          type: 'Fire',
          subType: report.incidentType || 'Unknown',
          location: report.location || 'Not specified',
          timestamp: report.dateTime ? new Date(report.dateTime.seconds * 1000) : new Date(),
          status: report.status || 'Pending'
        });
      }
    });

    allReports.value = data;
    addMarkersToMap(data);
    fireReportStore.setFireReports(data);

    // Query recent fire reports
    const recentFireReportsQuery = query(
      collection(db, 'fireReports'), 
      where('userId', '==', currentUser.uid),
      orderBy('dateTime', 'desc'),
      limit(5)
    );
    const recentFireSnapshot = await getDocs(recentFireReportsQuery);
    
    const recentReports = recentFireSnapshot.docs.map(doc => {
      const report = doc.data();
      return {
        id: doc.id,
        subType: report.incidentType || 'Unknown',
        location: report.location || 'Not specified',
        timestamp: report.dateTime ? new Date(report.dateTime.seconds * 1000) : new Date()
      };
    });

    fireReportStore.setRecentFireReports(recentReports);
  } catch (error) {
    console.error('Error loading reports:', error);
  }
};

// Add markers to map
const addMarkersToMap = (reports) => {
  // Clear existing markers and info windows
  markers.value.forEach(marker => marker.setMap(null));
  infoWindows.value.forEach(window => window.close());
  markers.value = [];
  infoWindows.value = [];

  if (reports.length === 0) {
    return;
  }

  const bounds = new google.maps.LatLngBounds();

  reports.forEach((report) => {
    const position = new google.maps.LatLng(report.lat, report.lng);
    bounds.extend(position);

    // Create marker
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      },
      animation: google.maps.Animation.DROP,
      title: `${report.type} - ${report.subType}`
    });

    // Create info window content
    const content = `
      <div class="p-3 bg-gray-800 text-white rounded-lg">
        <h3 class="font-bold text-lg mb-2 text-teal-300">${report.type} Report</h3>
        <p><strong class="text-teal-400">Type:</strong> ${report.subType}</p>
        <p><strong class="text-teal-400">Location:</strong> ${report.location}</p>
        <p><strong class="text-teal-400">Date:</strong> ${formatDate(report.timestamp)}</p>
        <p><strong class="text-teal-400">Status:</strong> <span class="px-2 py-1 rounded ${
          report.status === 'Completed' ? 'bg-green-800 text-green-200' :
          report.status === 'In Progress' ? 'bg-yellow-800 text-yellow-200' :
          'bg-red-800 text-red-200'
        }">${report.status}</span></p>
      </div>
    `;

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    });

    // Add click listener to marker
    marker.addListener('click', () => {
      infoWindows.value.forEach(window => window.close());
      infoWindow.open(map, marker);
    });

    markers.value.push(marker);
    infoWindows.value.push(infoWindow);
  });

  // Fit map to show all markers
  if (markers.value.length > 0) {
    map.fitBounds(bounds);
    if (markers.value.length === 1) {
      map.setZoom(15);
    }
  }
};

// Load Google Maps script and initialize
const loadGoogleMapsScript = () => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    initMap();
    loadUserReports();
  };
  document.head.appendChild(script);
};

onMounted(() => {
  loadGoogleMapsScript();
});

onUnmounted(() => {
  markers.value.forEach(marker => marker.setMap(null));
  infoWindows.value.forEach(window => window.close());
  if (heatmap) {
    heatmap.setMap(null);
  }
});

const highestFireRateArea = computed(() => {
  if (!allReports.value || allReports.value.length === 0) {
    return null;
  }

  const areaCounts = allReports.value.reduce((acc, report) => {
    acc[report.location] = (acc[report.location] || 0) + 1;
    return acc;
  }, {});

  const highestArea = Object.entries(areaCounts).reduce((a, b) => a[1] > b[1] ? a : b);
  return { name: highestArea[0], count: highestArea[1] };
});

const markAsRead = (notificationId) => {
  fireReportStore.markNotificationAsRead(notificationId);
};

const clearAllNotifications = () => {
  fireReportStore.clearAllNotifications();
};
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

