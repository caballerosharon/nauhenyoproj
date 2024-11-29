<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-poppins">
    <!-- Sidebar -->
    <aside class="bg-[#05808C] w-64 flex flex-col fixed inset-y-0 left-0 z-20">
      <div class="p-4 flex items-center gap-3">
        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-[#05808C] font-bold">N</span>
        </div>
        <h1 class="text-xl font-bold text-white">NauHenyo</h1>
      </div>
      
      <nav class="flex-1 px-2 py-4">
        <ul class="space-y-1">
          <li v-for="(item, index) in menuItems" :key="index">
            <RouterLink :to="item.to" :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
              item.current ? 'bg-[#04454B] text-white' : 'text-gray-300 hover:bg-[#04454B]/50'
            ]">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-[#05808C] text-white h-16 flex items-center px-6 shadow-md sticky top-0 z-10">
        <h1 class="text-xl font-semibold">User Profile</h1>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-8">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-2xl font-medium text-gray-900">Personal info</h2>
              <p class="mt-1 text-sm text-gray-500">Info about you and your preferences across NauHenyo services</p>
            </div>

            <div class="border-t border-gray-200">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Basic info</h3>
              
                <!-- Name -->
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 cursor-pointer" @click="editField('name')">
                  <div>
                    <span class="text-sm text-gray-500">Name</span>
                    <p class="text-sm text-gray-900">{{ userProfile.displayName || 'Edit name' }}</p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>

                <!-- Birthday -->
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 cursor-pointer" @click="editField('birthday')">
                  <div>
                    <span class="text-sm text-gray-500">Birthday</span>
                    <p class="text-sm text-gray-900">{{ userProfile.birthday || 'Add birthday' }}</p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>

                <!-- Gender -->
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 cursor-pointer" @click="editField('gender')">
                  <div>
                    <span class="text-sm text-gray-500">Gender</span>
                    <p class="text-sm text-gray-900">{{ userProfile.gender || 'Add gender' }}</p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="border-t border-gray-200">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Contact info</h3>
              
                <!-- Email -->
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6">
                  <div>
                    <span class="text-sm text-gray-500">Email</span>
                    <div class="text-sm text-gray-900 mt-1">
                      {{ userProfile.email }}
                    </div>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>

                <!-- Phone -->
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 cursor-pointer" @click="editField('phone')">
                  <div>
                    <span class="text-sm text-gray-500">Phone</span>
                    <div class="text-sm text-gray-900 mt-1">
                      {{ userProfile.phoneNumber || 'Add phone number' }}
                    </div>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="border-t border-gray-200">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Addresses</h3>
                </div>
              
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 cursor-pointer" @click="editField('address')">
                  <div>
                    <span class="text-sm text-gray-500">Home</span>
                    <p class="text-sm text-gray-900">{{ userProfile.address || 'Add address' }}</p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Password -->
            <div class="border-t border-gray-200">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Password</h3>
                </div>
              
                <div class="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 cursor-pointer" @click="editField('password')">
                  <div>
                    <span class="text-sm text-gray-500">Change password</span>
                    <p class="text-sm text-gray-900">********</p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Save Changes Button -->
            <div class="border-t border-gray-200 p-6">
              <button 
                @click="saveAllChanges"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-[#05808C] hover:bg-[#04454B] rounded-md"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Edit {{ currentEditField.charAt(0).toUpperCase() + currentEditField.slice(1) }}
        </h3>
        
        <input 
          v-if="!['gender', 'address', 'password'].includes(currentEditField)"
          v-model="editValue"
          :type="currentEditField === 'birthday' ? 'date' : 'text'"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05808C]"
        />
        
        <select 
          v-if="currentEditField === 'gender'"
          v-model="editValue"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05808C]"
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
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05808C]"
        ></textarea>

        <div v-if="currentEditField === 'password'">
          <input 
            type="password"
            v-model="currentPassword"
            placeholder="Current Password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05808C] mb-2"
          />
          <input 
            type="password"
            v-model="newPassword"
            placeholder="New Password (min 6 characters)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05808C] mb-2"
          />
          <input 
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm New Password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05808C]"
          />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button 
            @click="showEditModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button 
            @click="saveEdit"
            class="px-4 py-2 text-sm font-medium text-white bg-[#05808C] hover:bg-[#04454B] rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button @click="showSuccessModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <XIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Success</h3>
        <p>Your changes have been saved successfully.</p>
      </div>
    </div>

    <!-- Failure Modal -->
    <div v-if="showFailureModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button @click="showFailureModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <XIcon class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Error</h3>
        <p>Failed to save changes. Please try again.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getAuth, updateProfile as firebaseUpdateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import {
  LayoutDashboard,
  FileText,
  Flame,
  FolderOpen,
  MapPin,
  UserCircle,
  ChevronRight,
  X as XIcon,
} from 'lucide-vue-next'

