<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside :class="[
      'bg-[#070b0d] flex flex-col fixed inset-y-0 left-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out',
      isSidebarCollapsed ? 'w-16' : 'w-64'
    ]">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 bg-[#070b0d]">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
          </svg>
          <span v-if="!isSidebarCollapsed" class="ml-2 text-white font-semibold">BFP Admin</span>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-2 py-4">
        <ul>
          <li v-for="item in navigationItems" :key="item.name" class="mb-2">
            <a :href="item.path" :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              item.active ? 'bg-[#002855] text-white' : 'text-gray-300 hover:bg-[#002855] hover:text-white'
            ]">
              <component :is="item.icon" :class="['h-6 w-6', isSidebarCollapsed ? 'mr-0' : 'mr-3']" />
              <span :class="{ 'hidden': isSidebarCollapsed, 'ml-3': !isSidebarCollapsed }">
                {{ item.name }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Panel -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#070b0d] text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-1 mr-4 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
            <ChevronLeft v-else class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold">BFP Admin Dashboard</h1>
        </div>
        <div class="flex items-center space-x-4 relative">
          <!-- Notification Bell -->
          <button @click="toggleNotificationModal" class="relative p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Bell class="h-6 w-6" />
            <span v-if="unreadNotificationsCount > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {{ unreadNotificationsCount }}
            </span>
          </button>
          <button class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Settings class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Notification Modal -->
      <div v-if="isNotificationModalOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Notifications</h2>
            <button @click="toggleNotificationModal" class="text-gray-500 hover:text-gray-700">
              <X class="w-6 h-6" />
            </button>
          </div>
          <ul class="space-y-4 max-h-96 overflow-y-auto">
            <li v-for="notification in notifications" :key="notification.id" 
                :class="['flex justify-between items-center p-2 rounded', 
                         notification.read ? 'bg-white' : 'bg-blue-50']">
              <div>
                <p class="text-sm font-medium">{{ notification.title }}</p>
                <p class="text-xs text-gray-500">{{ notification.body }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(notification.timestamp) }}</p>
              </div>
              <button v-if="!notification.read" @click="markAsRead(notification.id)" class="text-xs font-bold text-blue-500 hover:underline">
                Mark as Read
              </button>
            </li>
            <li v-if="notifications.length === 0" class="text-sm text-gray-500">No notifications available.</li>
          </ul>
          <div class="mt-4 flex justify-between">
            <button @click="clearAllNotifications" class="text-sm text-red-500 hover:underline">Clear Read Notifications</button>
            <button @click="markAllAsRead" class="text-sm text-blue-500 hover:underline">Mark All as Read</button>
          </div>
        </div>
      </div>

      <!-- Scrollable content -->
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
          <div v-if="incidentTypesData.labels && incidentTypesData.datasets.length" class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-4 text-[#002855]">Fire Incident Distribution</h3>
            <div class="h-[300px]">
              <Pie :data="incidentTypesData" :options="pieChartOptions" />
            </div>
          </div>
          <div v-if="monthlyTrendsData.labels && monthlyTrendsData.datasets.length" class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-4 text-[#002855]">Monthly Fire Incident Trends</h3>
            <div class="h-[300px]">
              <Line :data="monthlyTrendsData" :options="lineChartOptions" />
            </div>
          </div>
        </div>

        <!-- Recent Incidents Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-[#002855]">Recent Fire Incidents</h3>
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
                  <td class="px-6 py-4 whitespace-nowrap">{{ incident.incidentType }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ incident.location || 'N/A' }}</td>
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
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(incident.dateTime) }}</td>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFireReportStore } from '@/stores/fireReportStore';
import { LayoutDashboard, FileText, History, BarChart2, Menu, ChevronLeft, Bell, Settings, X, Users } from 'lucide-vue-next';
import { Pie, Line } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const fireReportStore = useFireReportStore();
const { notifications, unreadNotificationsCount, fireReports } = storeToRefs(fireReportStore);

const isSidebarCollapsed = ref(false);
const isNotificationModalOpen = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleNotificationModal = () => {
  isNotificationModalOpen.value = !isNotificationModalOpen.value;
};

const markAsRead = (notificationId) => {
  fireReportStore.markNotificationAsRead(notificationId);
};

const markAllAsRead = () => {
  fireReportStore.markAllNotificationsAsRead();
};

const clearAllNotifications = () => {
  fireReportStore.clearNotifications();
};


const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/bfpdashboard", active: true },
  { name: "Fire Reports", icon: FileText, path: "/bfpreports", active: false },
  { name: "Firefighters", icon: Users, path: "/bfpfireman", active: false },
  { name: "Incident History", icon: History, path: "/bfphistory", active: false },
  { name: "Fire Analytics", icon: BarChart2, path: "/bfpmap", active: false },
];

const metrics = computed(() => [
  { title: 'Total Fire Incidents', value: fireReportStore.totalFireReports, icon: Bell },
  { title: 'Pending Fire Incidents', value: fireReportStore.pendingFireReports, icon: FileText },
  { title: 'Resolved Fire Cases', value: fireReportStore.resolvedFireReports, icon: History },
  { title: 'Unassigned Fire Reports', value: fireReportStore.unassignedFireReports, icon: Settings },
]);

const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toLocaleString();
  }
  return 'Invalid Date';
};

const incidentTypesData = computed(() => {
  const typeCounts = fireReports.value.reduce((acc, report) => {
    const type = report.incidentType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        data: Object.values(typeCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };
});

const monthlyTrendsData = computed(() => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('default', { month: 'short' });
  }).reverse();

  const monthlyCounts = fireReports.value.reduce((acc, report) => {
    const reportMonth = new Date(report.dateTime).toLocaleString('default', { month: 'short' });
    acc[reportMonth] = (acc[reportMonth] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: last6Months,
    datasets: [
      {
        label: 'Monthly Trends',
        data: last6Months.map((month) => monthlyCounts[month] || 0),
        borderColor: '#002855',
        tension: 0.1,
      },
    ],
  };
});

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

onMounted(async () => {
  const unsubscribe = await fireReportStore.fetchFireReports();
  onUnmounted(() => {
    unsubscribe(); // Clean up the Firestore listener when the component is unmounted
  });
});
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
  outline: 2px solid #070b0d;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>