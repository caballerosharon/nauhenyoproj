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
          <h1 class="text-xl font-semibold">Firefighter Management</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="openAddFirefighterModal" class="flex items-center px-4 py-2 bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-colors duration-200">
            <UserPlus class="h-5 w-5 mr-2" />
            <span>Add Firefighter</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-auto p-8">
        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">Total Firefighters</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ firefighterStore.firefighters.length }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">Currently Assigned</h3>
            <p class="text-2xl font-semibold text-green-600">{{ assignedCount }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">Available</h3>
            <p class="text-2xl font-semibold text-blue-600">{{ availableCount }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-gray-500 text-sm font-medium">On Leave</h3>
            <p class="text-2xl font-semibold text-orange-600">{{ onLeaveCount }}</p>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search firefighters..."
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
          <select
            v-model="statusFilter"
            class="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>

        <!-- Firefighters Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="firefighter in filteredFirefighters" :key="firefighter.id" 
               class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div 
                      :class="[
                        'w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl',
                        getAvatarColor(firefighter.fullname)
                      ]"
                    >
                      {{ getInitials(firefighter.fullname) }}
                    </div>
                    <span 
                      :class="[
                        'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white',
                        firefighter.status === 'available' ? 'bg-green-500' :
                        firefighter.status === 'assigned' ? 'bg-orange-500' : 'bg-red-500'
                      ]"
                    ></span>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ firefighter.fullname }}</h3>
                    <p class="text-sm text-gray-500">{{ firefighter.gender }}</p>
                  </div>
                </div>
                <div class="relative">
                  <button @click="openFirefighterMenu(firefighter)" class="text-gray-400 hover:text-gray-600">
                    <MoreVertical class="h-5 w-5" />
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="selectedFirefighter?.id === firefighter.id && showMenu"
                       class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div class="py-1">
                      <button
                        @click="editFirefighter(firefighter)"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Edit2 class="h-4 w-4 mr-2" />
                        Edit Firefighter
                      </button>
                      <button
                        @click="confirmDelete(firefighter)"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete Firefighter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 space-y-2">
                <div class="flex items-center text-sm text-gray-500">
                  <Mail class="h-4 w-4 mr-2" />
                  {{ firefighter.email }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <Calendar class="h-4 w-4 mr-2" />
                  {{ formatDate(firefighter.birthdate) }}
                </div>
                <div class="flex items-center text-sm">
                  <Badge class="h-4 w-4 mr-2" />
                  <span :class="{
                    'text-green-600': firefighter.status === 'available',
                    'text-orange-600': firefighter.status === 'assigned',
                    'text-red-600': firefighter.status === 'on-leave'
                  }">
                    {{ formatStatus(firefighter.status) }}
                  </span>
                </div>
              </div>
              <div class="mt-4 flex space-x-2">
                <button 
                  @click="viewFirefighterDetails(firefighter)"
                  class="flex-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  View Details
                </button>
                <button 
                  @click="updateStatus(firefighter)"
                  class="flex-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Firefighter Modal -->
    <TransitionRoot appear :show="showAddModal" as="template">
      <Dialog as="div" @close="closeAddModal" class="relative z-50">
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
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Add New Firefighter
                </DialogTitle>
                <form @submit.prevent="addFirefighter" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="fullname" class="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        id="fullname"
                        v-model="newFirefighter.fullname"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        id="gender"
                        v-model="newFirefighter.gender"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="birthdate" class="block text-sm font-medium text-gray-700">Birthdate</label>
                      <input
                        id="birthdate"
                        v-model="newFirefighter.birthdate"
                        type="date"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="status"
                        v-model="newFirefighter.status"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                      >
                        <option value="available">Available</option>
                        <option value="assigned">Assigned</option>
                        <option value="on-leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      id="address"
                      v-model="newFirefighter.address"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      v-model="newFirefighter.email"
                      type="email"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="password"
                      v-model="newFirefighter.password"
                      type="password"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      @click="closeAddModal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Add Firefighter
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Update Status Modal -->
    <TransitionRoot appear :show="showStatusModal" as="template">
      <Dialog as="div" @close="closeStatusModal" class="relative z-50">
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
                  Update Firefighter Status
                </DialogTitle>
                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    Current status: <span class="font-medium">{{ formatStatus(selectedFirefighter?.status) }}</span>
                  </p>
                  <select
                    v-model="selectedStatus"
                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  >
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    @click="closeStatusModal"
                  >
                    Cancel
                  </button>
                  <button
                    @click="confirmStatusUpdate"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Edit Firefighter Modal -->
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div class="relative">
                  <!-- Header with profile picture -->
                  <div class="bg-gray-50 p-6">
                    <div class="flex items-center space-x-4">
                      <div class="relative">
                        <div 
                          :class="[
                            'w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl',
                            getAvatarColor(editingFirefighter.fullname)
                          ]"
                        >
                          {{ getInitials(editingFirefighter.fullname) }}
                        </div>
                      </div>
                      <div>
                        <h3 class="text-lg font-medium text-gray-900">
                          {{ editingFirefighter.fullname }}
                        </h3>
                        <p class="text-sm text-gray-500">{{ editingFirefighter.email }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Form content -->
                  <div class="p-6">
                    <form @submit.prevent="saveFirefighter" class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          v-model="editingFirefighter.fullname"
                          type="text"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                          v-model="editingFirefighter.gender"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Birthdate</label>
                        <input
                          v-model="editingFirefighter.birthdate"
                          type="date"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          v-model="editingFirefighter.address"
                          type="text"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          v-model="editingFirefighter.email"
                          type="email"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          v-model="editingFirefighter.status"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        >
                          <option value="available">Available</option>
                          <option value="assigned">Assigned</option>
                          <option value="on-leave">On Leave</option>
                        </select>
                      </div>
                      <div class="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                          @click="closeEditModal"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- View Details Modal -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" @close="closeDetailsModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div class="relative">
                  <!-- Header with profile picture -->
                  <div class="bg-gray-50 p-6">
                    <div class="flex items-center space-x-4">
                      <div class="relative">
                        <div 
                          :class="[
                            'w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl',
                            getAvatarColor(selectedFirefighter?.fullname)
                          ]"
                        >
                          {{ getInitials(selectedFirefighter?.fullname) }}
                        </div>
                        <span 
                          :class="[
                            'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white',
                            selectedFirefighter?.status === 'available' ? 'bg-green-500' :
                            selectedFirefighter?.status === 'assigned' ? 'bg-orange-500' : 'bg-red-500'
                          ]"
                        ></span>
                      </div>
                      <div>
                        <h3 class="text-lg font-medium text-gray-900">
                          {{ selectedFirefighter?.fullname }}
                        </h3>
                        <p class="text-sm text-gray-500">{{ selectedFirefighter?.gender }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Details content -->
                  <div class="p-6">
                    <div class="space-y-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
                        <div class="mt-2 space-y-2">
                          <div class="flex items-center text-sm">
                            <Mail class="h-4 w-4 text-gray-400 mr-2" />
                            {{ selectedFirefighter?.email }}
                          </div>
                          <div class="flex items-center text-sm">
                            <MapPin class="h-4 w-4 text-gray-400 mr-2" />
                            {{ selectedFirefighter?.address }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Personal Information</h4>
                        <div class="mt-2 space-y-2">
                          <div class="flex items-center text-sm">
                            <Calendar class="h-4 w-4 text-gray-400 mr-2" />
                            {{ formatDate(selectedFirefighter?.birthdate) }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Status</h4>
                        <div class="mt-2">
                          <span 
                            :class="[
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              selectedFirefighter?.status === 'available' ? 'bg-green-100 text-green-800' :
                              selectedFirefighter?.status === 'assigned' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            ]"
                          >
                            {{ formatStatus(selectedFirefighter?.status || '') }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="mt-6 flex justify-end">
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        @click="closeDetailsModal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="showDeleteModal" as="template">
      <Dialog as="div" @close="closeDeleteModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Delete Firefighter
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this firefighter? This action cannot be undone.
                  </p>
                </div>
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    @click="closeDeleteModal"
                  >
                    Cancel
                  </button>
                  <button
                    @click="deleteFirefighter"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex items-center justify-center mb-4">
                  <div class="rounded-full bg-green-100 p-3">
                    <CheckIcon class="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-center text-gray-900">
                  {{ successMessage }}
                </DialogTitle>
                <div class="mt-4 flex justify-center">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    @click="closeSuccessModal"
                  >
                    OK
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
import { 
  ChevronLeft, Menu, UserPlus, MoreVertical, 
  Mail, Badge, LayoutDashboard, FileText, History, 
  BarChart2, Users, Edit2, Trash2, Calendar, MapPin,
  CheckIcon
} from 'lucide-vue-next';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useFirefighterStore } from '@/stores/firefighterStore';
import { useFireReportStore } from '@/stores/fireReportStore';

const firefighterStore = useFirefighterStore();
const fireReportStore = useFireReportStore();

const isSidebarCollapsed = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const showAddModal = ref(false);
const showStatusModal = ref(false);
const showEditModal = ref(false);
const showDetailsModal = ref(false);
const showDeleteModal = ref(false);
const showSuccessModal = ref(false);
const showMenu = ref(false);
const selectedFirefighter = ref(null);
const selectedStatus = ref('');
const editingFirefighter = ref({});
const successMessage = ref('');

const newFirefighter = ref({
  fullname: '',
  gender: 'male',
  birthdate: '',
  address: '',
  email: '',
  password: '',
  status: 'available'
});

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/bfpdashboard", active: false },
  { name: "Fire Reports", icon: FileText, path: "/bfpreports", active: false },
  { name: "Firefighters", icon: Users, path: "/bfpfireman", active: true },
  { name: "Incident History", icon: History, path: "/bfphistory", active: false },
  { name: "Fire Analytics", icon: BarChart2, path: "/bfpmap", active: false },
];

const assignedCount = computed(() => 
  firefighterStore.firefighters.filter(f => f.status === 'assigned').length
);

const availableCount = computed(() => 
  firefighterStore.firefighters.filter(f => f.status === 'available').length
);

const onLeaveCount = computed(() => 
  firefighterStore.firefighters.filter(f => f.status === 'on-leave').length
);

// const assignedFirefighters = computed(() => {
//   return firefighterStore.firefighters.filter(f => f.status === 'assigned');
// });

const filteredFirefighters = computed(() => {
  let filtered = firefighterStore.firefighters;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(f => 
      f.fullname.toLowerCase().includes(query) ||
      f.gender.toLowerCase().includes(query) ||
      f.email.toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(f => f.status === statusFilter.value);
  }
  
  return filtered;
});

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const formatStatus = (status) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'assigned':
      return 'Assigned';
    case 'on-leave':
      return 'On Leave';
    default:
      return status;
  }
};

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-400';
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const openAddFirefighterModal = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
  newFirefighter.value = {
    fullname: '',
    gender: 'male',
    birthdate: '',
    address: '',
    email: '',
    password: '',
    status: 'available'
  };
};

