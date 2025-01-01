<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside :class="[
      'bg-[#080838] flex flex-col fixed inset-y-0 left-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 bg-[#080838]">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path>
          </svg>
          <span v-if="!isSidebarCollapsed" class="ml-2 text-white font-semibold">NPS Admin</span>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-2 py-4">
        <ul>
          <li v-for="item in navigationItems" :key="item.name" class="mb-2">
            <a v-if="item.path" :href="item.path" :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              item.active ? 'bg-[#002855] text-white' : 'text-gray-300 hover:bg-[#002855] hover:text-white'
            ]">
              <component :is="item.icon" :class="['h-6 w-6', isSidebarCollapsed ? 'mr-0' : 'mr-3']" />
              <span :class="{ 'hidden': isSidebarCollapsed, 'ml-3': !isSidebarCollapsed }">
                {{ item.name }}
              </span>
            </a>
            <button v-else @click="item.action" :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full text-left',
              item.active ? 'bg-[#002855] text-white' : 'text-gray-300 hover:bg-[#002855] hover:text-white'
            ]">
              <component :is="item.icon" :class="['h-6 w-6', isSidebarCollapsed ? 'mr-0' : 'mr-3']" />
              <span :class="{ 'hidden': isSidebarCollapsed, 'ml-3': !isSidebarCollapsed }">
                {{ item.name }}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 class="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p class="mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="showLogoutModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="confirmLogout" 
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Panel -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#080838] text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-1 mr-4 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
            <ChevronLeft v-else class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold">Resolved Crime Reports</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Bell class="h-6 w-6" />
          </button>
          <button class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Settings class="h-6 w-6" />
          </button>
        </div>
      </div>
  
      <!-- Resolved Crime Reports Table -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-semibold text-[#002855]">Resolved Crime Reports</h2>
              <button @click="downloadReportsPDF" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                <FileDown class="h-5 w-5 inline-block mr-2" />
                Download Reports as PDF
              </button>
            </div>
  
            <!-- Search and Filter Section -->
            <div class="flex gap-2 mb-4">
              <div class="relative flex-1">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search incident history..."
                  class="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#002855]"
                  @input="filterReports"
                />
                <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button
                @click="showFilters = !showFilters"
                class="flex items-center gap-2 px-4 py-2 bg-[#002855] text-white rounded-md hover:bg-[#003366] transition-colors duration-200"
              >
                <Filter class="h-5 w-5" />
                Filter
              </button>
            </div>
  
            <!-- Filter Options -->
            <div v-if="showFilters" class="space-y-4 mb-4">
              <div class="flex gap-2 mb-4">
                <button
                  v-for="filterType in ['status', 'date', 'location', 'category']"
                  :key="filterType"
                  @click="activeFilterType = activeFilterType === filterType ? null : filterType"
                  :class="[
                    'px-3 py-1 rounded-lg border transition-colors duration-200',
                    activeFilterType === filterType
                      ? 'bg-[#002855] text-white'
                      : 'border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white'
                  ]"
                >
                  {{ filterType.charAt(0).toUpperCase() + filterType.slice(1) }}
                </button>
              </div>
  
              <div v-if="activeFilterType === 'status'" class="flex gap-2">
                <button 
                  v-for="status in ['Resolved', 'Closed']" 
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
                  v-for="category in ['Women Abuse', 'Robbery', 'Accident', 'Assault', 'Theft', 'Cybercrime', 'Drug-related Crime']" 
                  :key="category"
                  @click="applyFilter('category', category)"
                  class="px-3 py-1 rounded-lg border border-[#002855] text-[#002855] hover:bg-[#002855] hover:text-white transition-colors duration-200"
                >
                  {{ category }}
                </button>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th class="px-6 py-3">ID</th>
                  <th class="px-6 py-3">Category</th>
                  <th class="px-6 py-3">Subcategory</th>
                  <th class="px-6 py-3">Location</th>
                  <th class="px-6 py-3">Date</th>
                  <th class="px-6 py-3">Description</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">{{ report.id }}</td>
                  <td class="px-6 py-4">{{ report.incidentType }}</td>
                  <td class="px-6 py-4">{{ report.incidentSub }}</td>
                  <td class="px-6 py-4">{{ report.location }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(report.dateTime) }}</td>
                  <td class="px-6 py-4">
                    <span class="truncate block max-w-xs">{{ report.description }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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
  Search,
  Filter,
  LogOut,
  FileDown
} from 'lucide-vue-next';
import { useCrimeReportStore } from '@/stores/crimeReportStore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const crimeReportStore = useCrimeReportStore();

const isSidebarCollapsed = ref(false);
const showFilters = ref(false);
const activeFilterType = ref(null);
const searchQuery = ref('');
const dateFilter = ref('');
const locationFilter = ref('');
const showLogoutModal = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  showLogoutModal.value = false;
  window.location.href = '/login';
};

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/npsdashboard", active: false },
  { name: "Crime Reports", icon: FileText, path: "/npsreports", active: false },
  { name: "Police", icon: Users, path: "/npspolice", active: false },
  { name: "Incident History", icon: History, path: "/npshistory", active: true },
  { name: "Crime Analytics", icon: BarChart2, path: "/npsmap", active: false },
  { name: "Logout", icon: LogOut, action: handleLogout, active: false },
];

const resolvedReports = computed(() => 
  crimeReportStore.crimeReports.filter(report => report.status === 'Resolved' || report.status === 'Closed')
);

const filteredReports = ref([]);

const applyFilter = (filterType, value) => {
  filteredReports.value = resolvedReports.value.filter(report => {
    const matchesSearch = Object.values(report).some(val => 
      val && val.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    
    let matchesFilter = true;
    switch (filterType) {
      case 'status':
        matchesFilter = report.status === value;
        break;
      case 'location':
        matchesFilter = report.location.toLowerCase().includes(value.toLowerCase());
        break;
      case 'category':
        matchesFilter = report.incidentType === value;
        break;
    }
    
    return matchesSearch && matchesFilter;
  });
};

const applyDateFilter = () => {
  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value);
    filteredReports.value = resolvedReports.value.filter(report => {
      const reportDate = new Date(report.dateTime.seconds * 1000);
      return reportDate.toDateString() === filterDate.toDateString();
    });
  }
};

const filterReports = () => {
  applyFilter('', ''); // This will apply the search filter
};

const formatDate = (date) => {
  if (date && date.seconds) {
    return new Date(date.seconds * 1000).toLocaleString();
  }
  return 'Invalid Date';
};

const downloadReportsPDF = () => {
  const doc = new jsPDF();
  doc.text('Resolved Crime Reports', 14, 15);
  
  const tableColumn = ["ID", "Category", "Subcategory", "Location", "Date", "Description"];
  const tableRows = filteredReports.value.map(report => [
    report.id,
    report.incidentType,
    report.incidentSub,
    report.location,
    formatDate(report.dateTime),
    report.description
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("resolved_crime_reports.pdf");
};

onMounted(async () => {
  await crimeReportStore.fetchCrimeReports();
  filteredReports.value = resolvedReports.value;
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
</style>