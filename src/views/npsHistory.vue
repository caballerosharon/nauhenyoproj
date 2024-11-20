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
      <div class="bg-white shadow-md z-20">
        <!-- Top Bar -->
        <div class="bg-[#002855] text-white p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
              <Menu class="w-6 h-6" />
              <span class="sr-only">Toggle menu</span>
            </button>
            <h1 class="text-2xl font-semibold">Incident History</h1>
          </div>
          <div class="flex items-center space-x-4">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search incident history..."
              class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855] w-64 text-gray-800"
            />
            <div class="relative">
              <button 
                @click="toggleFilterMenu"
                class="bg-white text-[#002855] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <Filter class="w-5 h-5" />
                Filter
              </button>
              <div v-if="showFilterMenu" class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button @click="setActiveFilter('status')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Status
                  </button>
                  <button @click="setActiveFilter('date')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Date Reported
                  </button>
                  <button @click="setActiveFilter('location')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Location
                  </button>
                  <button @click="setActiveFilter('category')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Type of Incident
                  </button>
                </div>
              </div>
            </div>
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


        <!-- Active Filters -->
        <div v-if="activeFilters.length > 0" class="bg-white border-b border-gray-200 p-4">
          <div class="flex flex-wrap gap-2">
            <div v-for="filter in activeFilters" :key="filter.type" class="bg-[#002855] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {{ filter.type }}: {{ filter.value }}
              <button @click="removeFilter(filter.type)" class="focus:outline-none">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Options -->
        <div v-if="activeFilterType" class="bg-white border-b border-gray-200 p-4">
          <div v-if="activeFilterType === 'status'" class="flex gap-2">
            <button 
              v-for="status in ['Resolved', 'Resolved']" 
              :key="status"
              @click="applyFilter('status', status)"
              class="px-3 py-1 rounded-lg border border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white transition-colors duration-200"
            >
              {{ status }}
            </button>
          </div>
          <div v-if="activeFilterType === 'date'" class="flex flex-col gap-2">
            <label for="dateReported" class="text-sm font-medium text-gray-700">Date Reported:</label>
            <div class="flex gap-2">
              <input 
                id="dateReported"
                type="date" 
                v-model="dateFilter"
                class="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#002855]"
              />
              <button 
                @click="applyDateFilter"
                class="px-3 py-1 rounded-lg bg-[#002855] text-white hover:bg-[#003366] transition-colors duration-200"
              >
                Apply
              </button>
            </div>
          </div>
          <div v-if="activeFilterType === 'location'" class="flex gap-2">
            <input 
              type="text" 
              v-model="locationFilter"
              placeholder="Enter location"
              class="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#002855]"
            />
            <button 
              @click="applyFilter('location', locationFilter)"
              class="px-3 py-1 rounded-lg bg-[#002855] text-white hover:bg-[#003366] transition-colors duration-200"
            >
              Apply
            </button>
          </div>
          <div v-if="activeFilterType === 'category'" class="flex gap-2">
            <button 
              v-for="category in ['Women Abuse', 'Robbery', 'Accident', 'Assault', 'Theft', 'Cybercrime']" 
              :key="category"
              @click="applyFilter('category', category)"
              class="px-3 py-1 rounded-lg border border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white transition-colors duration-200"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-8 pt-20">
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 text-left text-sm text-gray-500">
                <th class="px-6 py-3 font-medium text-left">ID</th>
                <th class="px-6 py-3 font-medium text-left">Category</th>
                <th class="px-6 py-3 font-medium text-left">Location</th>
                <th class="px-6 py-3 font-medium text-left">Date Reported</th>
                <th class="px-6 py-3 font-medium text-left">Date Completed</th>
                <th class="px-6 py-3 font-medium text-left">Status</th>
                <th class="px-6 py-3 font-medium text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="incident in filteredIncidents" :key="incident.id" class="border-t border-gray-100">
                <td class="px-6 py-4 text-left">{{ incident.id }}</td>
                <td class="px-6 py-4 text-left">{{ incident.category }}</td>
                <td class="px-6 py-4 text-left">{{ incident.location }}</td>
                <td class="px-6 py-4 text-left">{{ incident.dateReported }}</td>
                <td class="px-6 py-4 text-left">{{ incident.dateResolved }}</td>
                <td class="px-6 py-4 text-left">
                  <span :class="{
                    'px-2 py-1 rounded-full text-xs font-medium': true,
                    'bg-green-100 text-green-800': incident.status === 'Resolved',
                    'bg-gray-100 text-gray-800': incident.status === 'Closed'
                  }">
                    {{ incident.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-left">
                  <button @click="viewIncidentDetails(incident)" class="bg-[#002855] text-white px-3 py-1 rounded-md hover:bg-[#003366] transition-colors duration-200">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Incident Details Modal -->
    <div v-if="selectedIncident" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 class="text-2xl font-semibold mb-4">Incident Details</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="font-medium">ID:</p>
            <p>{{ selectedIncident.id }}</p>
          </div>
          <div>
            <p class="font-medium">Category:</p>
            <p>{{ selectedIncident.category }}</p>
          </div>
          <div>
            <p class="font-medium">Location:</p>
            <p>{{ selectedIncident.location }}</p>
          </div>
          <div>
            <p class="font-medium">Date Reported:</p>
            <p>{{ selectedIncident.dateReported }}</p>
          </div>
          <div>
            <p class="font-medium">Date Resolved:</p>
            <p>{{ selectedIncident.dateResolved }}</p>
          </div>
          <div>
            <p class="font-medium">Status:</p>
            <p>{{ selectedIncident.status }}</p>
          </div>
        </div>
        <div class="mb-4">
          <p class="font-medium">Description:</p>
          <p>{{ selectedIncident.description }}</p>
        </div>
        <div class="mb-4">
          <p class="font-medium">Resolution:</p>
          <p>{{ selectedIncident.resolution }}</p>
        </div>
        <button @click="closeIncidentModal" class="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-[#003366] transition-colors duration-200">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  User,
  Filter,
  X,
  Menu,
  Bell,
  Settings
} from 'lucide-vue-next'

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/npsdashboard', active: false },
  { name: 'Incident Reports', icon: FileText, path: '/npsreports', active: false },
  { name: 'Incident History', icon: History, path: '/npshistory', active: true },
  { name: 'Crime Analytics', icon: BarChart2, path: '/try', active: false },
  { name: 'Account', icon: User, path: '/account', active: false },
]

