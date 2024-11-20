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
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#002855] text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Menu class="w-6 h-6" />
            <span class="sr-only">Toggle menu</span>
          </button>
          <h2 class="text-xl font-semibold">Incident Reports</h2>
        </div>
        <div class="flex items-center space-x-4">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search incidents..."
            class="w-64 h-8 px-3 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002855]"
          />
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

      <!-- Fixed Panel with Table -->
      <div class="flex-1 overflow-hidden">
        <!-- Table with fixed header and scrollable body -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">ID</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Category</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Sub-Category</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Location</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Date</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Time</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Status</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Action</th>
                <th class="sticky top-0 px-6 py-3 font-medium text-left bg-gray-50">Edit Status</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="incident in filteredIncidents" :key="incident.id" class="border-t border-gray-100">
                <td class="px-6 py-4 text-left">{{ incident.id }}</td>
                <td class="px-6 py-4 text-left">{{ incident.category }}</td>
                <td class="px-6 py-4 text-left">{{ incident.subCategory }}</td>
                <td class="px-6 py-4 text-left">{{ incident.location }}</td>
                <td class="px-6 py-4 text-left">{{ incident.date }}</td>
                <td class="px-6 py-4 text-left">{{ incident.time }}</td>
                <td class="px-6 py-4 text-left">
                  <span :class="{
                    'px-2 py-1 rounded-full text-xs font-medium': true,
                    'bg-yellow-100 text-yellow-800': incident.status === 'Pending',
                    'bg-blue-100 text-blue-800': incident.status === 'In Progress',
                    'bg-green-100 text-green-800': incident.status === 'Resolved',
                    'bg-red-100 text-red-800': incident.status === 'Disapproved'
                  }">
                    {{ incident.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-left">
                  <button @click="viewIncident(incident)" class="bg-[#002855] text-white px-3 py-1 rounded-md hover:bg-[#003366] transition-colors duration-200 mr-2">
                    View
                  </button>
                  <button @click="openApprovalModal(incident)" class="bg-[#002855] text-white px-3 py-1 rounded-md hover:bg-[#003366] transition-colors duration-200">
                    Approval
                  </button>
                </td>
                <td class="px-6 py-4 text-left">
                  <button 
                    @click="openStatusModal(incident)" 
                    class="bg-[#002855] text-white px-3 py-1 rounded-md hover:bg-[#003366] transition-colors duration-200"
                    :disabled="!incident.approved"
                  >
                    Edit Status
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- View Incident Modal -->
    <div v-if="selectedIncident && activeModal === 'view'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full relative">
        <button @click="closeIncidentModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XIcon class="w-6 h-6" />
        </button>
        <h2 class="text-2xl font-semibold mb-6">Incident Details</h2>
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p class="font-medium text-gray-600">ID:</p>
            <p>{{ selectedIncident.id }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Category:</p>
            <p>{{ selectedIncident.category }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Sub-Category:</p>
            <p>{{ selectedIncident.subCategory }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Location:</p>
            <p>{{ selectedIncident.location }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Date:</p>
            <p>{{ selectedIncident.date }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Time:</p>
            <p>{{ selectedIncident.time }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Status:</p>
            <p>{{ selectedIncident.status }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Approved:</p>
            <p>{{ selectedIncident.approved ? 'Yes' : 'No' }}</p>
          </div>
        </div>
        <div class="mb-6">
          <p class="font-medium text-gray-600 mb-2">Details:</p>
          <p class="bg-gray-50 p-4 rounded">{{ selectedIncident.details }}</p>
        </div>
      </div>
    </div>

    <!-- Change Status Modal -->
    <div v-if="statusModalOpen && activeModal === 'status'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-semibold mb-4">Change Incident Status</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
          <select v-model="newStatus" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Disapproved">Disapproved</option>
          </select>
        </div>
        <div class="flex justify-end gap-4">
          <button @click="closeStatusModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Cancel
          </button>
          <button @click="updateIncidentStatus" class="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-[#003366] transition-colors duration-200">
            Update Status
          </button>
        </div>
      </div>
    </div>

    <!-- Approval Modal -->
    <div v-if="approvalModalOpen && activeModal === 'approval'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-semibold mb-4">Approve or Disapprove Report</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Decision</label>
          <select v-model="approvalDecision" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]">
            <option value="approve">Approve</option>
            <option value="disapprove">Disapprove</option>
          </select>
        </div>
        <div v-if="approvalDecision === 'disapprove'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Disapproval</label>
          <textarea 
            v-model="disapprovalReason" 
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002855]"
            rows="3"
          ></textarea>
        </div>
        <div class="flex justify-end gap-4">
          <button @click="closeApprovalModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Cancel
          </button>
          <button @click="submitApprovalDecision" class="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-[#003366] transition-colors duration-200">
            Submit Decision
          </button>
        </div>
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
  XIcon,
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
  { name: 'Incident Reports', icon: FileText, path: '/npsreports', active: true },
  { name: 'Incident History', icon: History, path: '/npshistory', active: false },
  { name: 'Crime Analytics', icon: BarChart2, path: '/crime-analytics', active: false },
  { name: 'Account', icon: User, path: '/account', active: false },
]

const incidents = ref([
  {
    id: 'JG7kFJrWhYHTYMlzvQPF',
    category: 'Theft',
    subCategory: 'Grand theft',
    location: 'Estrella, Naujan',
    date: '2024-11-08',
    time: '20:29',
    status: 'Pending',
    details: 'qwertyu',
    approved: true
  },
  {
    id: '7w48CfJkCxuWkXsZtZY8',
    category: 'Accident',
    subCategory: 'Traffic accident',
    location: 'Dao, Naujan',
    date: '2024-11-07',
    time: '23:04',
    status: 'Resolved',
    details: 'bali ang paa',
    approved: true
  },
  {
    id: 'HrpVsWwAB1dtZETdTL3c',
    category: 'Robbery',
    subCategory: 'Armed robbery',
    location: 'Laguna, Naujan',
    date: '2024-11-07',
    time: '00:35',
    status: 'Disapproved',
    details: 'mncbcvcx',
    approved: false
  },
  {
    id: '2VCnByE7YBjZ1YZzhKOX',
    category: 'Women Abuse',
    subCategory: 'Physical abuse',
    location: 'Barcenaga, Naujan',
    date: '2024-11-06',
    time: '00:47',
    status: 'In Progress',
    details: 'sinakal',
    approved: true
  },
  {
    id: 'MBPt7yvMo27njST5iRFf',
    category: 'Women Abuse',
    subCategory: 'Physical abuse',
    location: 'Laguna, Naujan',
    date: '2024-11-06',
    time: '00:47',
    status: 'Disapproved',
    details: 'sinakal',
    approved: false
  },
  {
    id: 'R4LwxrDzICFy6SvhHTC1',
    category: 'Women Abuse',
    subCategory: 'Physical abuse',
    location: 'Bayani, Naujan',
    date: '2024-11-06',
    time: '23:04',
    status: 'Disapproved',
    details: 'binarog',
    approved: false
  },
  {
    id: 'Tq0AJUezpr49AN1Fxj3M',
    category: 'Theft',
    subCategory: 'Pickpocketing',
    location: 'Melgar, Naujan',
    date: '2024-11-07',
    time: '23:21',
    status: 'Disapproved',
    details: 'ttttttttttttt',
    approved: false
  },
  {
    id: 'UC6nfADFDXcVrYyAKEKs',
    category: 'Cybercrime',
    subCategory: 'Online fraud',
    location: 'Ylagan Andres, Naujan',
    date: '2024-11-08',
    time: '01:34',
    status: 'Pending',
    details: 'cccccccccccccccc',
    approved: true
  },
  {
    id: 'Vx76YxDBUYDhg2f7Cuwg',
    category: 'Women Abuse',
    subCategory: 'Physical abuse',
    location: 'Estrella, Naujan',
    date: '2024-11-06',
    time: '16:41',
    status: 'Disapproved',
    details: 'qwerty',
    approved: false
  },
  {
    id: 'YHVxN4JuUSauJQ1lc9Fr',
    category: 'Drug-related Crime',
    subCategory: 'Trafficking',
    location: 'Santiago, Naujan',
    date: '2024-11-08',
    time: '01:19',
    status: 'Resolved',
    details: 'adik',
    approved: true
  }
])

const searchQuery = ref('')
const selectedIncident = ref(null)
const statusModalOpen = ref(false)
const newStatus = ref('')
const approvalModalOpen = ref(false)
const approvalDecision = ref('approve')
const disapprovalReason = ref('')
const activeModal = ref(null)

const filteredIncidents = computed(() => {
  return incidents.value.filter(incident => 
    Object.values(incident).some(value => 
      value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

const viewIncident = (incident) => {
  if (activeModal.value === null) {
    selectedIncident.value = incident
    activeModal.value = 'view'
  }
}

const closeIncidentModal = () => {
  selectedIncident.value = null
  activeModal.value = null
}

const openStatusModal = (incident) => {
  if (incident.approved && activeModal.value === null) {
    selectedIncident.value = incident
    newStatus.value = incident.status
    statusModalOpen.value = true
    activeModal.value = 'status'
  }
}

const closeStatusModal = () => {
  statusModalOpen.value = false
  selectedIncident.value = null
  newStatus.value = ''
  activeModal.value = null
}

const updateIncidentStatus = () => {
  if (selectedIncident.value) {
    const index = incidents.value.findIndex(inc => inc.id === selectedIncident.value.id)
    if (index !== -1) {
      incidents.value[index].status = newStatus.value
    }
  }
  closeStatusModal()
}

const openApprovalModal = (incident) => {
  if (activeModal.value === null) {
    selectedIncident.value = incident
    approvalDecision.value = 'approve'
    disapprovalReason.value = ''
    approvalModalOpen.value = true
    activeModal.value = 'approval'
  }
}

const closeApprovalModal = () => {
  approvalModalOpen.value = false
  selectedIncident.value = null
  approvalDecision.value = 'approve'
  disapprovalReason.value = ''
  activeModal.value = null
}

const submitApprovalDecision = () => {
  if (selectedIncident.value) {
    const index = incidents.value.findIndex(inc => inc.id === selectedIncident.value.id)
    if (index !== -1) {
      incidents.value[index].approved = approvalDecision.value === 'approve'
      if (approvalDecision.value === 'disapprove') {
        incidents.value[index].status = 'Disapproved'
        incidents.value[index].disapprovalReason = disapprovalReason.value
      }
    }
  }
  closeApprovalModal()
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