const addFirefighter = async () => {
  try {
    await firefighterStore.addFirefighter({
      ...newFirefighter.value,
      dateJoined: new Date(),
    });
    closeAddModal();
    successMessage.value = 'Firefighter added successfully!';
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error adding firefighter:', error);
  }
};

const updateStatus = async (firefighter) => {
  selectedFirefighter.value = firefighter;
  selectedStatus.value = firefighter.status;
  
  const assignedReports = fireReportStore.fireReports.filter(report => 
    report.assignedTo === firefighter.uid && report.status !== 'Resolved'
  );

  if (assignedReports.length > 0 && selectedStatus.value !== 'assigned') {
    alert('This firefighter is currently assigned to active reports. Please reassign or resolve the reports before changing the status.');
    return;
  }

  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedFirefighter.value = null;
  selectedStatus.value = '';
};

const confirmStatusUpdate = async () => {
  if (selectedFirefighter.value && selectedStatus.value) {
    try {
      await firefighterStore.updateFirefighterStatus(
        selectedFirefighter.value.id,
        selectedStatus.value
      );
      
      if (selectedFirefighter.value.status === 'assigned' && selectedStatus.value !== 'assigned') {
        const relatedReports = fireReportStore.fireReports.filter(report => 
          report.assignedTo === selectedFirefighter.value.uid && report.status !== 'Resolved'
        );
        
        for (const report of relatedReports) {
          await fireReportStore.updateReportStatus(report.id, 'Pending');
          await fireReportStore.assignFirefighter(report.id, null);
        }
      }

      closeStatusModal();
      successMessage.value = 'Firefighter status updated successfully!';
      showSuccessModal.value = true;
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
};

const openFirefighterMenu = (firefighter) => {
  selectedFirefighter.value = firefighter;
  showMenu.value = true;
  document.addEventListener('click', closeMenu);
};

const closeMenu = (event) => {
  if (!event.target.closest('.relative')) {
    showMenu.value = false;
    document.removeEventListener('click', closeMenu);
  }
};

const editFirefighter = (firefighter) => {
  editingFirefighter.value = { ...firefighter };
  showEditModal.value = true;
  showMenu.value = false;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingFirefighter.value = {};
};

const saveFirefighter = async () => {
  try {
    await firefighterStore.updateFirefighter(editingFirefighter.value);
    closeEditModal();
    successMessage.value = 'Firefighter updated successfully!';
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error updating firefighter:', error);
  }
};

const confirmDelete = (firefighter) => {
  selectedFirefighter.value = firefighter;
  showDeleteModal.value = true;
  showMenu.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedFirefighter.value = null;
};

const deleteFirefighter = async () => {
  if (selectedFirefighter.value) {
    try {
      await firefighterStore.deleteFirefighter(selectedFirefighter.value.id);
      closeDeleteModal();
      successMessage.value = 'Firefighter deleted successfully!';
      showSuccessModal.value = true;
    } catch (error) {
      console.error('Error deleting firefighter:', error);
    }
  }
};

const viewFirefighterDetails = (firefighter) => {
  selectedFirefighter.value = firefighter;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedFirefighter.value = null;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = '';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

watch(() => fireReportStore.fireReports, (newReports) => {
  newReports.forEach(report => {
    if (report.assignedTo) {
      const assignedFirefighter = firefighterStore.firefighters.find(f => f.uid === report.assignedTo);
      if (assignedFirefighter && assignedFirefighter.status !== 'assigned') {
        firefighterStore.updateFirefighterStatus(assignedFirefighter.id, 'assigned');
      }
    }
  });
}, { deep: true });

onMounted(async () => {
  await firefighterStore.fetchFirefighters();
  await fireReportStore.fetchFireReports();
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