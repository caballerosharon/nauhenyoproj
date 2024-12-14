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
          <h1 class="text-xl font-semibold">BFP Dashboard</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="toggleNotifications" class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 relative">
            <Bell class="h-6 w-6" />
            <span v-if="unreadNotificationsCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ unreadNotificationsCount }}
            </span>
          </button>
          <button class="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Settings class="h-6 w-6" />
          </button>
        </div>
      </div>
  
      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="metric in metrics" :key="metric.title" 
               class="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-200">
            <div class="flex items-center">
              <div class="p-3 rounded-lg transition-colors duration-300" 
                   :class="[metric.bgColor, 'hover:opacity-90']">
                <component :is="metric.icon" class="h-8 w-8 text-white" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">{{ metric.title }}</p>
                <p class="text-2xl font-bold transition-colors duration-300" 
                   :class="[metric.textColor, 'hover:opacity-80']">{{ metric.value }}</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="h-2 rounded-full bg-gray-200">
                <div class="h-2 rounded-full transition-all duration-300" 
                     :class="metric.barColor"
                     :style="{ width: `${metric.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Incident Types Chart -->
          <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:border-blue-200">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Fire Incident Distribution</h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Total: {{ totalIncidents }}</span>
              </div>
            </div>
            <div class="h-[300px] relative transition-transform duration-300 hover:scale-[1.02]">
              <Doughnut 
                v-if="incidentTypesData.labels && incidentTypesData.datasets.length"
                :data="incidentTypesData"
                :options="doughnutOptions"
              />
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div v-for="(value, label, index) in incidentTypeCounts" :key="label"
                   class="flex items-center transition-colors duration-300 hover:bg-gray-50 p-2 rounded">
                <span class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: chartColors[index % chartColors.length] }"></span>
                <span class="text-sm text-gray-600">{{ label }}: {{ value }}</span>
              </div>
            </div>
          </div>
  
          <!-- Monthly Trends Chart -->
          <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:border-blue-200">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Monthly Fire Incident Trends</h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Last 6 Months</span>
              </div>
            </div>
            <div class="h-[300px] transition-transform duration-300 hover:scale-[1.02]">
              <Line 
                v-if="monthlyTrendsData.labels && monthlyTrendsData.datasets.length"
                :data="monthlyTrendsData"
                :options="lineOptions"
              />
            </div>
          </div>
  
          <!-- Status Distribution Chart -->
          <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:border-blue-200">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Status Distribution</h3>
            </div>
            <div class="h-[300px] transition-transform duration-300 hover:scale-[1.02]">
              <Pie 
                v-if="statusDistributionData.labels && statusDistributionData.datasets.length"
                :data="statusDistributionData"
                :options="pieOptions"
              />
            </div>
          </div>
  
          <!-- Incident Distribution by Place Chart -->
          <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:border-blue-200">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800">Incident Distribution by Place</h3>
            </div>
            <div class="h-[300px] transition-transform duration-300 hover:scale-[1.02]">
              <Bar
                v-if="incidentsByPlaceData.labels && incidentsByPlaceData.datasets.length"
                :data="incidentsByPlaceData"
                :options="barOptions"
              />
            </div>
            <div class="mt-4 flex justify-center space-x-4">
              <div class="flex items-center">
                <span class="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <span class="text-sm">Safe (0-3)</span>
              </div>
              <div class="flex items-center">
                <span class="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                <span class="text-sm">Moderate (4-6)</span>
              </div>
              <div class="flex items-center">
                <span class="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                <span class="text-sm">High Risk (7+)</span>
              </div>
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
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ incident.id.slice(0, 8) }}</td>
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
  
    <!-- Notifications Modal -->
    <div v-if="showNotifications" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Notifications</h2>
          <button @click="toggleNotifications" class="text-gray-500 hover:text-gray-700">
            <X class="h-6 w-6" />
          </button>
        </div>
        <ul class="space-y-4">
          <li v-for="notification in notifications" :key="notification.id" class="border-b pb-2">
            <p class="font-semibold">{{ notification.title }}</p>
            <p class="text-sm text-gray-600">{{ notification.body }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(notification.timestamp) }}</p>
            <button v-if="!notification.read" @click="markAsRead(notification.id)" class="text-blue-500 text-sm mt-1">
              Mark as Read
            </button>
          </li>
        </ul>
        <button @click="clearAllNotifications" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200">
          Clear All Notifications
        </button>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useFireReportStore } from '@/stores/fireReportStore';
  import { 
    LayoutDashboard, 
    FileText, 
    History, 
    BarChart2, 
    Menu,
    ChevronLeft,
    Bell,
    Settings,
    X,
    Users
  } from 'lucide-vue-next';
  import { Pie, Line, Doughnut, Bar } from 'vue-chartjs';
  import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    BarElement,
    Title
  } from 'chart.js';
  
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
  );
  
  const fireReportStore = useFireReportStore();
  const { notifications, unreadNotificationsCount, fireReports } = storeToRefs(fireReportStore);
  
  const isSidebarCollapsed = ref(false);
  const showNotifications = ref(false);
  
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  };
  
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
  };
  
  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/bfpdashboard", active: true },
    { name: "Fire Reports", icon: FileText, path: "/bfpreports", active: false },
    { name: "Firefighters", icon: Users, path: "/bfpfireman", active: false },
    { name: "Incident History", icon: History, path: "/bfphistory", active: false },
    { name: "Fire Analytics", icon: BarChart2, path: "/bfpmap", active: false },
  ];
  
  const metrics = computed(() => [
    { 
      title: 'Total Fire Incidents', 
      value: fireReportStore.totalFireReports, 
      icon: Bell,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      barColor: 'bg-red-500',
      percentage: (fireReportStore.totalFireReports / fireReportStore.maxReports) * 100
    },
    { 
      title: 'Pending Fire Incidents', 
      value: fireReportStore.pendingFireReports, 
      icon: FileText,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      barColor: 'bg-yellow-500',
      percentage: (fireReportStore.pendingFireReports / fireReportStore.totalFireReports) * 100
    },
    { 
      title: 'Resolved Fire Cases', 
      value: fireReportStore.resolvedFireReports, 
      icon: History,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      barColor: 'bg-green-500',
      percentage: (fireReportStore.resolvedFireReports / fireReportStore.totalFireReports) * 100
    },
    { 
      title: 'Unassigned Fire Reports', 
      value: fireReportStore.unassignedFireReports, 
      icon: Settings,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      barColor: 'bg-blue-500',
      percentage: (fireReportStore.unassignedFireReports / fireReportStore.totalFireReports) * 100
    },
  ]);
  
  const formatDate = (date) => {
    if (date && date.seconds) {
      return new Date(date.seconds * 1000).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Invalid Date';
  };
  
  const chartColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
    'rgba(40, 159, 64, 0.8)',
    'rgba(210, 199, 199, 0.8)',
  ];
  
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
          backgroundColor: chartColors.slice(0, Object.keys(typeCounts).length),
        },
      ],
    };
  });
  
  const monthlyTrendsData = computed(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short', year: 'numeric' });
    }).reverse();
  
    const monthlyCounts = fireReports.value.reduce((acc, report) => {
      if (report.dateTime && report.dateTime.seconds) {
        const reportDate = new Date(report.dateTime.seconds * 1000);
        const monthYear = reportDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});
  
    return {
      labels: last6Months,
      datasets: [
        {
          label: 'Monthly Trends',
          data: last6Months.map((month) => monthlyCounts[month] || 0),
          borderColor: '#002855',
          backgroundColor: 'rgba(0, 40, 85, 0.1)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
  });
  
  const statusDistributionData = computed(() => {
    const statusCounts = fireReports.value.reduce((acc, report) => {
      const status = report.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: chartColors.slice(0, Object.keys(statusCounts).length),
        },
      ],
    };
  });
  
  const incidentsByPlaceData = computed(() => {
    const placeIncidents = {};
  
    fireReports.value.forEach(report => {
      const place = report.location || 'Unknown';
      placeIncidents[place] = (placeIncidents[place] || 0) + 1;
    });
  
    const sortedPlaces = Object.entries(placeIncidents)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Get top 10 places
  
    return {
      labels: sortedPlaces.map(([place]) => place),
      datasets: [{
        label: 'Number of Incidents',
        data: sortedPlaces.map(([, count]) => count),
        backgroundColor: sortedPlaces.map(([, count]) => {
          if (count <= 3) return 'rgba(34, 197, 94, 0.8)'; // green-500
          if (count <= 6) return 'rgba(234, 179, 8, 0.8)'; // yellow-500
          return 'rgba(239, 68, 68, 0.8)'; // red-500
        }),
        borderColor: sortedPlaces.map(([, count]) => {
          if (count <= 3) return 'rgb(34, 197, 94)'; // green-500
          if (count <= 6) return 'rgb(234, 179, 8)'; // yellow-500
          return 'rgb(239, 68, 68)'; // red-500
        }),
        borderWidth: 1
      }]
    };
  });
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            const count = context.parsed.y;
            if (count <= 3) {
              label += ' (Safe)';
            } else if (count <= 6) {
              label += ' (Moderate)';
            } else {
              label += ' (High Risk)';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };
  
  const totalIncidents = computed(() => fireReports.value.length);
  
  const incidentTypeCounts = computed(() => {
    return fireReports.value.reduce((acc, report) => {
      const type = report.incidentType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  });
  
  const recentIncidents = computed(() => {
    return [...fireReports.value]
      .sort((a, b) => b.dateTime.seconds - a.dateTime.seconds)
      .slice(0, 5);
  });
  
  const markAsRead = (notificationId) => {
    fireReportStore.markNotificationAsRead(notificationId);
  };
  
  const clearAllNotifications = () => {
    fireReportStore.clearAllNotifications();
  };
  
  onMounted(async () => {
    const unsubscribe = await fireReportStore.fetchFireReports();
    onUnmounted(() => {
      unsubscribe(); // Clean up the Firestore listener when the component is unmounted
    });
  });
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 100%;
    width: 100%;
  }
  
  /* Add smooth transitions for all interactive elements */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  
  /* Add hover effects for chart containers */
  .hover\:scale-\[1\.02\]:hover {
    transform: scale(1.02);
  }
  
  /* Add hover effects for metric cards */
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
  
  /* Smooth color transitions */
  .transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  </style>
  
  