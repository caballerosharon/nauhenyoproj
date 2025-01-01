<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 text-gray-800 font-poppins">
    <!-- Header -->
    <header class="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-neu-bottom p-4 flex items-center justify-between fixed top-0 w-full z-20">
      <div class="flex items-center space-x-4">
        <img src="@/assets/naulogo.png" alt="NauHenyo" class="h-10 w-10 transform hover:rotate-12 transition-transform duration-300" />
        <h2 class="text-2xl font-bold text-teal-700">User Profile</h2>
      </div>
      <router-link
        to="/dashboard"
        class="flex items-center space-x-2 bg-teal-100 hover:bg-teal-200 p-2 rounded-full transition-all duration-300"
      >
        <ArrowLeft class="w-6 h-6 text-teal-600" />
        <span class="text-sm font-medium text-teal-600">Back to Dashboard</span>
      </router-link>
    </header>

    <!-- Main Content -->
    <main class="pt-24 pb-24 px-4 md:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-neu p-8 space-y-8">
          <!-- Profile Header -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <img
                :src="userProfile.photoURL || 'https://via.placeholder.com/100'"
                alt="Profile Picture"
                class="w-24 h-24 rounded-full object-cover border-4 border-teal-200"
              />
              <button
                @click="editField('photo')"
                class="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors duration-300"
              >
                <Camera class="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">{{ userProfile.displayName || 'Your Name' }}</h1>
              <p class="text-teal-600">{{ userProfile.email }}</p>
            </div>
          </div>

          <!-- Profile Completion -->
          <div class="bg-teal-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-teal-700 mb-2">Profile Completion</h3>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${profileCompletionPercentage}%` }"
              ></div>
            </div>
            <p class="text-sm text-teal-600 mt-2">{{ profileCompletionPercentage }}% complete</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Basic Info -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold text-gray-800 flex items-center">
                <User class="w-6 h-6 mr-2 text-teal-500" />
                Basic Info
              </h3>
              
              <div @click="editField('name')" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:shadow-neu-inner transition-all duration-300">
                <div>
                  <span class="text-sm font-medium text-teal-600">Name</span>
                  <p class="text-gray-800">{{ userProfile.displayName || 'Add your name' }}</p>
                </div>
                <Edit3 class="w-5 h-5 text-teal-400" />
              </div>

              <div @click="editField('birthday')" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:shadow-neu-inner transition-all duration-300">
                <div>
                  <span class="text-sm font-medium text-teal-600">Birthday</span>
                  <p class="text-gray-800">{{ userProfile.birthday || 'Add your birthday' }}</p>
                </div>
                <Edit3 class="w-5 h-5 text-teal-400" />
              </div>

              <div @click="editField('gender')" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:shadow-neu-inner transition-all duration-300">
                <div>
                  <span class="text-sm font-medium text-teal-600">Gender</span>
                  <p class="text-gray-800">{{ userProfile.gender || 'Add your gender' }}</p>
                </div>
                <Edit3 class="w-5 h-5 text-teal-400" />
              </div>

              <!-- Contact Info -->
              <h3 class="text-xl font-semibold text-gray-800 flex items-center mt-6">
                <Phone class="w-6 h-6 mr-2 text-teal-500" />
                Contact Info
              </h3>
              
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span class="text-sm font-medium text-teal-600">Email</span>
                  <p class="text-gray-800">{{ userProfile.email }}</p>
                </div>
                <Mail class="w-5 h-5 text-teal-400" />
              </div>

              <div @click="editField('phone')" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:shadow-neu-inner transition-all duration-300">
                <div>
                  <span class="text-sm font-medium text-teal-600">Phone</span>
                  <p class="text-gray-800">{{ userProfile.phoneNumber || 'Add phone number' }}</p>
                </div>
                <Edit3 class="w-5 h-5 text-teal-400" />
              </div>
            </div>

            <!-- Address and Password Panel -->
            <div class="space-y-4">
              <!-- Address -->
              <h3 class="text-xl font-semibold text-gray-800 flex items-center">
                <MapPin class="w-6 h-6 mr-2 text-teal-500" />
                Address
              </h3>
              
              <div @click="editField('address')" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:shadow-neu-inner transition-all duration-300">
                <div>
                  <span class="text-sm font-medium text-teal-600">Home</span>
                  <p class="text-gray-800">{{ userProfile.address || 'Add your address' }}</p>
                </div>
                <Edit3 class="w-5 h-5 text-teal-400" />
              </div>

              <!-- Password -->
              <h3 class="text-xl font-semibold text-gray-800 flex items-center mt-6">
                <Lock class="w-6 h-6 mr-2 text-teal-500" />
                Password
              </h3>
              
              <div @click="editField('password')" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:shadow-neu-inner transition-all duration-300">
                <div>
                  <span class="text-sm font-medium text-teal-600">Change password</span>
                  <p class="text-gray-800">********</p>
                </div>
                <Edit3 class="w-5 h-5 text-teal-400" />
              </div>
            </div>
          </div>

          <!-- Save Changes Button -->
          <button 
            @click="saveAllChanges"
            class="w-full px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-neu-top z-20">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.path"
            class="flex flex-col items-center justify-center w-full hover:bg-gray-100 transition-all duration-300"
            :class="{ 'text-teal-600': $route.path === item.path, 'text-gray-600': $route.path !== item.path }"
          >
            <component :is="item.icon" class="w-6 h-6" />
            <span class="text-xs mt-1">{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Edit Modal -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog as="div" @close="closeEditModal" class="relative z-50">
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
                  Edit {{ currentEditField.charAt(0).toUpperCase() + currentEditField.slice(1) }}
                </DialogTitle>
                <div class="mt-4">
                  <input 
                    v-if="!['gender', 'address', 'password', 'photo'].includes(currentEditField)"
                    v-model="editValue"
                    :type="currentEditField === 'birthday' ? 'date' : 'text'"
                    class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
                  />
                  
                  <select 
                    v-if="currentEditField === 'gender'"
                    v-model="editValue"
                    class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
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
                    class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
                  ></textarea>

                  <div v-if="currentEditField === 'password'" class="space-y-2">
                    <input 
                      type="password"
                      v-model="currentPassword"
                      placeholder="Current Password"
                      class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
                    />
                    <input 
                      type="password"
                      v-model="newPassword"
                      placeholder="New Password (min 6 characters)"
                      class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
                    />
                    <input 
                      type="password"
                      v-model="confirmPassword"
                      placeholder="Confirm New Password"
                      class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
                    />
                  </div>

                  <div v-if="currentEditField === 'photo'" class="space-y-2">
                    <input 
                      type="file"
                      @change="handleFileUpload"
                      accept="image/*"
                      class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 shadow-neu-inner"
                    />
                    <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="mt-2 max-w-full h-auto rounded-lg" />
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button 
                    @click="closeEditModal"
                    class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300 shadow-neu-button hover:shadow-neu-button-hover"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="saveEdit"
                    class="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors duration-300 shadow-neu-button hover:shadow-neu-button-hover"
                  >
                    Save
                  </button>
                </div>
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
                    <CheckCircle class="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
                  Success
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 text-center">
                    Your changes have been saved successfully.
                  </p>
                </div>

                <div class="mt-4 flex justify-center">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
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

    <!-- Failure Modal -->
    <TransitionRoot appear :show="showFailureModal" as="template">
      <Dialog as="div" @close="closeFailureModal" class="relative z-50">
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
                  <div class="bg-red-100 rounded-full p-3">
                    <AlertCircle class="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center">
                  Error
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 text-center">
                    Failed to save changes. Please try again.
                  </p>
                </div>

                <div class="mt-4 flex justify-center">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    @click="closeFailureModal"
                  >
                    Close
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
import { ref, computed, onMounted, watch } from 'vue';
import { getAuth, updateProfile as firebaseUpdateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import {
  LayoutDashboard, 
  FileText, 
  Flame,
  FolderOpen, 
  MapPin, 
  Edit3,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  Camera,
  CheckCircle,
  AlertCircle,
} from 'lucide-vue-next';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

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
});

const showEditModal = ref(false);
const showSuccessModal = ref(false);
const showFailureModal = ref(false);
const currentEditField = ref('');
const editValue = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const previewUrl = ref('');
const files = ref([]);
const previewImages = ref([]);

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/reportcrime', icon: FileText, label: 'Report Crime' },
  { path: '/reportfire', icon: Flame, label: 'Report Fire' },
  { path: '/usermap', icon: MapPin, label: 'Map' },
  { path: '/history', icon: FolderOpen, label: 'My Reports' },
];

const profileCompletionPercentage = computed(() => {
  const totalFields = 7; // displayName, email, phoneNumber, address, birthday, gender, photoURL
  let completedFields = 0;

  if (userProfile.value.displayName) completedFields++;
  if (userProfile.value.email) completedFields++;
  if (userProfile.value.phoneNumber) completedFields++;
  if (userProfile.value.address) completedFields++;
  if (userProfile.value.birthday) completedFields++;
  if (userProfile.value.gender) completedFields++;
  if (userProfile.value.photoURL) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
});

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

const closeEditModal = () => {
  showEditModal.value = false;
  currentEditField.value = '';
  editValue.value = '';
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  previewUrl.value = '';
};

const handleFileUpload = async (event) => {
  const newFiles = Array.from(event.target.files);
  files.value = [...files.value, ...newFiles];
  
  for (const file of newFiles) {
    if (previewImages.value.length < 4) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post('http://localhost:3000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data && response.data.path) {
          const imagePath = response.data.path;
          previewImages.value.push(imagePath);
          previewUrl.value = imagePath;
          editValue.value = imagePath;
        } else {
          console.error('Invalid response from server:', response);
          throw new Error('Invalid server response');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        showFailureModal.value = true;
      }
    }
  }
};

// const removeImage = (index) => {
//   previewImages.value.splice(index, 1);
//   files.value.splice(index, 1);
// };

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
        } else if (currentEditField.value === 'photo') {
          updates.photoURL = editValue.value;
          await firebaseUpdateProfile(user, { photoURL: editValue.value });
        } else {
          updates[currentEditField.value] = editValue.value;
        }

        await updateDoc(doc(db, 'users', user.uid), updates);
        Object.assign(userProfile.value, updates);
      }
      
      closeEditModal();
      showSuccessModal.value = true;
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
      const updates = {
        displayName: userProfile.value.displayName,
        phoneNumber: userProfile.value.phoneNumber,
        address: userProfile.value.address,
        birthday: userProfile.value.birthday,
        gender: userProfile.value.gender,
        photoURL: userProfile.value.photoURL,
      };

      await updateDoc(doc(db, 'users', user.uid), updates);
      await firebaseUpdateProfile(user, {
        displayName: userProfile.value.displayName,
        photoURL: userProfile.value.photoURL,
      });

      localStorage.setItem('userProfile', JSON.stringify(userProfile.value));
      showSuccessModal.value = true;
    } catch (error) {
      console.error('Error saving changes:', error);
      showFailureModal.value = true;
    }
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const closeFailureModal = () => {
  showFailureModal.value = false;
};

onMounted(() => {
  const storedProfile = localStorage.getItem('userProfile');
  if (storedProfile) {
    userProfile.value = JSON.parse(storedProfile);
  }
  fetchUserProfile();
});

watch(userProfile, (newProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(newProfile));
}, { deep: true });
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.shadow-neu {
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
}

.shadow-neu-inner {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

.shadow-neu-button {
  box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
}

.shadow-neu-button-hover {
  box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
}

.shadow-neu-top {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-neu-bottom {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out;
}
</style>