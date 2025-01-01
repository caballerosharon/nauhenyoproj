<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-poppins relative pb-20">
    <!-- Header -->
    <header class="bg-white shadow-neu-header fixed top-0 w-full z-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-8 w-8" />
            <h1 class="ml-3 text-xl font-semibold text-gray-800">My Reports</h1>
          </div>

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
      <div class="max-w-7xl mx-auto py-6">
        <div class="bg-white rounded-lg shadow-neu p-6">
          <!-- Page Title -->
          <h1 class="text-3xl font-bold text-gray-800 mb-6">My Reports History</h1>

          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search reports..."
                class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700"
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="flex mb-6 space-x-4">
            <select v-model="statusFilter" class="bg-white text-gray-700 p-2 border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Review">Pending Review</option>
            </select>
            <select v-model="typeFilter" class="bg-white text-gray-700 p-2 border border-gray-300 rounded-md shadow-neu-inset focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">All Types</option>
              <option value="crime">Crime Reports</option>
              <option value="fire">Fire Reports</option>
            </select>
          </div>

          <!-- Reports Table -->
          <div class="overflow-x-auto bg-white rounded-lg shadow-neu">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="header in tableHeaders" :key="header.key" 
                      @click="sortBy(header.key)"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    {{ header.label }}
                    <i :class="getSortIcon(header.key)" class="ml-1"></i>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="report in filteredAndSortedReports" :key="report.id" class="hover:bg-gray-50 transition-colors duration-200">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.title }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(report.status)">
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(report.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="openModal(report, 'view')" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300 ease-in-out shadow-neu-sm">
                      View
                    </button>
                    <button @click="openModal(report, 'edit')" class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-neu-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-6 flex items-center justify-between">
            <button @click="prevPage" :disabled="currentPage === 1" 
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out shadow-neu-sm">
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" 
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out shadow-neu-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-neu-bottom z-50">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.path"
            class="flex flex-col items-center justify-center flex-1 min-w-0 hover:bg-gray-50 transition-all duration-300"
          >
            <component 
              :is="item.icon" 
              class="w-6 h-6 mb-1"
              :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
            />
            <span 
              class="text-xs truncate"
              :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
            >
              {{ item.label }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg w-full max-w-2xl relative border border-gray-200 shadow-neu">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <XIcon class="w-6 h-6" />
        </button>
        <h2 class="text-3xl font-bold mb-6 text-gray-800">{{ modalMode === 'view' ? 'View Report' : 'Edit Report' }}</h2>
        <div v-if="selectedReport" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input v-model="selectedReport.id" type="text" readonly class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-neu-inset focus:outline-none text-gray-700">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input v-model="selectedReport.type" type="text" readonly class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-neu-inset focus:outline-none text-gray-700">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="selectedReport.title" type="text" :readonly="modalMode === 'view'" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-700">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input v-model="selectedReport.status" type="text" readonly class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-neu-inset focus:outline-none text-gray-700">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input v-if="modalMode === 'view'" :value="formatDate(selectedReport.date)" type="text" readonly class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-neu-inset focus:outline-none text-gray-700">
              <input v-else v-model="selectedReport.date" type="date" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-700">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input v-model="selectedReport.location" type="text" :readonly="modalMode === 'view'" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-700">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="selectedReport.description" :readonly="modalMode === 'view'" rows="4" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-neu-inset focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-700"></textarea>
          </div>
        </div>
        <div class="mt-8 flex justify-end space-x-4">
          <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out shadow-neu-sm">
            Close
          </button>
          <button v-if="modalMode === 'edit'" @click="saveReport" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out shadow-neu-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useReportStore } from '../stores/reportStore'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { 
  LayoutDashboard, 
  FileText, 
  Flame,
  FolderOpen, 
  MapPin, 
  UserCircle,
  Search,
  XIcon
} from 'lucide-vue-next'

const reportStore = useReportStore()

const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const currentSort = ref('id')
const currentSortDir = ref('asc')
const currentPage = ref(1)
const pageSize = 10
const showModal = ref(false)
const modalMode = ref('view')
const selectedReport = ref(null)

const tableHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'actions', label: 'Actions' },
]

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/reportcrime', icon: FileText, label: 'Report Crime' },
  { path: '/reportfire', icon: Flame, label: 'Report Fire' },
  { path: '/usermap', icon: MapPin, label: 'Map' },
  { path: '/history', icon: FolderOpen, label: 'My Reports' },
]

const allReports = computed(() => {
  return [...reportStore.crimeReports, ...reportStore.fireReports].map(report => ({
    id: report.id,
    title: report.incidentType || 'Incident',
    status: report.status || 'Pending Review',
    date: report.dateTime ? report.dateTime.toDate() : new Date(),
    type: report.incidentType && report.incidentType.toLowerCase().includes('fire') ? 'fire' : 'crime',
    location: report.location || 'N/A',
    description: report.description || 'No description provided'
  }))
})

const filteredReports = computed(() => {
  return allReports.value.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === '' || report.status === statusFilter.value
    const matchesType = typeFilter.value === '' || report.type === typeFilter.value
    return matchesSearch && matchesStatus && matchesType
  })
})

const filteredAndSortedReports = computed(() => {
  const sorted = [...filteredReports.value].sort((a, b) => {
    let modifier = currentSortDir.value === 'desc' ? -1 : 1
    if (a[currentSort.value] < b[currentSort.value]) return -1 * modifier
    if (a[currentSort.value] > b[currentSort.value]) return 1 * modifier
    return 0
  })
  
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sorted.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredReports.value.length / pageSize)
})

function sortBy(key) {
  if (key === currentSort.value) {
    currentSortDir.value = currentSortDir.value === 'asc' ? 'desc' : 'asc'
  }
  currentSort.value = key
}

function getSortIcon(key) {
  if (currentSort.value === key) {
    return currentSortDir.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
  }
  return 'fas fa-sort'
}

function getStatusClass(status) {
  switch (status) {
    case 'Completed':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
    case 'In Progress':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
    case 'Pending Review':
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    default:
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function openModal(report, mode) {
  selectedReport.value = { ...report }
  modalMode.value = mode
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedReport.value = null
}

async function saveReport() {
  try {
    const reportRef = doc(db, selectedReport.value.type === 'fire' ? 'fireReports' : 'crimeReports', selectedReport.value.id)
    await updateDoc(reportRef, {
      incidentType: selectedReport.value.title,
      dateTime: new Date(selectedReport.value.date),
      location: selectedReport.value.location,
      description: selectedReport.value.description
    })

    closeModal()
    // Show a success message
    alert('Report updated successfully')
  } catch (error) {
    console.error('Error updating report:', error)
    alert('Failed to update report')
  }
}

onMounted(() => {
  reportStore.setupRealtimeListeners()
})

onUnmounted(() => {
  reportStore.cleanupListeners()
})

// Watch for changes in the auth state
watch(() => auth.currentUser, (newUser) => {
  if (newUser) {
    reportStore.setupRealtimeListeners()
  } else {
    reportStore.cleanupListeners()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.shadow-neu {
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
}

.shadow-neu-sm {
  box-shadow: 4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff;
}

.shadow-neu-inset {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

.shadow-neu-header {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-neu-bottom {
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
</style>