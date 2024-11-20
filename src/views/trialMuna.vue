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
            <li v-for="(item, index) in menuItems" :key="index">
              <RouterLink :to="item.to" :class="[
                'flex items-center rounded-lg transition-colors duration-200',
                item.current ? 'bg-[#04454B] text-white' : 'text-gray-300 hover:bg-[#04454B]/50',
                isSidebarCollapsed ? 'justify-center p-2' : 'gap-3 px-4 py-3'
              ]" :title="item.name">
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span :class="['transition-opacity duration-300', isSidebarCollapsed ? 'hidden' : 'block']">{{ item.name }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Fixed Top Panel -->
      <div class="bg-[#05808C] text-white p-4 flex items-center justify-between shadow-md z-20">
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-[#04454B] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Menu class="w-6 h-6" />
            <span class="sr-only">Toggle menu</span>
          </button>
          <h1 class="text-2xl font-semibold">Reports Map</h1>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="grid grid-cols-1 gap-6">
          <!-- Map Panel -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Reports Distribution Map</h2>
            <!-- Filter Controls -->
            <div class="mb-4 flex space-x-4">
              <select v-model="reportTypeFilter" class="p-2 border rounded-md">
                <option value="all">All Reports</option>
                <option value="crime">Crime Reports</option>
                <option value="fire">Fire Reports</option>
              </select>
              <select v-model="userFilter" class="p-2 border rounded-md">
                <option value="all">All Reports</option>
                <option value="user">My Reports</option>
              </select>
            </div>
            <div id="map" class="w-full h-[600px] rounded-lg"></div>
          </div>

          <!-- Statistics Panels -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Highest Crime Area Panel -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <div class="flex items-center mb-4">
                <AlertTriangle class="w-6 h-6 text-red-500 mr-2" />
                <h2 class="text-xl font-semibold">Highest Crime Area</h2>
              </div>
              <p><strong>Area:</strong> {{ highestCrimeArea.name }}</p>
              <p><strong>Incidents:</strong> {{ highestCrimeArea.count }}</p>
            </div>

            <!-- Highest Fire Area Panel -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <div class="flex items-center mb-4">
                <Flame class="w-6 h-6 text-orange-500 mr-2" />
                <h2 class="text-xl font-semibold">Highest Fire Area</h2>
              </div>
              <p><strong>Area:</strong> {{ highestFireArea.name }}</p>
              <p><strong>Incidents:</strong> {{ highestFireArea.count }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import {
  LayoutDashboard,
  FileText,
  Flame,
  FolderOpen,
  MapPin,
  UserCircle,
  Menu,
  AlertTriangle,
} from 'lucide-vue-next'

const isSidebarCollapsed = ref(false)
const map = ref(null)
const markers = ref([])
const reports = ref([])
const reportTypeFilter = ref('all')
const userFilter = ref('all')
const highestCrimeArea = ref({ name: 'N/A', count: 0 })
const highestFireArea = ref({ name: 'N/A', count: 0 })

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, current: false },
  { name: 'Report Crime', to: '/reportcrime', icon: FileText, current: false },
  { name: 'Report Fire', to: '/reportfire', icon: Flame, current: false },
  { name: 'My Reports', to: '/history', icon: FolderOpen, current: false },
  { name: 'Map', to: '/usermap', icon: MapPin, current: true },
  { name: 'Profile', to: '/', icon: UserCircle, current: false },
]

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const initMap = () => {
  if (typeof google === 'undefined') {
    console.error('Google Maps API not loaded')
    return
  }

  const naujanCenter = { lat: 13.3167, lng: 121.3000 }
  const mapOptions = {
    center: naujanCenter,
    zoom: 12,
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
  }
  map.value = new google.maps.Map(document.getElementById('map'), mapOptions)
}

const loadGoogleMapsScript = () => {
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places&callback=initMap`
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

const fetchReports = async () => {
  try {
    const crimeReports = await getDocs(collection(db, 'crimeReports'))
    const fireReports = await getDocs(collection(db, 'fireReports'))
    
    reports.value = [
      ...crimeReports.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Crime' })),
      ...fireReports.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Fire' }))
    ]
    updateStatistics()
  } catch (error) {
    console.error('Error fetching reports:', error)
  }
}

const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const typeMatch = reportTypeFilter.value === 'all' || report.type.toLowerCase() === reportTypeFilter.value
    const userMatch = userFilter.value === 'all' || (userFilter.value === 'user' && report.userId === auth.currentUser?.uid)
    return typeMatch && userMatch
  })
})

const updateMarkers = () => {
  clearMarkers()
  filteredReports.value.forEach(report => {
    if (report.coordinates) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(report.coordinates.latitude, report.coordinates.longitude),
        map: map.value,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: report.type === 'Crime' ? '#4D96FF' : '#FF6B6B',
          fillOpacity: 0.7,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          scale: 10
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(report)
      })

      marker.addListener('click', () => {
        infoWindow.open(map.value, marker)
      })

      markers.value.push(marker)
    }
  })
}

const createInfoWindowContent = (report) => {
  return `
    <div class="p-3">
      <h3 class="font-bold text-lg mb-2">${report.type} Report</h3>
      <p><strong>Incident Type:</strong> ${report.incidentType || 'N/A'}</p>
      <p><strong>Location:</strong> ${report.location || 'N/A'}</p>
      <p><strong>Date:</strong> ${report.dateTime ? new Date(report.dateTime.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Status:</strong> ${report.status || 'Pending'}</p>
    </div>
  `
}

const clearMarkers = () => {
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []
}

const updateStatistics = () => {
  const areaStats = {}
  reports.value.forEach(report => {
    if (report.location) {
      if (!areaStats[report.location]) {
        areaStats[report.location] = { crime: 0, fire: 0 }
      }
      if (report.type === 'Crime') {
        areaStats[report.location].crime++
      } else if (report.type === 'Fire') {
        areaStats[report.location].fire++
      }
    }
  })

  let maxCrime = { name: 'N/A', count: 0 }
  let maxFire = { name: 'N/A', count: 0 }

  Object.entries(areaStats).forEach(([location, stats]) => {
    if (stats.crime > maxCrime.count) {
      maxCrime = { name: location, count: stats.crime }
    }
    if (stats.fire > maxFire.count) {
      maxFire = { name: location, count: stats.fire }
    }
  })

  highestCrimeArea.value = maxCrime
  highestFireArea.value = maxFire
}

onMounted(() => {
  window.initMap = () => {
    initMap()
    fetchReports()
  }
  loadGoogleMapsScript()
})

onUnmounted(() => {
  clearMarkers()
})

watch([reportTypeFilter, userFilter], () => {
  updateMarkers()
})

watch(filteredReports, () => {
  updateMarkers()
}, { deep: true })
</script>

<style scoped>
#map {
  width: 100%;
  height: 600px;
  border-radius: 0.5rem;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>