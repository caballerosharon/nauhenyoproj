<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <div class="flex">
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
                <router-link :to="item.to" 
                   :class="[
                     'flex items-center rounded-lg transition-colors duration-200',
                     item.current ? 'bg-[#04454B] text-white' : 'text-gray-300 hover:bg-[#04454B]/50',
                     isSidebarCollapsed ? 'justify-center p-2' : 'gap-3 px-4 py-3'
                   ]"
                   :title="item.name">
                  <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                  <span :class="['transition-opacity duration-300', isSidebarCollapsed ? 'hidden' : 'block']">{{ item.name }}</span>
                </router-link>
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
            <h2 class="text-xl font-semibold">Reports History</h2>
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

        <div class="flex-1 overflow-y-auto p-6">
          <div class="bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-3xl font-bold mb-8">Reports History</h1>

            <!-- Filters -->
            <div class="flex mb-4 space-x-4">
              <input v-model="searchQuery" type="text" placeholder="Search reports..." 
                     class="flex-1 p-2 border rounded-md" />
              <select v-model="statusFilter" class="p-2 border rounded-md">
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>

            <!-- Reports Table -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <table class="min-w-full">
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
                  <tr v-for="report in filteredAndSortedReports" :key="report.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.title }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span :class="getStatusClass(report.status)">
                        {{ report.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button @click="openModal(report, 'view')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
                        View
                      </button>
                      <button @click="openModal(report, 'edit')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex items-center justify-between">
              <button @click="prevPage" :disabled="currentPage === 1" 
                      class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button @click="nextPage" :disabled="currentPage === totalPages" 
                      class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg w-full max-w-md relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 class="text-2xl font-bold mb-4">{{ modalMode === 'view' ? 'View Report' : 'Edit Report' }}</h2>
        <div v-if="selectedReport">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">ID</label>
            <input v-model="selectedReport.id" type="text" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="selectedReport.title" type="text" :readonly="modalMode === 'view'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <input v-model="selectedReport.status" type="text" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="selectedReport.date" type="date" :readonly="modalMode === 'view'" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Close
          </button>
          <button v-if="modalMode === 'edit'" @click="saveReport" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
  Menu,
  Bell,
  Settings,
} from 'lucide-vue-next'

const reportStore = useReportStore()

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, current: false },
  { name: 'Report Crime', to: '/reportcrime', icon: FileText, current: false },
  { name: 'Report Fire', to: '/reportfire', icon: Flame, current: false },
  { name: 'My Reports', to: '/history', icon: FolderOpen, current: true },
  { name: 'Map', to: '/usermap', icon: MapPin, current: false },
  { name: 'Profile', to: '/profile', icon: UserCircle, current: false },
]

const searchQuery = ref('')
const statusFilter = ref('')
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
  { key: 'actions', label: 'Actions' },
]

const allReports = computed(() => {
  return [...reportStore.crimeReports, ...reportStore.fireReports].map(report => ({
    id: report.id,
    title: report.incidentType || 'Incident',
    status: report.status || 'Pending',
    date: report.dateTime ? report.dateTime.toDate().toLocaleDateString() : 'N/A',
    type: report.incidentType && report.incidentType.toLowerCase().includes('fire') ? 'fire' : 'crime'
  }))
})

const filteredReports = computed(() => {
  return allReports.value.filter(report => {
    return report.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
           (statusFilter.value === '' || report.status === statusFilter.value)
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