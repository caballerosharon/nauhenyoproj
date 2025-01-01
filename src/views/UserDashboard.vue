<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-poppins relative pb-16">
    <!-- Main Content -->
    <main class="px-4 md:px-6 lg:px-8 pt-6">
      <div class="max-w-8xl mx-auto">
        <!-- Header with Logo -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-10 w-10" />
            <h1 class="ml-3 text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg transition-all duration-300"
            >
              <UserCircle class="w-6 h-6 text-gray-600" />
            </button>
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="isDropdownOpen = false"
              >
                Profile
              </router-link>
              <button
                @click="openLogoutModal"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Statistics Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div v-for="stat in statistics" :key="stat.name" :class="['bg-white rounded-lg shadow-neu p-6', stat.color]">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-opacity-20 mr-4" :class="stat.iconBg">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">{{ stat.name }}</p>
                    <p class="text-2xl font-semibold text-gray-800">{{ stat.value }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reports Chart -->
            <div class="bg-white rounded-lg shadow-neu p-6">
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Report Distribution</h3>
              <div class="w-full h-64">
                <Doughnut v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
                <p v-else class="text-center text-gray-500 pt-8">No data available</p>
              </div>
            </div>

            <!-- Incident Distribution Bar Chart -->
            <div class="bg-white rounded-lg shadow-neu p-6">
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Incident Distribution</h3>
              <div class="w-full h-96">
                <Bar v-if="barChartData.datasets[0].data.length > 0" :data="barChartData" :options="barChartOptions" />
                <p v-else class="text-center text-gray-500 pt-8">No data available</p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Reports Section -->
            <div class="bg-white rounded-lg shadow-neu p-6">
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Your Recent Reports</h3>
              <div class="space-y-4">
                <div v-for="report in recentReports" :key="report.id" class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="text-lg font-medium text-gray-700">{{ report.title }}</h4>
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      report.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ report.status }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">
                    <Calendar class="w-4 h-4 inline-block mr-1" />
                    {{ report.date }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="bg-white rounded-lg shadow-neu p-6">
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Emergency Contacts</h3>
              <div class="space-y-4">
                <div v-for="contact in emergencyContacts" :key="contact.name" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <component :is="contact.icon" class="w-6 h-6 text-gray-600 mr-3" />
                    <div>
                      <p class="font-medium text-gray-700">{{ contact.name }}</p>
                      <p class="text-sm text-gray-500">{{ contact.number }}</p>
                    </div>
                  </div>
                  <a :href="`tel:${contact.number}`" class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors duration-300">
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-neu-bottom z-50">
      <div class="max-w-screen-xl mx-auto">
        <div class="flex justify-between h-16">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.path"
            class="flex flex-col items-center justify-center w-full hover:bg-gray-50 transition-all duration-300"
            :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
          >
            <component 
              :is="item.icon" 
              class="w-6 h-6 mb-1"
              :class="$route.path === item.path ? 'text-teal-600' : 'text-gray-600'"
            />
            <span class="text-xs">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Logout Modal -->
    <div v-if="isLogoutModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p class="mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-4">
          <button @click="closeLogoutModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useReportStore } from '../stores/reportStore';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Flame,
  FolderOpen, 
  MapPin, 
  UserCircle,
  Calendar,
  ClipboardList,
  ShieldAlert,
  Siren,
  Stethoscope
} from 'lucide-vue-next';
import { Doughnut, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const router = useRouter();
const reportStore = useReportStore();

const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const openLogoutModal = () => {
  isDropdownOpen.value = false;
  isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false;
};

const logout = async () => {
  try {
    await signOut(auth);
    closeLogoutModal();
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/reportcrime', icon: FileText, label: 'Report Crime' },
  { path: '/reportfire', icon: Flame, label: 'Report Fire' },
  { path: '/usermap', icon: MapPin, label: 'Map' },
  { path: '/history', icon: FolderOpen, label: 'My Reports' },
];

const statistics = computed(() => [
  { 
    name: 'Total Reports', 
    value: reportStore.totalReports, 
    icon: ClipboardList, 
    color: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    iconColor: 'text-blue-500'
  },
  { 
    name: 'Fire Reports', 
    value: reportStore.fireReports.length, 
    icon: Flame,
    color: 'bg-red-50',
    iconBg: 'bg-red-500',
    iconColor: 'text-red-500'
  },
  { 
    name: 'Crime Reports', 
    value: reportStore.crimeReports.length, 
    icon: ShieldAlert,
    color: 'bg-yellow-50',
    iconBg: 'bg-yellow-500',
    iconColor: 'text-yellow-500'
  },
]);

const recentReports = computed(() => {
  const allReports = [...reportStore.crimeReports, ...reportStore.fireReports]
    .sort((a, b) => b.dateTime.toDate() - a.dateTime.toDate())
    .slice(0, 5);

  return allReports.map(report => ({
    id: report.id,
    title: report.incidentType || 'Incident',
    status: report.status || 'Pending Review',
    date: report.dateTime.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }));
});

const emergencyContacts = [
  { name: 'Police', number: '911', icon: Siren },
  { name: 'Fire Department', number: '912', icon: Flame },
  { name: 'Ambulance', number: '913', icon: Stethoscope },
];

const chartData = computed(() => ({
  labels: ['Fire Reports', 'Crime Reports'],
  datasets: [{
    data: [reportStore.fireReports.length, reportStore.crimeReports.length],
    backgroundColor: ['#FCA5A5', '#93C5FD'],
    hoverBackgroundColor: ['#F87171', '#60A5FA']
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#4B5563',
        font: {
          size: 14,
          family: "'Poppins', sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1F2937',
      bodyColor: '#4B5563',
      bodyFont: {
        size: 14,
        family: "'Poppins', sans-serif"
      },
      padding: 12,
      boxPadding: 8,
      borderColor: '#E5E7EB',
      borderWidth: 1
    }
  }
};

const barChartData = computed(() => {
  const incidentTypes = [...new Set([...reportStore.fireReports, ...reportStore.crimeReports].map(report => report.incidentType))];
  const data = incidentTypes.map(type => {
    return reportStore.fireReports.concat(reportStore.crimeReports).filter(report => report.incidentType === type).length;
  });

  return {
    labels: incidentTypes,
    datasets: [{
      label: 'Number of Incidents',
      data: data,
      backgroundColor: '#93C5FD',
      borderColor: '#3B82F6',
      borderWidth: 1
    }]
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#4B5563',
        font: {
          size: 12,
          family: "'Poppins', sans-serif"
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      ticks: {
        color: '#4B5563',
        font: {
          size: 12,
          family: "'Poppins', sans-serif"
        }
      },
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1F2937',
      bodyColor: '#4B5563',
      bodyFont: {
        size: 14,
        family: "'Poppins', sans-serif"
      },
      padding: 12,
      boxPadding: 8,
      borderColor: '#E5E7EB',
      borderWidth: 1
    }
  }
};

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      reportStore.setupRealtimeListeners();
    } else {
      reportStore.cleanupListeners();
    }
  });

  // Clean up the auth state listener when the component is unmounted
  onUnmounted(() => {
    unsubscribe();
  });
});

// Watch for changes in the auth state
watch(() => auth.currentUser, (newUser) => {
  if (newUser) {
    reportStore.setupRealtimeListeners();
  } else {
    reportStore.cleanupListeners();
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.shadow-neu {
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
}

.shadow-neu-bottom {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-neu-inset {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
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