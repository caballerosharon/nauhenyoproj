<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
    <!-- Header with Navigation -->
    <header class="bg-gradient-to-r from-orange-600 to-red-600 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Flame class="h-8 w-8 mr-3 text-yellow-300" />
            <h1 class="text-2xl font-bold">Fireman Dashboard</h1>
          </div>
          <nav>
            <ul class="flex space-x-6">
              <li v-for="item in navItems" :key="item.name">
                <a :href="item.href" class="text-white hover:text-yellow-300 transition-colors duration-200">{{ item.name }}</a>
              </li>
            </ul>
          </nav>
          <div class="flex items-center space-x-4">
            <button class="text-white hover:text-yellow-300 transition-colors duration-200">
              <Bell class="h-6 w-6" />
            </button>
            <div v-if="currentFirefighter" class="flex items-center bg-black/20 rounded-full px-4 py-1">
              <UserCircle class="h-6 w-6 mr-2 text-yellow-300" />
              <span>{{ currentFirefighter.name }}</span>
            </div>
            <button @click="logout" class="bg-black/20 hover:bg-black/30 px-4 py-1 rounded-full transition-colors duration-200">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Fixed Panel containing main content -->
    <div class="fixed top-[73px] left-0 right-0 bottom-0 overflow-auto">
      <div class="container mx-auto px-6 py-8">
        <!-- Firefighter Details -->
        <div v-if="currentFirefighter" class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 mb-8">
          <h2 class="text-2xl font-bold mb-4">Firefighter Details</h2>
          <p><strong>Name:</strong> {{ currentFirefighter.name }}</p>
          <p><strong>ID:</strong> {{ currentFirefighter.id }}</p>
          <p><strong>Rank:</strong> {{ currentFirefighter.rank }}</p>
          <p><strong>Station:</strong> {{ currentFirefighter.station }}</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-400">Assigned Reports</h3>
              <Activity class="h-5 w-5 text-orange-400" />
            </div>
            <div class="text-3xl font-bold mb-2">{{ assignedReports.length }}</div>
            <div class="text-sm text-gray-400">All time</div>
          </div>
          
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-400">Pending Reports</h3>
              <FireExtinguisher class="h-5 w-5 text-orange-400" />
            </div>
            <div class="text-3xl font-bold mb-2">{{ pendingReports.length }}</div>
            <div class="text-sm text-gray-400">Awaiting action</div>
          </div>
          
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-400">Resolved Reports</h3>
              <Users class="h-5 w-5 text-orange-400" />
            </div>
            <div class="text-3xl font-bold mb-2">{{ resolvedReports.length }}</div>
            <div class="text-sm text-gray-400">Completed incidents</div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Incident Types Pie Chart -->
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">Incident Types</h2>
              <button class="text-gray-400 hover:text-white">
                <MoreHorizontal class="h-5 w-5" />
              </button>
            </div>
            <div class="h-[300px]">
              <canvas ref="incidentTypesChart"></canvas>
            </div>
          </div>

          <!-- Incidents Over Time Bar Chart -->
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">Incidents Over Time</h2>
              <button class="text-gray-400 hover:text-white">
                <MoreHorizontal class="h-5 w-5" />
              </button>
            </div>
            <div class="h-[300px]">
              <canvas ref="incidentsOverTimeChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Fire Reports -->
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Recent Fire Reports</h2>
            <button class="text-gray-400 hover:text-white">
              <MoreHorizontal class="h-5 w-5" />
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-gray-400 border-b border-gray-700">
                  <th class="pb-3 text-left">Date</th>
                  <th class="pb-3 text-left">Type</th>
                  <th class="pb-3 text-left">Location</th>
                  <th class="pb-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in recentAssignedReports" :key="report.id" 
                    class="border-b border-gray-700/50 text-sm">
                  <td class="py-3">{{ formatDate(report.timestamp) }}</td>
                  <td class="py-3">{{ report.type }}</td>
                  <td class="py-3">{{ report.location }}</td>
                  <td class="py-3">
                    <span :class="{
                      'px-2 py-1 rounded-full text-xs font-medium': true,
                      'bg-green-400/20 text-green-400': report.status === 'resolved',
                      'bg-yellow-400/20 text-yellow-400': report.status === 'in-progress',
                      'bg-red-400/20 text-red-400': report.status === 'pending'
                    }">
                      {{ report.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { 
  Flame, UserCircle, Activity, FireExtinguisher, 
  MoreHorizontal, Bell, Users
} from 'lucide-vue-next';
import Chart from 'chart.js/auto';
import { useRouter } from 'vue-router';
import { useFirefighterStore } from '@/stores/firefighterStore';
import { useFireReportStore } from '@/stores/fireReportStore';

const router = useRouter();
const firefighterStore = useFirefighterStore();
const fireReportStore = useFireReportStore();

const incidentTypesChart = ref(null);
const incidentsOverTimeChart = ref(null);

const currentFirefighter = computed(() => firefighterStore.currentFirefighter);

const navItems = [
  { name: 'Dashboard', href: '#' },
  { name: 'Assigned Tasks', href: '#' },
  { name: 'Reports', href: '#' },
  { name: 'Performance', href: '#' },
];

const assignedReports = computed(() => {
  if (!currentFirefighter.value) return [];
  return fireReportStore.fireReports.filter(report => report.assignedFirefighterId === currentFirefighter.value.id);
});

const pendingReports = computed(() => assignedReports.value.filter(report => report.status === 'pending'));
const resolvedReports = computed(() => assignedReports.value.filter(report => report.status === 'resolved'));
const recentAssignedReports = computed(() => {
  return [...assignedReports.value].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
});

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const logout = async () => {
  await firefighterStore.logout();
  router.push('/login');
};

const updateCharts = () => {
  if (!currentFirefighter.value) return;

  // Incident Types Pie Chart
  const incidentTypes = computed(() => {
    const types = {};
    assignedReports.value.forEach(report => {
      types[report.type] = (types[report.type] || 0) + 1;
    });
    return types;
  });

  if (incidentTypesChart.value) {
    new Chart(incidentTypesChart.value, {
      type: 'pie',
      data: {
        labels: Object.keys(incidentTypes.value),
        datasets: [{
          data: Object.values(incidentTypes.value),
          backgroundColor: [
            '#f97316',
            '#fb923c',
            '#fdba74',
            '#fed7aa',
            '#ffedd5'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  // Incidents Over Time Bar Chart
  const incidentsOverTime = computed(() => {
    const timeData = {};
    assignedReports.value.forEach(report => {
      const date = new Date(report.timestamp).toLocaleDateString();
      timeData[date] = (timeData[date] || 0) + 1;
    });
    return timeData;
  });

  if (incidentsOverTimeChart.value) {
    new Chart(incidentsOverTimeChart.value, {
      type: 'bar',
      data: {
        labels: Object.keys(incidentsOverTime.value),
        datasets: [{
          label: 'Incidents',
          data: Object.values(incidentsOverTime.value),
          backgroundColor: '#f97316',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
};

onMounted(async () => {
  await firefighterStore.getCurrentFirefighter();
  await fireReportStore.fetchFireReports();
  updateCharts();
});

watch(currentFirefighter, updateCharts);
watch(assignedReports, updateCharts, { deep: true });
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Custom scrollbar for modern browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Enhanced styling for charts */
.chart-container canvas {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.chart-container canvas:hover {
  transform: scale(1.02);
}

/* Pie chart legend styling */
.chart-container[data-type="pie"] .chartjs-legend li span {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 50%;
}

/* Bar chart styling */
.chart-container[data-type="bar"] .chartjs-tooltip {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  padding: 5px 10px;
}
</style>