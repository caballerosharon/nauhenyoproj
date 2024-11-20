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
          <h1 class="text-2xl font-semibold">My Reports Map</h1>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">My Reports Distribution Map</h2>
          <div id="map" class="w-full h-[600px] rounded-lg"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import {
  LayoutDashboard,
  FileText,
  Flame,
  FolderOpen,
  MapPin,
  UserCircle,
  Menu,
} from 'lucide-vue-next'

const isSidebarCollapsed = ref(false)
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, current: false },
  { name: 'Report Crime', to: '/reportcrime', icon: FileText, current: false },
  { name: 'Report Fire', to: '/reportfire', icon: Flame, current: false },
  { name: 'My Reports', to: '/history', icon: FolderOpen, current: false },
  { name: 'Map', to: '/usermap', icon: MapPin, current: true },
  { name: 'Profile', to: '/profile', icon: UserCircle, current: false },
]

// Google Maps variables
let map = null
const markers = ref([])
const infoWindows = ref([])

// Initialize the map
const initMap = () => {
  // Center on Philippines
  const defaultCenter = { lat: 12.8797, lng: 121.7740 }
  
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
  })
}

// Fetch user's reports from Firestore
const loadUserReports = async () => {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error('No user logged in')
      return
    }

    const data = []
    
    // Query crime reports
    const crimeReportsQuery = query(
      collection(db, 'crimeReports'), 
      where('userId', '==', currentUser.uid)
    )
    const crimeSnapshot = await getDocs(crimeReportsQuery)
    
    crimeSnapshot.forEach((doc) => {
      const report = doc.data()
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
        })
      }
    })

    // Query fire reports
    const fireReportsQuery = query(
      collection(db, 'fireReports'), 
      where('userId', '==', currentUser.uid)
    )
    const fireSnapshot = await getDocs(fireReportsQuery)
    
    fireSnapshot.forEach((doc) => {
      const report = doc.data()
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
        })
      }
    })

    addMarkersToMap(data)
  } catch (error) {
    console.error('Error loading reports:', error)
    alert('Failed to load your reports. Please try again.')
  }
}

// Add markers to the map
const addMarkersToMap = (reports) => {
  // Clear existing markers and info windows
  markers.value.forEach(marker => marker.setMap(null))
  infoWindows.value.forEach(window => window.close())
  markers.value = []
  infoWindows.value = []

  if (reports.length === 0) {
    return
  }

  const bounds = new google.maps.LatLngBounds()

  reports.forEach((report) => {
    const position = new google.maps.LatLng(report.lat, report.lng)
    bounds.extend(position)

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
    })

    // Create info window content
    const content = `
      <div class="p-3">
        <h3 class="font-bold text-lg mb-2">${report.type} Report</h3>
        <p><strong>Type:</strong> ${report.subType}</p>
        <p><strong>Location:</strong> ${report.location}</p>
        <p><strong>Date:</strong> ${report.timestamp.toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="px-2 py-1 rounded ${
          report.status === 'Completed' ? 'bg-green-100 text-green-800' :
          report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }">${report.status}</span></p>
      </div>
    `

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    })

    // Add click listener to marker
    marker.addListener('click', () => {
      infoWindows.value.forEach(window => window.close())
      infoWindow.open(map, marker)
    })

    markers.value.push(marker)
    infoWindows.value.push(infoWindow)
  })

  // Fit map to show all markers
  map.fitBounds(bounds)
  
  // If only one marker, zoom out slightly
  if (reports.length === 1) {
    map.setZoom(15)
  }
}

// Load Google Maps script and initialize
const loadGoogleMapsScript = () => {
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places`
  script.async = true
  script.defer = true
  script.onload = () => {
    initMap()
    loadUserReports()
  }
  document.head.appendChild(script)
}

onMounted(() => {
  loadGoogleMapsScript()
})

onUnmounted(() => {
  markers.value.forEach(marker => marker.setMap(null))
  infoWindows.value.forEach(window => window.close())
})
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