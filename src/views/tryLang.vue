<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside :class="[
      'bg-[#002855] flex flex-col fixed inset-y-0 left-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]">
      <div class="flex-1 flex flex-col p-4">
        <div :class="['flex items-center mb-8', isSidebarCollapsed ? 'justify-center' : 'gap-3']">
          <div class="w-8 h-8 bg-[#E3EFF6] rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-[#002855] font-bold">N</span>
          </div>
          <h1 :class="['text-xl font-bold text-white transition-opacity duration-300', isSidebarCollapsed ? 'hidden' : 'block']">NauHenyo</h1>
        </div>

        <nav class="flex-1">
          <ul class="space-y-2">
            <li v-for="(item, index) in navigationItems" :key="index">
              <a :href="item.path" 
                 :class="[
                   'flex items-center rounded-lg transition-colors duration-200',
                   item.active ? 'bg-[#041a30] text-white' : 'text-gray-300 hover:bg-[#041a30]/50',
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
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Fixed Top Panel -->
      <div class="bg-[#002855] text-white p-4 flex items-center justify-between shadow-md z-20">
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Menu class="w-6 h-6" />
            <span class="sr-only">Toggle menu</span>
          </button>
          <h1 class="text-2xl font-semibold">Crime Mapping</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-1 rounded-full hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Bell class="w-6 h-6" />
            <span class="sr-only">Notifications</span>
          </button>
          <button class="p-1 rounded-full hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Settings class="w-6 h-6" />
            <span class="sr-only">Settings</span>
          </button>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Crime Heat Map -->
          <div class="bg-white rounded-xl shadow-md p-6 md:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Crime Distribution Heat Map</h2>
            <div class="mb-4 relative">
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search for an area in Naujan"
                class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002855]"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#002855] text-white px-4 py-1 rounded-md hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]"
              >
                Search
              </button>
            </div>
            <div id="map" class="w-full h-[500px] rounded-lg"></div>
          </div>

          <!-- Trend Analysis -->
          <div class="bg-white rounded-xl shadow-md p-6 md:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Crime Trend Analysis</h2>
            <canvas id="trendChart" width="400" height="200"></canvas>
          </div>

          <!-- Crime Statistics -->
          <div class="bg-white rounded-xl shadow-md p-6 md:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Crime Statistics</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="stat in crimeStats" :key="stat.label" class="bg-gray-100 rounded-lg p-4">
                <h3 class="text-sm font-medium text-gray-500">{{ stat.label }}</h3>
                <p class="text-2xl font-bold text-[#002855]">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  MapPin,
  Menu,
  Bell,
  Settings
} from 'lucide-vue-next'

const isSidebarCollapsed = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/npsdashboard', active: false },
  { name: 'Incident Reports', icon: FileText, path: '/npsreports', active: false },
  { name: 'Incident History', icon: History, path: '/npshistory', active: false },
  { name: 'Crime Analytics', icon: BarChart2, path: '/crime-analytics', active: false },
  { name: 'Crime Mapping', icon: MapPin, path: '/crime-mapping', active: true },
]

const crimeStats = [
  { label: 'Total Incidents', value: '5' },
  { label: 'Resolved Cases', value: '2' },
  { label: 'Open Cases', value: '3' },
  { label: 'Crime Rate', value: '+1.2%' },
]

// Updated crime data for Naujan
const crimeData = [
  { location: { lat: 13.3167, lng: 121.3062 }, name: 'Andres Ilagan, Naujan', weight: 1, crimes: 1, info: 'Cybercrime' },
  { location: { lat: 13.2958, lng: 121.3011 }, name: 'Estrella, Naujan', weight: 2, crimes: 2, info: 'Women Abuse, Theft' },
  { location: { lat: 13.3386, lng: 121.3189 }, name: 'Barcenaga, Naujan', weight: 1, crimes: 1, info: 'Women Abuse' },
  { location: { lat: 13.3072, lng: 121.2847 }, name: 'Santiago, Naujan', weight: 1, crimes: 1, info: 'Drug-related' },
]

const getSeverityLabel = (weight) => {
  if (weight <= 1) return 'Low'
  if (weight <= 2) return 'Medium'
  return 'High'
}

let map = null
let heatmap = null
let markers = []
let tooltips = []
let autocomplete = null

