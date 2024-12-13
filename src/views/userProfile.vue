<template>
  <div class="min-h-screen bg-gray-900 text-white font-poppins relative">
    <!-- Header -->
    <header class="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white p-4 flex items-center justify-between fixed top-0 w-full z-20 shadow-lg">
      <div class="flex items-center space-x-4">
        <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-8 w-8" />
        <h2 class="text-xl font-semibold">User Profile</h2>
      </div>
      <!-- Search Bar -->
      <div class="flex items-center">
        <router-link
          to="/profile"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg transition-all duration-300"
        >
          <UserCircle class="w-6 h-6" />
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-20 pb-24 px-4 md:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto py-6">
        <div class="bg-gray-800 rounded-lg shadow-md border border-teal-700">
          <div class="p-6">
            <h2 class="text-2xl font-medium text-white">Personal info</h2>
            <p class="mt-1 text-sm text-gray-400">Info about you and your preferences across NauHenyo services</p>
          </div>

          <div class="border-t border-gray-700">
            <div class="p-6">
              <h3 class="text-lg font-medium text-white mb-4">Basic info</h3>
              
              <!-- Name -->
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6 cursor-pointer" @click="editField('name')">
                <div>
                  <span class="text-sm text-gray-400">Name</span>
                  <p class="text-sm text-white">{{ userProfile.displayName || 'Edit name' }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>

              <!-- Birthday -->
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6 cursor-pointer" @click="editField('birthday')">
                <div>
                  <span class="text-sm text-gray-400">Birthday</span>
                  <p class="text-sm text-white">{{ userProfile.birthday || 'Add birthday' }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>

              <!-- Gender -->
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6 cursor-pointer" @click="editField('gender')">
                <div>
                  <span class="text-sm text-gray-400">Gender</span>
                  <p class="text-sm text-white">{{ userProfile.gender || 'Add gender' }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="border-t border-gray-700">
            <div class="p-6">
              <h3 class="text-lg font-medium text-white mb-4">Contact info</h3>
              
              <!-- Email -->
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6">
                <div>
                  <span class="text-sm text-gray-400">Email</span>
                  <div class="text-sm text-white mt-1">
                    {{ userProfile.email }}
                  </div>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>

              <!-- Phone -->
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6 cursor-pointer" @click="editField('phone')">
                <div>
                  <span class="text-sm text-gray-400">Phone</span>
                  <div class="text-sm text-white mt-1">
                    {{ userProfile.phoneNumber || 'Add phone number' }}
                  </div>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="border-t border-gray-700">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-white">Addresses</h3>
              </div>
              
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6 cursor-pointer" @click="editField('address')">
                <div>
                  <span class="text-sm text-gray-400">Home</span>
                  <p class="text-sm text-white">{{ userProfile.address || 'Add address' }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="border-t border-gray-700">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-white">Password</h3>
              </div>
              
              <div class="flex items-center justify-between py-4 hover:bg-gray-700 -mx-6 px-6 cursor-pointer" @click="editField('password')">
                <div>
                  <span class="text-sm text-gray-400">Change password</span>
                  <p class="text-sm text-white">********</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Save Changes Button -->
          <div class="border-t border-gray-700 p-6">
            <button 
              @click="saveAllChanges"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors duration-300"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 w-full bg-gray-800 border-t border-teal-800 z-20">
      <div class="grid grid-cols-5 h-16">
        <router-link
          v-for="(item, index) in navItems"
          :key="index"
          :to="item.path"
          class="flex flex-col items-center justify-center space-y-1 hover:bg-gray-700 transition-all duration-300"
          :class="{ 'text-teal-300 shadow-glow': $route.path === item.path, 'text-teal-500': $route.path !== item.path }"
        >
          <component :is="item.icon" class="w-6 h-6" />
          <span class="text-xs">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-white mb-4">
          Edit {{ currentEditField.charAt(0).toUpperCase() + currentEditField.slice(1) }}
        </h3>
        
        <input 
          v-if="!['gender', 'address', 'password'].includes(currentEditField)"
          v-model="editValue"
          :type="currentEditField === 'birthday' ? 'date' : 'text'"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
        />
        
        <select 
          v-if="currentEditField === 'gender'"
          v-model="editValue"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          v-if="currentEditField === 'address'"
          v-model="editValue"
          rows="3"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
        ></textarea>

        <div v-if="currentEditField === 'password'">
          <input 
            type="password"
            v-model="currentPassword"
            placeholder="Current Password"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white mb-2"
          />
          <input 
            type="password"
            v-model="newPassword"
            placeholder="New Password (min 6 characters)"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white mb-2"
          />
          <input 
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm New Password"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
          />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button 
            @click="showEditModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-300"
          >
            Cancel
          </button>
          <button 
            @click="saveEdit"
            class="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button @click="showSuccessModal = false" class="absolute top-2 right-2 text-gray-400 hover:text-white">
          <XIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-medium text-white mb-4">Success</h3>
        <p class="text-gray-300">Your changes have been saved successfully.</p>
      </div>
    </div>

    <!-- Failure Modal -->
    <div v-if="showFailureModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button @click="showFailureModal = false" class="absolute top-2 right-2 text-gray-400 hover:text-white">
          <XIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-medium text-white mb-4">Error</h3>
        <p class="text-gray-300">Failed to save changes. Please try again.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAuth, updateProfile as firebaseUpdateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import {
  LayoutDashboard, 
  FileText, 
  Flame,
  FolderOpen, 
  MapPin, 
  UserCircle,

  ChevronRight,
  X as XIcon,
} from 'lucide-vue-next';

import { db } from '../firebase/config';

const auth = getAuth();

const userProfile = ref({
  displayName: '',
  email: '',
  phoneNumber: '',
  address: '',
  birthday: '',
  gender: '',
  photoURL: '',
  fullSizePhotoURL: ''
});

const showEditModal = ref(false);
const showSuccessModal = ref(false);
const showFailureModal = ref(false);
const currentEditField = ref('');
const editValue = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/reportcrime', icon: FileText, label: 'Report Crime' },
  { path: '/reportfire', icon: Flame, label: 'Report Fire' },
  { path: '/usermap', icon: MapPin, label: 'Map' },
  { path: '/history', icon: FolderOpen, label: 'My Reports' },

];

const fetchUserProfile = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userProfile.value = {
        displayName: userData.displayName || user.displayName || '',
        email: user.email,
        phoneNumber: userData.phoneNumber || user.phoneNumber || '',
        address: userData.address || '',
        birthday: userData.birthday || '',
        gender: userData.gender || '',
        photoURL: userData.photoURL || user.photoURL || '',
        fullSizePhotoURL: userData.fullSizePhotoURL || ''
      };
    } else {
      userProfile.value = {
        displayName: user.displayName || '',
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: '',
        birthday: '',
        gender: '',
        photoURL: user.photoURL || '',
        fullSizePhotoURL: ''
      };
      // Create a new user document if it doesn't exist
      await setDoc(doc(db, 'users', user.uid), userProfile.value);
    }
    // Update localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile.value));
  }
};

