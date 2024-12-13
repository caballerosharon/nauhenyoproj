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
      <div class="bg-[#080838] text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-1 mr-4 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
            <ChevronLeft v-else class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold">NPS Admin Dashboard</h1>
        </div>
        <div class="flex items-center space-x-4 relative">
          <!-- Notification Bell -->
          <button @click="toggleNotificationModal" class="relative p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Bell class="h-6 w-6" />
            <span v-if="unreadNotificationsCount > 0" class="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></span>
          </button>
          <button class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Settings class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Notification Modal -->
      <TransitionRoot appear :show="isNotificationModalOpen" as="template">
        <Dialog as="div" @close="closeNotificationModal" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Notifications
                  </DialogTitle>
                  <div class="mt-2 max-h-96 overflow-y-auto">
                    <TransitionGroup
                      name="notification-list"
                      tag="ul"
                      class="space-y-4"
                    >
                      <li v-for="notification in sortedNotifications" :key="notification.id" 
                          class="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ease-in-out"
                          :class="notification.read ? 'bg-gray-50' : 'bg-blue-50'">
                        <div class="flex-shrink-0">
                          <component :is="getNotificationIcon(notification.type)" class="h-6 w-6" :class="getNotificationIconColor(notification.type)" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900">
                            {{ notification.title }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ notification.body }}
                          </p>
                          <p class="text-xs text-gray-400 mt-1">
                            {{ formatDate(notification.timestamp) }}
                          </p>
                        </div>
                        <button 
                          v-if="!notification.read" 
                          @click="markAsRead(notification.id)" 
                          class="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        >
                          Mark as Read
                        </button>
                      </li>
                    </TransitionGroup>
                    <p v-if="sortedNotifications.length === 0" class="text-sm text-gray-500 text-center py-4">
                      No notifications available.
                    </p>
                  </div>
                  <div class="mt-6 flex justify-between">
                    <button @click="clearAllNotifications" class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                      Clear Read Notifications
                    </button>
                    <button @click="markAllAsRead" class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                      Mark All as Read
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div v-if="incidentTypesData.labels && incidentTypesData.datasets.length" class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-4 text-[#002855]">Crime Incident Distribution</h3>
            <div class="h-[300px]">
              <Pie :data="incidentTypesData" :options="pieChartOptions" />
            </div>
          </div>
          <div v-if="crimeLevelsData.labels && crimeLevelsData.datasets.length" class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-4 text-[#002855]">Crime Risk Levels by Category</h3>
            <div class="h-[300px]">
              <Bar :data="crimeLevelsData" :options="barChartOptions" />
            </div>
          </div>
        </div>

        <!-- Recent Incidents Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-[#002855]">Recent Crime Incidents</h3>
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
import { useCrimeReportStore } from '@/stores/crimeReportStore';
import { LayoutDashboard, FileText, History, BarChart2, Menu, ChevronLeft, Bell, Settings, Users, AlertTriangle, CheckCircle, Info } from 'lucide-vue-next';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, Filler, BarElement } from 'chart.js';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, Filler, BarElement);

const crimeReportStore = useCrimeReportStore();
const { notifications, unreadNotificationsCount, crimeReports } = storeToRefs(crimeReportStore);

const isSidebarCollapsed = ref(false);
const isNotificationModalOpen = ref(false);
const isLoading = ref(true);
const error = ref(null);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleNotificationModal = () => {
  isNotificationModalOpen.value = !isNotificationModalOpen.value;
};

const closeNotificationModal = () => {
  isNotificationModalOpen.value = false;
};

const markAsRead = async (notificationId) => {
  await crimeReportStore.markNotificationAsRead(notificationId);
};

const markAllAsRead = () => {
  crimeReportStore.markAllNotificationsAsRead();
};

const clearAllNotifications = () => {
  crimeReportStore.clearNotifications();
};

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/npsdashboard", active: true },
  { name: "Crime Reports", icon: FileText, path: "/npsreports", active: false },
  { name: "Police", icon: Users, path: "/npspolice", active: false },
  { name: "Incident History", icon: History, path: "/npshistory", active: false },
  { name: "Crime Analytics", icon: BarChart2, path: "/npsmap", active: false },
];

const metrics = computed(() => [
  { title: 'Total Crime Incidents', value: crimeReportStore.totalCrimeReports, icon: Bell },
  { title: 'Pending Crime Incidents', value: crimeReportStore.pendingCrimeReports, icon: FileText },
  { title: 'Resolved Crime Cases', value: crimeReportStore.resolvedCrimeReports, icon: History },
  { title: 'Unassigned Crime Reports', value: crimeReportStore.unassignedCrimeReports, icon: Settings },
]);

const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toLocaleString();
  }
  return new Date(date).toLocaleString();
};

const incidentTypesData = computed(() => {
  const typeCounts = {};
  crimeReports.value.forEach(report => {
    const type = report.incidentType || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

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

const crimeLevelsData = computed(() => {
  const categories = {};
  crimeReports.value.forEach(report => {
    const category = report.incidentType || 'Unknown';
    if (!categories[category]) {
      categories[category] = { Safe: 0, Moderate: 0, 'High Risk': 0 };
    }
    const count = categories[category].Safe + categories[category].Moderate + categories[category]['High Risk'];
    if (count < 5) {
      categories[category].Safe++;
    } else if (count < 15) {
      categories[category].Moderate++;
    } else {
      categories[category]['High Risk']++;
    }
  });

  const labels = Object.keys(categories);
  const datasets = [
    { label: 'Safe', data: [], backgroundColor: '#4BC0C0' },
    { label: 'Moderate', data: [], backgroundColor: '#FFCE56' },
    { label: 'High Risk', data: [], backgroundColor: '#FF6384' }
  ];

  labels.forEach(category => {
    datasets[0].data.push(categories[category].Safe);
    datasets[1].data.push(categories[category].Moderate);
    datasets[2].data.push(categories[category]['High Risk']);
  });

  return { labels, datasets };
});

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
        text: 'Crime Categories'
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Incidents'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
};

const recentIncidents = computed(() => {
  return [...crimeReports.value]
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    .slice(0, 10)
    .map(report => ({
      id: report.id,
      incidentType: report.incidentType,
      location: report.location,
      status: report.status,
      dateTime: report.dateTime
    }));
});

const sortedNotifications = computed(() => {
  return [...notifications.value]
    .filter(notification => !notification.read)
    .sort((a, b) => b.timestamp - a.timestamp);
});

const getNotificationIcon = (type) => {
  switch (type) {
    case 'warning':
      return AlertTriangle;
    case 'success':
      return CheckCircle;
    default:
      return Info;
  }
};

const getNotificationIconColor = (type) => {
  switch (type) {
    case 'warning':
      return 'text-yellow-500';
    case 'success':
      return 'text-green-500';
    default:
      return 'text-blue-500';
  }
};

let unsubscribe = null;

onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;
    unsubscribe = await crimeReportStore.fetchCrimeReports();
  } catch (err) {
    console.error('Error fetching crime reports:', err);
    error.value = 'Failed to load data';
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
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
  outline: 2px solid #080838;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.5s ease;
}
.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>