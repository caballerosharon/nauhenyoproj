<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside :class="[
      'bg-[#05808C] flex flex-col fixed inset-y-0 left-0 z-20 overflow-y-auto transition-all duration-300 ease-in-out',
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
          <h2 class="text-xl font-semibold">Dashboard</h2>
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

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- Statistics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div v-for="stat in statistics" :key="stat.name" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <component :is="stat.icon" class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ stat.name }}</p>
                <p class="text-2xl font-semibold text-gray-700">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Your Reports</h3>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useReportStore } from '../stores/reportStore';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
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
  Calendar,
  ClipboardList,
  ShieldAlert,
} from 'lucide-vue-next';

const reportStore = useReportStore();

const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, current: true },
  { name: 'Report Crime', to: '/reportcrime', icon: FileText, current: false },
  { name: 'Report Fire', to: '/reportfire', icon: Flame, current: false },
  { name: 'My Reports', to: '/history', icon: FolderOpen, current: false },
  { name: 'Map', to: '/usermap', icon: MapPin, current: false },
  { name: 'Profile', to: '/', icon: UserCircle, current: false },
];

const statistics = computed(() => [
  { name: 'My Reports', value: reportStore.totalReports, icon: ClipboardList },
  { name: 'Fire Reports', value: reportStore.fireReports.length, icon: Flame },
  { name: 'Crime Reports', value: reportStore.crimeReports.length, icon: ShieldAlert },
]);

const recentReports = computed(() => reportStore.recentReports);

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