const editField = (field) => {
  currentEditField.value = field;
  editValue.value = userProfile.value[field === 'name' ? 'displayName' : field] || '';
  showEditModal.value = true;
};

const saveEdit = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      if (currentEditField.value === 'password') {
        if (newPassword.value !== confirmPassword.value) {
          alert('New passwords do not match.');
          return;
        }
        if (newPassword.value.length < 6) {
          alert('New password must be at least 6 characters long.');
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword.value);
        alert('Password updated successfully.');
      } else {
        const updates = {};
        
        if (currentEditField.value === 'name') {
          updates.displayName = editValue.value;
          await firebaseUpdateProfile(user, { displayName: editValue.value });
        } else if (currentEditField.value === 'phone') {
          updates.phoneNumber = editValue.value;
        } else {
          updates[currentEditField.value] = editValue.value;
        }

        await updateDoc(doc(db, 'users', user.uid), updates);
        userProfile.value = { ...userProfile.value, ...updates };

        // Update localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile.value));
      }
      
      showEditModal.value = false;
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';

      // Show success modal
      showSuccessModal.value = true;

      // Refresh the user profile data
      await fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showFailureModal.value = true;
    }
  }
};

const saveAllChanges = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: userProfile.value.displayName,
        phoneNumber: userProfile.value.phoneNumber,
        address: userProfile.value.address,
        birthday: userProfile.value.birthday,
        gender: userProfile.value.gender,
        photoURL: userProfile.value.photoURL,
        fullSizePhotoURL: userProfile.value.fullSizePhotoURL
      });
      await firebaseUpdateProfile(user, {
        displayName: userProfile.value.displayName,
        photoURL: userProfile.value.photoURL,
      });
      // Update localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile.value));
      showSuccessModal.value = true;
    } catch (error) {
      console.error('Error saving changes:', error);
      showFailureModal.value = true;
    }
  }
};

onMounted(() => {
  // Try to load profile from localStorage first
  const storedProfile = localStorage.getItem('userProfile');
  if (storedProfile) {
    userProfile.value = JSON.parse(storedProfile);
  }
  // Then fetch from Firestore to ensure we have the latest data
  fetchUserProfile();
});

// Watch for changes in the userProfile and update localStorage
watch(userProfile, (newProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(newProfile));
}, { deep: true });
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.shadow-glow {
  box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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

