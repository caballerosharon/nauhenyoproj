<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
    <div class="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div class="p-6">
        <h1 class="text-3xl font-bold mb-6 text-center">Firefighter Profile</h1>
        <div v-if="currentFirefighter" class="space-y-6">
          <div class="flex items-center justify-center">
            <div v-if="currentFirefighter.photoURL" class="w-32 h-32 rounded-full border-4 border-orange-500 overflow-hidden">
              <img 
                :src="currentFirefighter.photoURL" 
                :alt="currentFirefighter.fullname"
                class="w-full h-full object-cover"
              >
            </div>
            <div 
              v-else
              :class="[
                'w-32 h-32 rounded-full border-4 border-orange-500 flex items-center justify-center text-white font-semibold text-4xl',
                getAvatarColor(currentFirefighter.fullname)
              ]"
            >
              {{ getInitials(currentFirefighter.fullname) }}
            </div>
          </div>
          <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <p class="text-gray-400">Full Name</p>
              <p class="font-semibold">{{ currentFirefighter.fullname }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-gray-400">Email</p>
              <p class="font-semibold">{{ currentFirefighter.email }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-gray-400">Birthday</p>
              <p class="font-semibold">{{ formatDate(currentFirefighter.birthdate) }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-gray-400">Status</p>
              <p class="font-semibold">{{ capitalizeFirstLetter(currentFirefighter.status) }}</p>
            </div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="fullname" class="text-gray-400">Full Name</label>
              <input 
                id="fullname"
                v-model="editedFirefighter.fullname" 
                class="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
            </div>
            <div class="space-y-2">
              <label for="email" class="text-gray-400">Email</label>
              <input 
                id="email"
                v-model="editedFirefighter.email" 
                class="w-full bg-gray-700 text-white rounded px-3 py-2"
                disabled
              >
            </div>
            <div class="space-y-2">
              <label for="birthdate" class="text-gray-400">Birthday</label>
              <input 
                id="birthdate"
                v-model="editedFirefighter.birthdate" 
                type="date"
                class="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
            </div>
            <div class="space-y-2">
              <label for="status" class="text-gray-400">Status</label>
              <select 
                id="status"
                v-model="editedFirefighter.status" 
                class="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
          <div class="flex justify-center space-x-4">
            <button 
              v-if="!isEditing"
              @click="startEditing" 
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
            <template v-else>
              <button 
                @click="saveChanges" 
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button 
                @click="cancelEditing" 
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </template>
          </div>
          
          <!-- Assigned Reports Panel -->
          <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Assigned Reports</h2>
            <div v-if="assignedReports.length > 0" class="space-y-4">
              <div v-for="report in assignedReports" :key="report.id" class="bg-gray-700 p-4 rounded-lg">
                <h3 class="text-lg font-semibold">{{ report.incidentType }}</h3>
                <p class="text-gray-300">Location: {{ report.location }}</p>
                <p class="text-gray-300">Date: {{ formatDate(report.dateTime) }}</p>
                <p class="text-gray-300">Status: {{ report.status }}</p>
              </div>
            </div>
            <p v-else class="text-gray-400">No reports currently assigned.</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-400">
          Loading firefighter profile...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useFirefighterStore } from '@/stores/firefighterStore';
import { useFireReportStore } from '@/stores/fireReportStore';
import { getAuth } from 'firebase/auth';

const firefighterStore = useFirefighterStore();
const fireReportStore = useFireReportStore();
const currentFirefighter = ref(null);
const editedFirefighter = ref(null);
const isEditing = ref(false);

onMounted(async () => {
  await firefighterStore.fetchFirefighters();
  await fireReportStore.fetchFireReports();
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    currentFirefighter.value = firefighterStore.firefighters.find(
      firefighter => firefighter.email === user.email
    );
  }
});

const assignedReports = computed(() => {
  if (!currentFirefighter.value) return [];
  return fireReportStore.fireReports.filter(
    report => report.assignedTo === currentFirefighter.value.id
  );
});

const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-indigo-500',
    'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const startEditing = () => {
  editedFirefighter.value = { ...currentFirefighter.value };
  isEditing.value = true;
};

const cancelEditing = () => {
  editedFirefighter.value = null;
  isEditing.value = false;
};

const saveChanges = async () => {
  try {
    await firefighterStore.updateFirefighter(editedFirefighter.value);
    await firefighterStore.updateFirefighterStatus(editedFirefighter.value.id, editedFirefighter.value.status);
    currentFirefighter.value = { ...editedFirefighter.value };
    isEditing.value = false;
  } catch (error) {
    console.error('Error updating firefighter:', error);
    // Handle error (e.g., show error message to user)
  }
};
</script>