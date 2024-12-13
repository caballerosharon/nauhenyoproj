<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-poppins relative">
    <!-- Header with Navigation -->
    <header class="bg-white shadow-neu-bottom fixed top-0 w-full z-20">
      <!-- Main Navigation -->
      <div class="flex items-center justify-between px-4 h-16 border-b border-gray-100">
        <div class="flex items-center space-x-2">
          <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-8 w-8" />
        </div>

        <!-- Navigation Links -->
        <nav class="flex items-center justify-center flex-1">
          <div class="flex items-center space-x-8">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex flex-col items-center px-4 py-1 rounded-lg transition-all duration-300"
              :class="{
                'text-teal-600 bg-teal-50': $route.path === item.path,
                'text-gray-600 hover:text-teal-600 hover:bg-gray-50': $route.path !== item.path
              }"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="text-xs mt-1">{{ item.label }}</span>
            </router-link>
          </div>
        </nav>

        <div class="flex items-center space-x-4">
          <router-link
            to="/profile"
            class="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <UserCircle class="w-6 h-6" />
          </router-link>
        </div>
      </div>

      <!-- Sub Header with Search and View Toggle -->
      <div class="px-4 py-3 flex items-center justify-between bg-white">
        <h2 class="text-xl font-semibold text-gray-800">My Reports History</h2>

        <!-- Search Bar -->
        <div class="flex-1 max-w-xl mx-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              ref="searchInput"
              placeholder="Search locations or reports..."
              class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800 shadow-neu-inner"
              v-model="searchQuery"
              @keydown.enter="handleSearch"
            />
          </div>
        </div>

        <!-- View Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1 shadow-neu-inner">
          <button
            v-for="view in viewOptions"
            :key="view.id"
            @click="toggleView(view.id)"
            :class="[
              'px-3 py-1 rounded-md text-sm transition-all duration-200 shadow-neu',
              currentView === view.id
                ? 'bg-white text-teal-600'
                : 'text-gray-600 hover:bg-gray-300'
            ]"
          >
            <component :is="view.icon" class="w-4 h-4 inline-block mr-1" />
            {{ view.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-32 pb-8 px-4 md:px-6 lg:px-8">
      <div class="max-w-8xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Stats Panel -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Statistics Cards -->
            <div class="bg-white rounded-lg p-4 shadow-neu border border-gray-200">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Report Statistics</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span class="text-gray-600">Crime Reports</span>
                  </div>
                  <span class="text-teal-600 font-semibold">{{ crimeReportsCount }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span class="text-gray-600">Fire Reports</span>
                  </div>
                  <span class="text-teal-600 font-semibold">{{ fireReportsCount }}</span>
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg p-4 shadow-neu border border-gray-200">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" v-model="filters.showCrime" class="rounded text-teal-600 shadow-neu-inner" @change="applyFilters" />
                  <span class="text-gray-600">Show Crime Reports</span>
                </div>
                <div class="flex items-center space-x-2">
                  <input type="checkbox" v-model="filters.showFire" class="rounded text-teal-600 shadow-neu-inner" @change="applyFilters" />
                  <span class="text-gray-600">Show Fire Reports</span>
                </div>
                <!-- Date Range -->
                <div class="space-y-2">
                  <label class="block text-sm text-gray-600">Date Range</label>
                  <input
                    type="date"
                    v-model="filters.startDate"
                    class="w-full bg-white rounded p-2 shadow-neu-inner border border-gray-300"
                  />
                  <input
                    type="date"
                    v-model="filters.endDate"
                    class="w-full bg-white rounded p-2 shadow-neu-inner border border-gray-300"
                  />
                  <button
                    @click="applyDateRangeFilter"
                    class="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded shadow-neu transition duration-300 ease-in-out"
                  >
                    Apply Date Range
                  </button>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="bg-white rounded-lg p-4 shadow-neu border border-gray-200">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Legend</h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" class="w-6 h-6" />
                  <span class="text-gray-600">Crime Incident</span>
                </div>
                <div class="flex items-center space-x-2">
                  <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" class="w-6 h-6" />
                  <span class="text-gray-600">Fire Incident</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Container -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-lg shadow-neu p-6 border border-gray-200">
              <div id="map" class="w-full h-[600px] rounded-lg shadow-neu-inner"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Hover Preview Card -->
    <div
      v-if="hoveredReport"
      class="fixed bg-white p-4 rounded-lg shadow-neu border border-gray-200 z-30"
      :style="previewCardStyle"
    >
      <h4 class="font-semibold text-teal-600">{{ hoveredReport.type }} Report</h4>
      <p class="text-sm mt-1 text-gray-600">{{ hoveredReport.subType }}</p>
      <p class="text-sm text-gray-400">{{ formatDate(hoveredReport.timestamp) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import {
  LayoutDashboard,
  FileText,
  Flame,
  FolderOpen,
  MapPin,
  UserCircle,
  Search,
  Map as MapIcon,
  Activity
} from 'lucide-vue-next';

// Declare google as a global variable to avoid ESLint errors
/* global google */

// View options
const viewOptions = [
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'heatmap', label: 'Heatmap', icon: Activity }
];
const currentView = ref('map');

// Search and filters
const searchQuery = ref('');
const searchInput = ref(null);
const filters = ref({
  showCrime: true,
  showFire: true,
  startDate: '',
  endDate: ''
});

// Statistics
const crimeReportsCount = ref(0);
const fireReportsCount = ref(0);

// Timeline
const timelineStart = ref(new Date());
const timelineEnd = ref(new Date());

// Hover preview
const hoveredReport = ref(null);
const previewCardStyle = ref({
  top: '0px',
  left: '0px'
});

// Map variables
let map = null;
let heatmap = null;
let searchBox = null;
const markers = ref([]);
const infoWindows = ref([]);
const allReports = ref([]);

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/reportcrime', icon: FileText, label: 'Report Crime' },
  { path: '/reportfire', icon: Flame, label: 'Report Fire' },
  { path: '/usermap', icon: MapPin, label: 'Map' },
  { path: '/history', icon: FolderOpen, label: 'My Reports' }
];

// Initialize map
const initMap = () => {
  const defaultCenter = { lat: 12.8797, lng: 121.7740 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultCenter,
    zoom: 6,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }]
      }
    ]
  });

  // Initialize SearchBox
  searchBox = new google.maps.places.SearchBox(searchInput.value);

  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
};

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Handle search
const handleSearch = () => {
  const places = searchBox.getPlaces();
  if (places && places.length > 0) {
    const place = places[0];
    if (place.geometry && place.geometry.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  }
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

    // Query crime reports
    const crimeReportsQuery = query(
      collection(db, 'crimeReports'),
      where('userId', '==', currentUser.uid)
    );
    const crimeSnapshot = await getDocs(crimeReportsQuery);
    crimeReportsCount.value = crimeSnapshot.size;

    crimeSnapshot.forEach((doc) => {
      const report = doc.data();
      if (report.coordinates) {
        data.push({
          id: doc.id,
          lat: report.coordinates.latitude,
          lng: report.coordinates.longitude,
          type: 'Crime',
          subType: report.incidentType || 'Unknown',
          location: report.location || 'Not specified',
          timestamp: report.dateTime ? new Date(report.dateTime.seconds * 1000) : new Date(),
          status: report.status || 'Pending'
        });
      }
    });

    // Query fire reports
    const fireReportsQuery = query(
      collection(db, 'fireReports'),
      where('userId', '==', currentUser.uid)
    );
    const fireSnapshot = await getDocs(fireReportsQuery);
    fireReportsCount.value = fireSnapshot.size;

    fireSnapshot.forEach((doc) => {
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

    // Set timeline range
    if (data.length > 0) {
      const dates = data.map(report => report.timestamp);
      timelineStart.value = new Date(Math.min(...dates));
      timelineEnd.value = new Date(Math.max(...dates));
    }

    allReports.value = data;
    applyFilters();
  } catch (error) {
    console.error('Error loading reports:', error);
    alert('Failed to load your reports. Please try again.');
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
        url: report.type === 'Crime'
          ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      },
      animation: google.maps.Animation.DROP,
      title: `${report.type} - ${report.subType}`
    });

    // Create info window content
    const content = `
      <div class="p-3 bg-white text-gray-800 rounded-lg shadow-neu">
        <h3 class="font-bold text-lg mb-2 text-teal-600">${report.type} Report</h3>
        <p><strong class="text-teal-500">Type:</strong> ${report.subType}</p>
        <p><strong class="text-teal-500">Location:</strong> ${report.location}</p>
        <p><strong class="text-teal-500">Date:</strong> ${formatDate(report.timestamp)}</p>
        <p><strong class="text-teal-500">Status:</strong> <span class="px-2 py-1 rounded ${
          report.status === 'Completed' ? 'bg-green-100 text-green-800' :
            report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
        }">${report.status}</span></p>
      </div>
    `;

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    });

    // Add hover event listeners
    marker.addListener('mouseover', () => {
      hoveredReport.value = report;
      const point = map.getProjection().fromLatLngToPoint(marker.getPosition());
      previewCardStyle.value = {
        top: `${point.y}px`,
        left: `${point.x + 20}px`
      };
    });

    marker.addListener('mouseout', () => {
      hoveredReport.value = null;
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

// Apply filters
const applyFilters = (currentDate = null) => {
  const filteredReports = allReports.value.filter(report => {
    const showByType = (report.type === 'Crime' && filters.value.showCrime) ||
      (report.type === 'Fire' && filters.value.showFire);

    const showByDate = (!filters.value.startDate || report.timestamp >= new Date(filters.value.startDate)) &&
      (!filters.value.endDate || report.timestamp <= new Date(filters.value.endDate));

    const showByTimeline = !currentDate || report.timestamp <= currentDate;

    return showByType && showByDate && showByTimeline;
  });

  if (currentView.value === 'map') {
    addMarkersToMap(filteredReports);
  } else {
    updateHeatmap(filteredReports);
  }
};

// New function to apply date range filter
const applyDateRangeFilter = () => {
  applyFilters();
};

// Toggle view between map and heatmap
const toggleView = (viewId) => {
  currentView.value = viewId;
  if (viewId === 'map') {
    if (heatmap) {
      heatmap.setMap(null);
    }
    applyFilters();
  } else {
    markers.value.forEach(marker => marker.setMap(null));
    updateHeatmap(allReports.value);
  }
};

// Update heatmap
const updateHeatmap = (reports) => {
  if (heatmap) {
    heatmap.setMap(null);
  }

  const heatmapData = reports.map(report => ({
    location: new google.maps.LatLng(report.lat, report.lng),
    weight: report.type === 'Crime' ? 1 : 0.5
  }));

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    radius: 20,
    opacity: 0.8
  });
};

// Load Google Maps script and initialize
const loadGoogleMapsScript = () => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places,visualization`;
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

// Watch for changes in filters and update the map
watch(filters, () => {
  // Remove this automatic filter application
  // applyFilters();
}, { deep: true });

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

#map {
  width: 100%;
  height: 600px;
  border-radius: 0.5rem;
}

.shadow-neu {
  box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
}

.shadow-neu-inner {
  box-shadow: inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff;
}

.shadow-neu-bottom {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-neu-top {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #14b8a6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #0d9488;
}
</style>