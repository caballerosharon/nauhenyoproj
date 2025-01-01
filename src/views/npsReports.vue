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
      <div class="bg-[#080838] text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-1 mr-4 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
            <ChevronLeft v-else class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold">Crime Incident Reports</h1>
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
            <h2 class="text-lg font-semibold text-[#002855] mb-4">Crime Incident Reports</h2>

            <!-- Search and Filter Section -->
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
              <!-- Search Input -->
              <div class="flex-grow max-w-md">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search reports..."
                  class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Filter Buttons -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="status in ['All', 'Pending', 'In Progress', 'Resolved', 'Disapproved']"
                  :key="status"
                  @click="setStatusFilter(status)"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  {{ status }}
                </button>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-50">
                <tr class="text-left text-sm text-gray-500">
                  <th class="px-6 py-3 font-medium">Image</th>
                  <th class="px-6 py-3 font-medium">ID</th>
                  <th class="px-6 py-3 font-medium">Incident Type</th>
                  <th class="px-6 py-3 font-medium">Location</th>
                  <th class="px-6 py-3 font-medium">Status</th>
                  <th class="px-6 py-3 font-medium">Date</th>
                  <th class="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in filteredAndSortedReports" :key="report.id" class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        v-if="report.imagePaths && report.imagePaths.length > 0"
                        :src="report.imagePaths[0]"
                        :alt="report.incidentType"
                        class="w-full h-full object-cover"
                        @click="openImageModal(report.imagePaths[0])"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <Flame class="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </td>
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
                    <button
                      @click="openAssignModal(report)"
                      :disabled="!['Pending', 'In Progress'].includes(report.status)"
                      :class="['text-green-500 hover:text-green-700', {'opacity-50 cursor-not-allowed': !['Pending', 'In Progress'].includes(report.status)}]"
                    >
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
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-[#002B5B] text-white p-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Crime Incident Report</h2>
          <button @click="closeViewModal" class="text-white hover:text-gray-200 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left Column - Basic Information -->
            <div class="md:col-span-2 space-y-6">
              <div class="bg-gray-50 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-[#002B5B] mb-4">Basic Information</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm font-medium text-gray-500">ID</div>
                    <div class="mt-1">{{ selectedReport.id }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500">Status</div>
                    <div class="mt-1">
                      <span :class="{
                        'px-2 py-1 rounded-full text-xs font-medium': true,
                        'bg-yellow-100 text-yellow-800': selectedReport.status === 'Pending',
                        'bg-blue-100 text-blue-800': selectedReport.status === 'In Progress',
                        'bg-green-100 text-green-800': selectedReport.status === 'Resolved',
                        'bg-red-100 text-red-800': selectedReport.status === 'Disapproved'
                      }">
                        {{ selectedReport.status }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500">Incident Type</div>
                    <div class="mt-1">{{ selectedReport.incidentType }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500">Subcategory</div>
                    <div class="mt-1">{{ selectedReport.incidentSub }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500">Location</div>
                    <div class="mt-1">{{ selectedReport.location }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500">Date & Time</div>
                    <div class="mt-1">{{ formatDate(selectedReport.dateTime) }}</div>
                  </div>
                  <div class="col-span-2">
                    <div class="text-sm font-medium text-gray-500">Assigned Police Officer</div>
                    <div class="mt-1 font-semibold text-[#002B5B]">
                      {{ selectedReport.assignedTo || 'Not yet assigned' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-[#002B5B] mb-4">Description</h3>
                <p class="text-gray-700">{{ selectedReport.description }}</p>
              </div>
            </div>

            <!-- Right Column - Incident Photos -->
            <div class="md:col-span-1">
              <div class="bg-gray-50 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-[#002B5B] mb-4">Incident Photos</h3>
                <div class="space-y-4">
                  <template v-if="selectedReport.imagePaths && selectedReport.imagePaths.length > 0">
                    <div v-for="(imagePath, index) in selectedReport.imagePaths"
                         :key="index"
                         class="relative rounded-lg overflow-hidden shadow-lg">
                      <img
                        :src="imagePath"
                        :alt="`Incident Photo ${index + 1}`"
                        class="w-full h-48 object-cover cursor-pointer"
                        @click="openImageModal(imagePath)"
                      />
                    </div>
                  </template>
                  <div v-if="!selectedReport.imagePaths || selectedReport.imagePaths.length === 0"
                       class="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div class="text-center text-gray-500">
                      <Flame class="w-12 h-12 mx-auto mb-2" />
                      <p>No images available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button v-if="selectedReport.status === 'Pending'"
                    @click="approveReport"
                    class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              Approve
            </button>
            <button v-if="selectedReport.status === 'Pending'"
                    @click="disapproveReport"
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
              Disapprove
            </button>
            <button v-if="selectedReport.status === 'In Progress'"
                    @click="setReportStatus('Resolved')"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Mark as Resolved
            </button>
            <button v-if="selectedReport.status === 'Approved'"
                    @click="setReportStatus('In Progress')"
                    class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
              Set to In Progress
            </button>
            <button v-if="['Pending', 'In Progress'].includes(selectedReport.status)"
                    @click="openAssignModal(selectedReport)"
                    class="px-4 py-2 bg-[#002B5B] text-white rounded-md hover:bg-[#003872] transition-colors">
              Assign Police
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Assign Police Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Assign Police</h2>
        <div class="mb-4">
          <label for="police-select" class="block text-sm font-medium text-gray-700 mb-2">Select a Police</label>
          <select
            id="police-select"
            v-model="selectedPolice"
            class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a police</option>
            <option v-for="police in availablePolice" :key="police.id" :value="police">
              {{ police.fullname }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="assignPolice" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Assign
          </button>
          <button @click="closeAssignModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <TransitionRoot appear :show="!!selectedImage" as="template">
      <Dialog as="div" @close="closeImageModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-1">
                <img :src="selectedImage" alt="Enlarged incident photo" class="w-full h-auto" />
                <button
                  @click="closeImageModal"
                  class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  <X class="h-6 w-6" />
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

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
                <div class="flex items-center justify-center mb-4">
                  <div class="bg-green-100 rounded-full p-3">
                    <CheckCircle class="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
                  Responder Assigned Successfully
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 text-center">
                    The responder has been successfully assigned to the police incident report and the report status has been updated to Resolved.
                  </p>
                </div>

                <div class="mt-4 flex justify-center">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-colors duration-200"
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
import { ref, onMounted, computed } from "vue";
import {
  ChevronLeft,
  Menu,
  Bell,
  Settings,
  Eye,
  UserPlus,
  X,
  LayoutDashboard,
  FileText,
  History,
  BarChart2,
  Users,
  Flame,
  CheckCircle
} from "lucide-vue-next";
import { useCrimeReportStore } from "@/stores/crimeReportStore";
import { usePoliceStore } from "@/stores/policeStore";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const crimeReportStore = useCrimeReportStore();
const policeStore = usePoliceStore();

const isSidebarCollapsed = ref(false);
const selectedReport = ref(null);
const showAssignModal = ref(false);
const selectedPolice = ref(null);
const showSuccessModal = ref(false);
const selectedImage = ref(null);
const searchQuery = ref('');
const statusFilter = ref('All');

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const viewReport = (report) => {
  selectedReport.value = report;
};

const closeViewModal = () => {
  selectedReport.value = null;
};

const openImageModal = (imagePath) => {
  selectedImage.value = imagePath;
};

const closeImageModal = () => {
  selectedImage.value = null;
};

const approveReport = async () => {
  if (selectedReport.value) {
    await crimeReportStore.updateReportStatus(selectedReport.value.id, 'Approved');
    selectedReport.value.status = 'Approved';
  }
};

const disapproveReport = async () => {
  if (selectedReport.value) {
    await crimeReportStore.updateReportStatus(selectedReport.value.id, 'Disapproved');
    selectedReport.value.status = 'Disapproved';
  }
};

const setReportStatus = async (status) => {
  if (selectedReport.value) {
    await crimeReportStore.updateReportStatus(selectedReport.value.id, status);
    selectedReport.value.status = status;
  }
};

const openAssignModal = (report) => {
  if (['Pending', 'In Progress'].includes(report.status)) {
    selectedReport.value = report;
    showAssignModal.value = true;
  }
};

const closeAssignModal = () => {
  showAssignModal.value = false;
  selectedPolice.value = null;
};

const assignPolice = async () => {
  if (selectedReport.value && selectedPolice.value) {
    try {
      await crimeReportStore.assignPolice(selectedReport.value.id, selectedPolice.value.id);
      await crimeReportStore.updateReportStatus(selectedReport.value.id, 'Resolved');
      selectedReport.value.status = 'Resolved';
      selectedReport.value.assignedTo = selectedPolice.value.fullname;
      await policeStore.updatePoliceStatus(selectedPolice.value.id, 'assigned');
      closeAssignModal();
      showSuccessModal.value = true;
    } catch (error) {
      console.error('Error assigning police:', error);
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
  { name: "Dashboard", icon: LayoutDashboard, path: "/npsdashboard", active: false },
  { name: "Crime Reports", icon: FileText, path: "/npsreports", active: true },
  { name: "Police", icon: Users, path: "/npspolice", active: false },
  { name: "Incident History", icon: History, path: "/npshistory", active: false },
  { name: "Crime Analytics", icon: BarChart2, path: "/npsmap", active: false },
];

const availablePolice = computed(() => {
  return policeStore.police.filter(police => police.status === 'available');
});

const filteredAndSortedReports = computed(() => {
  let filtered = crimeReportStore.crimeReports;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(report =>
      report.id.toLowerCase().includes(query) ||
      report.incidentType.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(report => report.status === statusFilter.value);
  }

  // Sort by date (latest first)
  return filtered.sort((a, b) => b.dateTime.seconds - a.dateTime.seconds);
});

const setStatusFilter = (status) => {
  statusFilter.value = status;
};

onMounted(async () => {
  await crimeReportStore.fetchCrimeReports();
  await policeStore.fetchPolice();
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

.bg-gray-50 {
  background-color: #F9FAFB;
}

.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.rounded-lg {
  border-radius: 0.5rem;
}
.text-002B5B {
  color: #002B5B;
}
</style>

