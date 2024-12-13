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
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <span v-if="!isSidebarCollapsed" class="ml-3">
                {{ item.name }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main :class="['flex-1 flex flex-col fixed inset-0 z-10 overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Top Bar -->
      <div class="bg-[#070b0d] text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-1 mr-4 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
            <ChevronLeft v-else class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold">Fire Incident Reports</h1>
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

      <!-- Reports Table -->
      <div class="pt-20 p-8 flex-1 overflow-auto">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-[#002855]">Fire Incident Reports</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-50">
                <tr class="text-left text-sm text-gray-500">
                  <th class="px-6 py-3 font-medium">ID</th>
                  <th class="px-6 py-3 font-medium">Incident Type</th>
                  <th class="px-6 py-3 font-medium">Location</th>
                  <th class="px-6 py-3 font-medium">Status</th>
                  <th class="px-6 py-3 font-medium">Date</th>
                  <th class="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in fireReportStore.fireReports" :key="report.id" class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ report.id.slice(0, 8) }}</td>
                  <td class="px-6 py-4">{{ report.incidentType }}</td>
                  <td class="px-6 py-4">{{ report.location }}</td>
                  <td class="px-6 py-4">
                    <span :class="{
                      'px-2 py-1 rounded-full text-xs font-medium': true,
                      'bg-yellow-100 text-yellow-800': report.status === 'Pending',
                      'bg-blue-100 text-blue-800': report.status === 'In Progress',
                      'bg-green-100 text-green-800': report.status === 'Resolved',
                      'bg-red-100 text-red-800': report.status === 'Disapproved'
                    }">
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">{{ formatDate(report.dateTime) }}</td>
                  <td class="px-6 py-4">
                    <button @click="viewReport(report)" class="text-blue-500 hover:text-blue-700 mr-2">
                      <Eye class="h-5 w-5" />
                    </button>
                    <button @click="openAssignModal(report)" 
                            :disabled="!['In Progress', 'Resolved'].includes(report.status)"
                            :class="['text-green-500 hover:text-green-700', {'opacity-50 cursor-not-allowed': !['In Progress', 'Resolved'].includes(report.status)}]">
                      <UserPlus class="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- View Report Modal -->
    <div v-if="selectedReport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button @click="closeViewModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold mb-4">Fire Incident Report</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>ID:</strong> {{ selectedReport.id }}</p>
            <p><strong>Incident Type:</strong> {{ selectedReport.incidentType }}</p>
            <p><strong>Subcategory:</strong> {{ selectedReport.incidentSub }}</p>
            <p><strong>Location:</strong> {{ selectedReport.location }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedReport.dateTime) }}</p>
            <p><strong>Status:</strong> {{ selectedReport.status }}</p>
          </div>
          <div>
            <p><strong>Description:</strong></p>
            <p class="text-sm text-gray-600">{{ selectedReport.description }}</p>
          </div>
        </div>
        <div v-if="selectedReport.photoURL" class="mb-4">
          <img :src="selectedReport.photoURL" alt="Incident Photo" class="max-w-full h-auto rounded-lg">
        </div>
        <div class="flex flex-wrap justify-end space-x-2 space-y-2">
          <button v-if="selectedReport.status === 'Pending' || !selectedReport.status" @click="approveReport" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Approve
          </button>
          <button v-if="selectedReport.status === 'Pending' || !selectedReport.status" @click="disapproveReport" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Disapprove
          </button>
          <button v-if="selectedReport.status === 'In Progress'" @click="setReportStatus('Resolved')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Mark as Resolved
          </button>
          <button v-if="selectedReport.status === 'Approved'" @click="setReportStatus('In Progress')" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Set to In Progress
          </button>
          <button v-if="['In Progress', 'Resolved'].includes(selectedReport.status)" @click="openAssignModal(selectedReport)" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Assign Firefighter
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Firefighter Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Assign Firefighter</h2>
        <div class="mb-4">
          <label for="firefighter-select" class="block text-sm font-medium text-gray-700 mb-2">Select a firefighter</label>
          <select 
            id="firefighter-select"
            v-model="selectedFirefighter" 
            class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a firefighter</option>
            <option v-for="firefighter in firefighterStore.firefighters" :key="firefighter.id" :value="firefighter.uid">
              {{ firefighter.fullname }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="assignFirefighter" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Assign
          </button>
          <button @click="closeAssignModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <TransitionRoot appear :show="showSuccessModal" as="template">
      <Dialog as="div" @close="closeSuccessModal" class="relative z-50">
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
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Responder Assigned Successfully
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    The responder has been successfully assigned to the fire incident report.
                  </p>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeSuccessModal"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ChevronLeft, Menu, Bell, Settings, Eye, UserPlus, X, LayoutDashboard, FileText, History, BarChart2, Users } from "lucide-vue-next";
import { useFireReportStore } from "@/stores/fireReportStore";
import { useFirefighterStore } from "@/stores/firefighterStore";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const fireReportStore = useFireReportStore();
const firefighterStore = useFirefighterStore();

const isSidebarCollapsed = ref(false);
const selectedReport = ref(null);
const showAssignModal = ref(false);
const selectedFirefighter = ref("");
const showSuccessModal = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const viewReport = (report) => {
  selectedReport.value = report;
};

const closeViewModal = () => {
  selectedReport.value = null;
};

const approveReport = async () => {
  if (selectedReport.value) {
    await fireReportStore.updateReportStatus(selectedReport.value.id, 'Approved');
    selectedReport.value.status = 'Approved';
  }
};

const disapproveReport = async () => {
  if (selectedReport.value) {
    await fireReportStore.updateReportStatus(selectedReport.value.id, 'Disapproved');
    selectedReport.value.status = 'Disapproved';
  }
};

const setReportStatus = async (status) => {
  if (selectedReport.value) {
    await fireReportStore.updateReportStatus(selectedReport.value.id, status);
    selectedReport.value.status = status;
  }
};

const openAssignModal = (report) => {
  if (['In Progress', 'Resolved'].includes(report.status)) {
    selectedReport.value = report;
    showAssignModal.value = true;
  }
};

const closeAssignModal = () => {
  showAssignModal.value = false;
  selectedFirefighter.value = "";
};

const assignFirefighter = async () => {
  if (selectedReport.value && selectedFirefighter.value) {
    try {
      await fireReportStore.assignFirefighter(selectedReport.value.id, selectedFirefighter.value);
      selectedReport.value.status = 'Resolved';
      selectedReport.value.assignedTo = selectedFirefighter.value;
      closeAssignModal();
      showSuccessModal.value = true;
    } catch (error) {
      console.error('Error assigning firefighter:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date.seconds * 1000).toLocaleString();
};

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/bfpdashboard", active: false },
  { name: "Fire Reports", icon: FileText, path: "/bfpreports", active: true },
  { name: "Firefighters", icon: Users, path: "/bfpfireman", active: false },
  { name: "Incident History", icon: History, path: "/bfphistory", active: false },
  { name: "Fire Analytics", icon: BarChart2, path: "/bfpmap", active: false },
];

onMounted(async () => {
  await fireReportStore.fetchFireReports();
  await firefighterStore.fetchFirefighters();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>