const initMap = () => {
  /* eslint-disable no-undef */
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 13.3167, lng: 121.3062 }, // Naujan, Oriental Mindoro
    zoom: 12,
    styles: [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }, { "lightness": 18 }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
      }
    ]
  })

  // Create an array of Google Maps LatLng objects
  const locations = crimeData.map(crime => new google.maps.LatLng(crime.location.lat, crime.location.lng))

  // Create a heatmap layer
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: locations,
    map: map
  })

  // Customize the heatmap
  heatmap.set('radius', 20)
  heatmap.set('opacity', 0.8)

  // Create markers and tooltips for each crime location
  crimeData.forEach(crime => {
    const marker = new google.maps.Marker({
      position: crime.location,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: crime.weight * 3,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        strokeWeight: 0
      }
    })

    const tooltipContent = `
      <div class="crime-tooltip">
        <h3 class="crime-tooltip-title">${crime.name}</h3>
        <p><strong>Total Crimes:</strong> ${crime.crimes}</p>
        <p><strong>Type:</strong> ${crime.info}</p>
        <p><strong>Severity:</strong> ${getSeverityLabel(crime.weight)}</p>
        <p><strong>Location:</strong> Lat: ${crime.location.lat.toFixed(4)}, Lng: ${crime.location.lng.toFixed(4)}</p>
      </div>
    `

    const tooltip = new google.maps.InfoWindow({
      content: tooltipContent,
      maxWidth: 300
    })

    marker.addListener('mouseover', () => {
      tooltip.open(map, marker)
    })

    marker.addListener('mouseout', () => {
      tooltip.close()
    })

    markers.push(marker)
    tooltips.push(tooltip)
  })

  // Create a marker clusterer to manage the markers
  new MarkerClusterer(map, markers, {
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  })

  // Initialize the autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
    types: ['geocode'],
    componentRestrictions: { country: 'PH' },
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(13.2, 121.2), // SW corner of Naujan
      new google.maps.LatLng(13.4, 121.4)  // NE corner of Naujan
    ),
    strictBounds: true
  })

  // Set the autocomplete fields to return
  autocomplete.setFields(['address_components', 'geometry', 'name'])

  // Add listener for place changed event
  autocomplete.addListener('place_changed', handlePlaceChanged)
  /* eslint-enable no-undef */
}

const handlePlaceChanged = () => {
  const place = autocomplete.getPlace()

  if (!place.geometry) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    alert("No details available for input: '" + place.name + "'")
    return
  }

  // If the place has a geometry, then present it on a map.
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport)
  } else {
    map.setCenter(place.geometry.location)
    map.setZoom(17)
  }

  // Create a marker for the selected place
  /* eslint-disable no-undef */
  new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    animation: google.maps.Animation.DROP,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#4CAF50",
      fillOpacity: 0.7,
      strokeWeight: 2,
      strokeColor: "#FFFFFF"
    }
  })
  /* eslint-enable no-undef */
}

const handleSearch = () => {
  const place = autocomplete.getPlace()
  if (place && place.geometry) {
    handlePlaceChanged()
  } else {
    // If no place is selected from autocomplete, perform a text search
    /* eslint-disable no-undef */
    const service = new google.maps.places.PlacesService(map)
    service.textSearch({
      query: searchQuery.value + ', Naujan, Oriental Mindoro, Philippines',
      bounds: map.getBounds()
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
        map.setCenter(results[0].geometry.location)
        map.setZoom(15)
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4CAF50",
            fillOpacity: 0.7,
            strokeWeight: 2,
            strokeColor: "#FFFFFF"
          }
        })
      } else {
        alert('No results found')
      }
    })
    /* eslint-enable no-undef */
  }
}

const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=visualization,geometry,places&callback=initGoogleMaps`
      script.async = true
      script.defer = true
      window.initGoogleMaps = () => {
        resolve(window.google.maps)
      }
      script.onerror = reject
      document.head.appendChild(script)
    }
  })
}

onMounted(async () => {
  try {
    await loadGoogleMapsAPI()
    initMap()
  } catch (error) {
    console.error('Failed to load Google Maps API:', error)
  }

  // Initialize Chart.js
  const ctx = document.getElementById('trendChart')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Crime Incidents',
        data: [1, 2, 3, 4, 5, 5],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})

onUnmounted(() => {
  // Clean up Google Maps objects
  if (map) {
    /* eslint-disable no-undef */
    google.maps.event.clearInstanceListeners(map)
    /* eslint-enable no-undef */
  }
  markers.forEach(marker => {
    /* eslint-disable no-undef */
    google.maps.event.clearInstanceListeners(marker)
    /* eslint-enable no-undef */
  })
  tooltips.forEach(tooltip => {
    /* eslint-disable no-undef */
    google.maps.event.clearInstanceListeners(tooltip)
    /* eslint-enable no-undef */
  })
})
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

:focus-visible {
  outline: 2px solid #002855;
  outline-offset: 2px;
}

.crime-tooltip {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.crime-tooltip-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #002855;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 4px;
}

.crime-tooltip p {
  margin: 4px 0;
  font-size: 14px;
  color: #4a5568;
}

.crime-tooltip strong {
  color: #2d3748;
}

.search-result {
  font-family: 'Poppins', sans-serif;
  padding: 8px;
}

/* Style for autocomplete dropdown */
.pac-container {
  font-family: 'Poppins', sans-serif;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  border-top: none;
}

.pac-item {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

.pac-item:hover {
  background-color: #f7fafc;
}

.pac-item-selected {
  background-color: #edf2f7;
}
</style>