const incidents = ref([
  {
    id: '7w48CfJkCxuWkXsZtZY8',
    category: 'Accident',
    location: 'Dao, Naujan',
    dateReported: '2024-11-07',
    dateResolved: '2024-11-08',
    status: 'Resolved',
    description: 'bali ang paa',
    resolution: 'treated'
  },
  {
    id: 'HrpVsWwAB1dtZETdTL3c',
    category: 'Robbery',
    location: 'Laguna, Naujan',
    dateReported: '2024-11-07',
    dateResolved: '2024-11-07',
    status: 'Disapproved',
    description: 'mncbcvcx',
    resolution: 'investigated'
  },
  {
    id: 'MBPt7yvMo27njST5iRFf',
    category: 'Women Abuse',
    location: 'Laguna, Naujan',
    dateReported: '2024-11-06',
    dateResolved: '2024-11-06',
    status: 'Disapproved',
    description: 'sinakal',
    resolution: 'investigated'
  },
  {
    id: 'R4LwxrDzICFy6SvhHTC1',
    category: 'Women Abuse',
    location: 'Bayani',
    dateReported: '2024-11-06',
    dateResolved: '2024-11-06',
    status: 'Disapproved',
    description: 'binarog',
    resolution: 'investigated'
  },
  {
    id: 'Tq0AJUezpr49AN1Fxj3M',
    category: 'Theft',
    location: 'Melgar, Naujan',
    dateReported: '2024-11-07',
    dateResolved: '2024-11-07',
    status: 'Disapproved',
    description: 'ttttttttttttt',
    resolution: 'investigated'
  },
  {
    id: 'Vx76YxDBUYDhg2f7Cuwg',
    category: 'Women Abuse',
    location: 'Estrella, Naujan',
    dateReported: '2024-11-06',
    dateResolved: '2024-11-06',
    status: 'Disapproved',
    description: 'qwerty',
    resolution: 'investigated'
  },
  {
    id: 'YHVxN4JuUSauJQ1lc9Fr',
    category: 'Drug-related Crime',
    location: 'Santiago, Naujan',
    dateReported: '2024-11-08',
    dateResolved: '2024-11-08',
    status: 'Resolved',
    description: 'adik',
    resolution: 'resolved'
  }
])

const searchQuery = ref('')
const selectedIncident = ref(null)
const showFilterMenu = ref(false)
const activeFilterType = ref('')
const activeFilters = ref([])
const dateFilter = ref('')
const locationFilter = ref('')

const filteredIncidents = computed(() => {
  return incidents.value.filter(incident => {
    const matchesSearch = Object.values(incident).some(value => 
      value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    const matchesFilters = activeFilters.value.every(filter => {
      if (filter.type === 'date') {
        return incident.dateReported === filter.value
      }
      return incident[filter.type].toLowerCase() === filter.value.toLowerCase()
    })
    return matchesSearch && matchesFilters
  })
})

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
}

const setActiveFilter = (filterType) => {
  activeFilterType.value = filterType
  showFilterMenu.value = false
}

const applyFilter = (type, value) => {
  const existingFilterIndex = activeFilters.value.findIndex(filter => filter.type === type)
  if (existingFilterIndex !== -1) {
    activeFilters.value.splice(existingFilterIndex, 1)
  }
  activeFilters.value.push({ type, value })
  activeFilterType.value = ''
}

const applyDateFilter = () => {
  if (dateFilter.value) {
    applyFilter('date', dateFilter.value)
  }
}

const removeFilter = (filterType) => {
  activeFilters.value = activeFilters.value.filter(filter => filter.type !== filterType)
}

const viewIncidentDetails = (incident) => {
  selectedIncident.value = incident
}

const closeIncidentModal = () => {
  selectedIncident.value = null
}
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
</style>