import { db } from '../firebase/config'

const auth = getAuth()

const userProfile = ref({
  displayName: '',
  email: '',
  phoneNumber: '',
  address: '',
  birthday: '',
  gender: '',
  photoURL: '',
  fullSizePhotoURL: ''
})

const showEditModal = ref(false)
const showSuccessModal = ref(false)
const showFailureModal = ref(false)
const currentEditField = ref('')
const editValue = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, current: false },
  { name: 'Report Crime', to: '/reportcrime', icon: FileText, current: false },
  { name: 'Report Fire', to: '/reportfire', icon: Flame, current: false },
  { name: 'My Reports', to: '/history', icon: FolderOpen, current: false },
  { name: 'Map', to: '/usermap', icon: MapPin, current: false },
  { name: 'Profile', to: '/profile', icon: UserCircle, current: true },
]

const fetchUserProfile = async () => {
  const user = auth.currentUser
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      userProfile.value = {
        displayName: userData.displayName || user.displayName || '',
        email: user.email,
        phoneNumber: userData.phoneNumber || user.phoneNumber || '',
        address: userData.address || '',
        birthday: userData.birthday || '',
        gender: userData.gender || '',
        photoURL: userData.photoURL || user.photoURL || '',
        fullSizePhotoURL: userData.fullSizePhotoURL || ''
      }
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
      }
      // Create a new user document if it doesn't exist
      await setDoc(doc(db, 'users', user.uid), userProfile.value)
    }
    // Update localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile.value))
  }
}

const editField = (field) => {
  currentEditField.value = field
  editValue.value = userProfile.value[field === 'name' ? 'displayName' : field] || ''
  showEditModal.value = true
}

const saveEdit = async () => {
  const user = auth.currentUser
  if (user) {
    try {
      if (currentEditField.value === 'password') {
        if (newPassword.value !== confirmPassword.value) {
          alert('New passwords do not match.')
          return
        }
        if (newPassword.value.length < 6) {
          alert('New password must be at least 6 characters long.')
          return
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
        await reauthenticateWithCredential(user, credential)
        await updatePassword(user, newPassword.value)
        alert('Password updated successfully.')
      } else {
        const updates = {}
        
        if (currentEditField.value === 'name') {
          updates.displayName = editValue.value
          await firebaseUpdateProfile(user, { displayName: editValue.value })
        } else if (currentEditField.value === 'phone') {
          updates.phoneNumber = editValue.value
        } else {
          updates[currentEditField.value] = editValue.value
        }

        await updateDoc(doc(db, 'users', user.uid), updates)
        userProfile.value = { ...userProfile.value, ...updates }

        // Update localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile.value))
      }
      
      showEditModal.value = false
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      // Show success modal
      showSuccessModal.value = true

      // Refresh the user profile data
      await fetchUserProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      showFailureModal.value = true
    }
  }
}

const saveAllChanges = async () => {
  const user = auth.currentUser
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
      })
      await firebaseUpdateProfile(user, {
        displayName: userProfile.value.displayName,
        photoURL: userProfile.value.photoURL,
      })
      // Update localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile.value))
      showSuccessModal.value = true
    } catch (error) {
      console.error('Error saving changes:', error)
      showFailureModal.value = true
    }
  }
}

onMounted(() => {
  // Try to load profile from localStorage first
  const storedProfile = localStorage.getItem('userProfile')
  if (storedProfile) {
    userProfile.value = JSON.parse(storedProfile)
  }
  // Then fetch from Firestore to ensure we have the latest data
  fetchUserProfile()
})

// Watch for changes in the userProfile and update localStorage
watch(userProfile, (newProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(newProfile))
}, { deep: true })
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>