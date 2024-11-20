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

    <!-- Main Content Panel -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#002855] text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-1 rounded-full hover:bg-[#041a30] focus:outline-none focus:ring-2 focus:ring-[#E3EFF6]">
            <Menu class="w-6 h-6" />
            <span class="sr-only">Toggle menu</span>
          </button>
          <h2 class="text-xl font-semibold">Dashboard</h2>
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

      <div class="flex-1 overflow-y-auto p-8">
        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="metric in metrics" :key="metric.title" 
               class="bg-white p-6 rounded-xl shadow">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-500 text-sm">{{ metric.title }}</p>
                <h3 class="text-2xl font-bold mt-1 text-[#002855]">{{ metric.value }}</h3>
              </div>
              <component :is="metric.icon" 
                        class="w-8 h-8 text-[#002855]" />
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Incident Types Chart -->
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-4 text-[#002855]">Incident Types Distribution</h3>
            <div class="h-[300px]">
              <Pie :data="incidentTypesData" :options="pieChartOptions" />
            </div>
          </div>

          <!-- Monthly Trends Chart -->
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-4 text-[#002855]">Monthly Incident Trends</h3>
            <div class="h-[300px]">
              <Line :data="monthlyTrendsData" :options="lineChartOptions" />
            </div>
          </div>
        </div>

        <!-- Recent Incidents Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-[#002855]">Recent Incidents</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm text-gray-500 bg-gray-50">
                  <th class="px-6 py-3 font-medium">ID</th>
                  <th class="px-6 py-3 font-medium">Category</th>
                  <th class="px-6 py-3 font-medium">Location</th>
                  <th class="px-6 py-3 font-medium">Status</th>
                  <th class="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="incident in recentIncidents" 
                    :key="incident.id"
                    class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ incident.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ incident.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ incident.location }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
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
                  <td class="px-6 py-4 whitespace-nowrap">{{ incident.date }}</td>
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
import { ref } from 'vue'
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  User,
  AlertTriangle,
  CheckCircle,
  Radio,
  Menu,
  Bell,
  Settings
} from 'lucide-vue-next'
import { Pie, Line } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/npsdashboard', active: true },
  { name: 'Incident Reports', icon: FileText, path: '/npsreports', active: false },
  { name: 'Incident History', icon: History, path: '/npshistory', active: false },
  { name: 'Crime Analytics', icon: BarChart2, path: '#', active: false },
  { name: 'Account', icon: User, path: '#', active: false },
]

const metrics = [
  { 
    title: 'Total Incidents', 
    value: '10', 
    icon: AlertTriangle,
  },
  { 
    title: 'Pending Incidents', 
    value: '3', 
    icon: FileText,
    trend: -8 
  },
  { 
    title: 'Resolved Cases', 
    value: '2', 
    icon: CheckCircle,
    trend: 23 
  },
  { 
    title: 'Disapproved Reports', 
    value: '5', 
    icon: Radio,
    trend: 4 
  },
]

const recentIncidents = [
  {
    id: 'JG7kFJrWhYHTYMlzvQPF',
    type: 'Theft',
    location: 'Estrella',
    status: 'Pending',
    date: '2024-11-08'
  },
  {
    id: '7w48CfJkCxuWkXsZtZY8',
    type: 'Accident',
    location: 'Brgy. Dao',
    status: 'Resolved',
    date: '2024-11-07'
  },
  {
    id: 'HrpVsWwAB1dtZETdTL3c',
    type: 'Robbery',
    location: 'Brgy. Laguna',
    status: 'Disapproved',
    date: '2024-11-07'
  },
  {
    id: '2VCnByE7YBjZ1YZzhKOX',
    type: 'Women Abuse',
    location: 'Barcenaga',
    status: 'In Progress',
    date: '2024-11-06'
  },
]

// Chart data and options
const incidentTypesData = {
  labels: ['Women Abuse', 'Theft', 'Cybercrime', 'Robbery', 'Other'],
  datasets: [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      data: [4, 2, 1, 1, 2]
    }
  ]
}

const monthlyTrendsData = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      label: 'Incidents',
      data: [0, 0, 0, 0, 0, 10],
      borderColor: '#002855',
      tension: 0.1
    }
  ]
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

:focus-visible {
  outline: 2px solid #002855;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>