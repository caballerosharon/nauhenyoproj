<template>
  <div class="font-sans text-white min-h-screen bg-gray-900">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <a href="#" class="text-2xl font-bold text-red-500">NauHenyo</a>
          <div class="space-x-6 flex items-center">
            <a v-for="item in navItems" :key="item.href" :href="item.href" class="text-white hover:text-red-500 transition duration-300">
              {{ item.name }}
            </a>
            <button @click="redirectToSignup" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out mr-2">
              Register
            </button>
            <button @click="redirectToLogin" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Enhanced Loading Spinner -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-8">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute inset-0 border-4 border-white border-t-transparent border-r-transparent rounded-full animate-spin-reverse"></div>
        </div>
        <div class="mt-4 text-white font-bold text-center">Loading...</div>
      </div>
    </div>

    <!-- Hero Section -->
    <section ref="heroSection" class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/parallax5.jpg-oQvyWR5s5vca44EjN8921tYDtwoORk.jpeg" 
          alt="Investigation Board Background" 
          class="w-full h-full object-cover transition-transform duration-1000 ease-out"
          :style="{ transform: `scale(${1 + scrollPercentage * 0.1})` }"
          ref="heroImage"
        />
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      <div class="relative z-10 text-center px-4">
        <h1 class="text-6xl font-bold mb-4 animate-fade-in-up">NauHenyo</h1>
        <p class="text-xl mb-8 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
           Reporting System for Crime and Fire Incidents
        </p>
        <button @click="redirectToLogin" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out animate-fade-in-up animation-delay-400 shadow-lg">
          Report Incident
        </button>
      </div>
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon class="w-8 h-8 text-white" />
      </div>
    </section>

    <!-- Enhanced About Us Section -->
    <section id="about" class="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <span class="text-red-500 text-sm font-medium mb-2 block animate-pulse">About Us</span>
          <h2 class="text-4xl font-bold mb-4 animate-fade-in-up">Empowering Communities Through Fire and Crime Reporting</h2>
          <p class="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            NauHenyo is designed to revolutionize how communities report and track both crime and fire incidents. Ensuring a safer environment for everyone through an efficient reporting system.
          </p>
        </div>

        <!-- Slider -->
        <div class="relative mb-20 overflow-hidden" style="height: 600px;">
          <div class="absolute inset-0 flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0">
              <div class="relative h-full">
                <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div class="text-center p-8 max-w-2xl">
                    <h3 class="text-3xl font-bold mb-4">{{ slide.title }}</h3>
                    <p class="text-lg">{{ slide.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition duration-300">
            <ChevronLeftIcon class="w-8 h-8 text-white" />
          </button>
          <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition duration-300">
            <ChevronRightIcon class="w-8 h-8 text-white" />
          </button>
        </div>

        <!-- Enhanced Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div v-for="(stat, index) in stats" :key="index" 
               class="bg-gray-800 rounded-xl p-8 text-center transform hover:scale-105 transition duration-300 shadow-lg animate-fade-in-up"
               :style="{ animationDelay: `${index * 200}ms` }"
               ref="statElements">
            <div class="text-4xl font-bold text-red-500 mb-2">
              <span ref="statValue">0</span>{{ stat.suffix }}
            </div>
            <div class="text-xl font-semibold mb-2">{{ stat.label }}</div>
            <p class="text-gray-400">{{ stat.description }}</p>
          </div>
        </div>

        <!-- Enhanced Mission Section -->
        <div class="flex flex-col lg:flex-row items-center justify-between mb-20 relative">
          <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
          <div class="lg:w-1/2 mb-8 lg:mb-0 pr-0 lg:pr-12 relative z-10">
            <div class="space-y-6">
              <div class="inline-block">
                <h3 class="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Our Mission
                </h3>
                <div class="h-1 w-1/3 bg-gradient-to-r from-red-500 to-red-700"></div>
              </div>
              <p class="text-gray-300 text-lg leading-relaxed mb-8 animate-fade-in-left animation-delay-200">
                At NauHenyo, we strive to create safer communities by providing an innovative platform for reporting and managing crime and fire incidents. Our mission is to empower citizens and emergency services with real-time information and efficient tools.
              </p>
              <ul class="space-y-6">
                <li v-for="(point, index) in missionPoints" :key="index" 
                    class="flex items-start animate-fade-in-left transform hover:translate-x-2 transition-all duration-300"
                    :style="{ animationDelay: `${(index + 2) * 200}ms` }">
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-4 mt-1 shadow-lg shadow-red-500/20">
                    <CheckIcon class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-lg text-gray-200 font-medium">{{ point }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <img src="@/assets/nps.png" 
                   alt="Our Mission" 
                   class="w-full h-[400px] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 transform hover:-translate-y-1 transition-transform duration-300 shadow-xl">
                  <div class="flex items-center space-x-4">
                    <div class="p-3 bg-white/10 rounded-lg">
                      <PhoneIcon class="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 class="text-2xl font-bold mb-2 text-white">24/7 Support</h4>
                      <p class="text-gray-200">We're always here to help keep your community safe.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Journey Section -->
        <div class="mt-20">
          <h3 class="text-3xl font-bold mb-8 text-center animate-fade-in-up">Our Journey</h3>
          <div class="relative">
            <div class="absolute h-full w-1 bg-red-500 left-1/2 transform -translate-x-1/2"></div>
            <div v-for="(milestone, index) in milestones" :key="index" 
                 class="relative z-10 mb-8"
                 ref="milestoneElements">
              <div :class="[
                'flex items-center w-full relative',
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              ]">
                <div :class="[
                  'w-1/2 p-4 bg-gray-800 rounded-lg shadow-xl transform transition-all duration-500',
                  index % 2 === 0 ? 'text-right' : 'text-left',
                  'opacity-0 translate-y-10'
                ]">
                  <div class="text-red-500 font-bold mb-1">{{ milestone.year }}</div>
                  <h4 class="text-xl font-semibold mb-2">{{ milestone.title }}</h4>
                  <p class="text-gray-400">{{ milestone.description }}</p>
                </div>
                <div :class="[
                  'absolute w-8 h-8 bg-red-500 rounded-full transform scale-0 transition-all duration-500',
                  index % 2 === 0 ? '-right-4' : '-left-4'
                ]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Decorative Elements -->
      <div class="absolute top-1/4 left-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-1/3 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </section>

    <!-- Enhanced Features Section with New Layout -->
    <section id="features" class="relative py-20 overflow-hidden bg-gradient-to-b from-black to-gray-900">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <span class="text-red-500 text-sm font-medium mb-2 block">KEY FEATURES</span>
          <h2 class="text-4xl font-bold mb-4">Incident Reporting System</h2>
          <p class="text-gray-300 text-lg max-w-3xl mx-auto">
            NauHenyo provides comprehensive tools for reporting and managing both crime and fire incidents, ensuring quick response and efficient handling of emergency situations.
          </p>
        </div>

        <!-- Feature Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div v-for="(feature, index) in features" :key="index" 
               class="bg-[#1a1f2e] rounded-xl p-8 transform hover:scale-105 transition-all duration-300 group"
          >
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-900/50 transition-colors">
                <component :is="feature.icon" class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white">{{ feature.title }}</h3>
              <p class="text-gray-400 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- Enhanced Interactive Mapping Section -->
        <div class="bg-[#1a1f2e] rounded-2xl p-8 backdrop-blur-sm">
          <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-4">
              <div class="sticky top-24">
                <h3 class="text-2xl font-bold mb-4">Interactive Mapping</h3>
                <p class="text-gray-300 mb-6">
                  Track and visualize incidents in real-time with our advanced mapping system. Get detailed insights and patterns to improve emergency response.
                </p>
                
                <!-- Enhanced Map Controls -->
                <div class="space-y-4">
                  <div class="bg-gray-800/50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3 flex items-center">
                      <MapPinIcon class="w-5 h-5 text-red-500 mr-2" />
                      Incident Types
                    </h4>
                    <div class="space-y-2">
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          v-model="mapFilters.showFire" 
                          class="form-checkbox text-red-500 rounded"
                        >
                        <span class="text-gray-300">Fire Incidents</span>
                      </label>
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          v-model="mapFilters.showCrime" 
                          class="form-checkbox text-red-500 rounded"
                        >
                        <span class="text-gray-300">Crime Reports</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="bg-gray-800/50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3 flex items-center">
                      <ClockIcon class="w-5 h-5 text-red-500 mr-2" />
                      Time Range
                    </h4>
                    <select 
                      v-model="mapFilters.timeRange"
                      class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-300"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <!-- Heat Map Controls -->
                  <div class="bg-gray-800/50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3 flex items-center">
                      <LayersIcon class="w-5 h-5 text-red-500 mr-2" />
                      Visualization
                    </h4>
                    <div class="space-y-2">
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          v-model="mapFilters.visualizationType" 
                          value="markers" 
                          class="form-radio text-red-500"
                        >
                        <span class="text-gray-300">Markers</span>
                      </label>
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          v-model="mapFilters.visualizationType" 
                          value="heatmap" 
                          class="form-radio text-red-500"
                        >
                        <span class="text-gray-300">Heat Map</span>
                      </label>
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          v-model="mapFilters.visualizationType" 
                          value="choropleth" 
                          class="form-radio text-red-500"
                        >
                        <span class="text-gray-300">Choropleth</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Map Statistics -->
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-400">Total Incidents</div>
                    <div class="text-2xl font-bold text-white">{{ mapStats.totalIncidents }}</div>
                  </div>
                  <div class="bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-400">Active Now</div>
                    <div class="text-2xl font-bold text-white">{{ mapStats.activeIncidents }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Google Maps Integration -->
            <div class="col-span-12 lg:col-span-8">
              <div class="relative h-[600px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div ref="mapContainer" class="w-full h-full"></div>
                
                <!-- Map Controls -->
                <div class="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <button 
                    @click="zoomIn" 
                    class="p-2 bg-gray-800/90 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <PlusIcon class="w-5 h-5 text-white" />
                  </button>
                  <button 
                    @click="zoomOut" 
                    class="p-2 bg-gray-800/90 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <MinusIcon class="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <!-- Legend -->
                <div class="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-4">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span class="text-sm text-white">Fire Incidents</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span class="text-sm text-white">Crime Reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-1/4 left-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div class="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
    </section>

    <!-- Enhanced Contact Section -->
    <section id="contact" class="py-20 bg-gray-900 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <span class="text-red-500 text-sm font-medium mb-2 block">CONTACT</span>
          <h2 class="text-4xl font-bold mb-4">Get in Touch</h2>
          <p class="text-gray-300 text-lg max-w-3xl mx-auto">
            We're here to listen, assist, and collaborate. Reach out to us for any inquiries, support, or partnership opportunities.
          </p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <!-- Contact Info Column -->
          <div class="lg:col-span-5 space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-6">Contact Information</h3>
            <div v-for="(contact, index) in contactInfo" :key="index" 
                 class="flex items-center space-x-4 animate-fade-in-left"
                 :style="{ animationDelay: `${index * 200}ms` }">
              <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <component :is="contact.icon" class="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 class="text-xl font-semibold mb-2">{{ contact.title }}</h4>
                <p class="text-gray-300">{{ contact.content }}</p>
              </div>
            </div>
            <!-- Social Media Links -->
            <div class="mt-8">
              <h4 class="text-xl font-semibold mb-4">Follow Us</h4>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-red-500 transition-colors">
                  <FacebookIcon class="w-6 h-6" />
                </a>
                <a href="#" class="text-gray-400 hover:text-red-500 transition-colors">
                  <TwitterIcon class="w-6 h-6" />
                </a>
                <a href="#" class="text-gray-400 hover:text-red-500 transition-colors">
                  <InstagramIcon class="w-6 h-6" />
                </a>
                <a href="#" class="text-gray-400 hover:text-red-500 transition-colors">
                  <LinkedinIcon class="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form Column -->
          <div class="lg:col-span-7">
            <form @submit.prevent="submitForm" class="space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg">
              <h3 class="text-2xl font-bold mb-6">Send Us a Message</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="animate-fade-in-up">
                  <label for="name" class="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    placeholder="John Doe"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    required
                  >
                </div>
                <div class="animate-fade-in-up animation-delay-200">
                  <label for="email" class="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="john@example.com"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    required
                  >
                </div>
              </div>
              
              <div class="animate-fade-in-up animation-delay-400">
                <label for="subject" class="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  placeholder="How can we help you?"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  required
                >
              </div>

              <div class="animate-fade-in-up animation-delay-600">
                <label for="message" class="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="6"
                  placeholder="Your message here..."
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  required
                ></textarea>
              </div>

              <div class="flex justify-end animate-fade-in-up animation-delay-800">
                <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-lg flex items-center justify-center group">
                  <span>Send Message</span>
                  <SendIcon class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- Decorative Elements -->
      <div class="absolute top-1/4 right-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div class="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ChevronDownIcon, 
  AlertCircleIcon, 
  MapIcon, 
  FileSearchIcon, 
  SendIcon, 
  ShieldIcon, 
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon,
  LayersIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon
} from 'lucide-vue-next';

const router = useRouter();
const heroSection = ref(null);
const heroImage = ref(null);
const scrollPercentage = ref(0);
const currentSlide = ref(0);
const isLoading = ref(false);
const statElements = ref([]);
const milestoneElements = ref([]);

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'Contact', href: '#contact' },
];

const slides = [
  { 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6925cf22988fc6faddf43fd98b218cd0.jpg-KURr4l4IbTAclx80ZjWfYS9FhPYIs3.jpeg',
    title: 'Crime Reporting',
    description: 'Our platform enables real-time crime reporting with precise location tracking, ensuring faster response times and more effective crime prevention.'
  },
  { 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1c6613c163c899e7282bc687471d2890.jpg-Ta47bZtsyHv3u3TpydSu1Us3rdVWOU.jpeg',
    title: 'Fire Emergency',
    description: 'NauHenyo provides a rapid response system for fire emergencies, facilitating quick deployment of resources and real-time updates to save lives and minimize property damage.'
  },
  { 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bfpbg-aToRbcbaFTyuTIGSIZFAoPg9L2lmog.png',
    title: 'Community Safety',
    description: 'We foster collaboration between citizens and emergency services, creating a network of vigilant community members to enhance public safety and strengthen community bonds.'
  },
  { 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pnp.jpg-0zpDfJWtcZAfiq7pwM6NXkVd9IzeqC.jpeg',
    title: 'Location Tracking',
    description: 'Location integration allows for accurate pinpointing of reported incidents, enabling emergency responders to navigate efficiently and improve overall emergency management.'
  }
];

const features = [
  {
    icon: AlertCircleIcon,
    title: 'Real-time Reporting',
    description: 'Submit crime or fire incident reports instantly with our user-friendly interface. Attach photos, location data, and detailed descriptions.'
  },
  {
    icon: MapIcon,
    title: 'Interactive Mapping',
    description: 'Visualize crime and fire incident patterns with our advanced mapping technology. Track incidents in your area in real-time.'
  },
  {
    icon: FileSearchIcon,
    title: 'Case Management',
    description: 'Track the progress of your reports and receive updates from law enforcement and fire departments. Stay informed every step of the way.'
  },
  {
    icon: ShieldIcon,
    title: 'Data Security',
    description: 'Your data is protected with state-of-the-art encryption and security measures, ensuring privacy and confidentiality.'
  }
];

const stats = [
  {
    value: 50,
    suffix: '+',
    label: 'Reports Processed',
    description: 'Successfully handled and resolved incidents'
  },
  {
    value: 98,
    suffix: '%',
    label: 'User Satisfaction',
    description: 'Positive feedback from our community'
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Support Available',
    description: 'Round-the-clock assistance for emergencies'
  }
];

const missionPoints = [
  'Provide a user-friendly platform for incident reporting',
  'Enhance communication between citizens and emergency services',
  'Improve response times for crime and fire incidents',
  'Foster a sense of community safety and vigilance'
];

const milestones = [
  {
    year: '2024',
    title: 'NauHenyo Envisioned',
    description: 'Launched with a vision to revolutionize incident reporting.'
  },
  {
    year: '2024',
    title: ' NauHenyo Project Proposal',
    description: 'Presented and propsed NauHenyo Pjoject.'
  },
  {
    year: '2024',
    title: 'Partnership with Local Authorities',
    description: 'Integrated our system with police and fire department.'
  },
  {
    year: '2024',
    title: 'NauHenyo Done',
    description: 'Implemented the NauHenyo for the Naujan residence.'
  }
];

const contactInfo = [
  {
    icon: MapPinIcon,
    title: 'Address',
    content: 'Naujan, Oriental Mindoro'
  },
  {
    icon: PhoneIcon,
    title: 'Call Us',
    content: '0956 6600 630'
  },
  {
    icon: MailIcon,
    title: 'Email Us',
    content: 'nauhenyobfp@gmail.com'
  }
];

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitForm = () => {
  console.log('Form submitted:', form);
  // Reset form after submission
  Object.keys(form).forEach(key => form[key] = '');
  // Redirect to login page
  redirectToLogin();
};

const redirectToLogin = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push('/login');
  }, 1000);
};

const redirectToSignup = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push('/signup');
  }, 1000);
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const handleScroll = () => {
  const scrollPosition = window.pageYOffset;
  const windowHeight = window.innerHeight;
  scrollPercentage.value = Math.min(scrollPosition / windowHeight, 1);
};

const animateStat = (element, target) => {
  let current = 0;
  const duration = 2000; // 2 seconds
  const fps = 60;
  const frames = duration / (1000 / fps);
  const increment = target / frames;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.round(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
};

const animateMilestone = (card, point) => {
  if (card && point) {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    point.style.transform = 'scale(1)';
  }
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('bg-gray-800')) {
        // Stat animation
        const statValue = entry.target.querySelector('.text-4xl span');
        const targetValue = parseInt(statValue.textContent);
        animateStat(statValue, targetValue);
      } else {
        // Milestone animation
        const card = entry.target.querySelector('.bg-gray-800');
        const point = entry.target.querySelector('.bg-red-500');
        animateMilestone(card, point);
      }
      observer.unobserve(entry.target);
    }
  });
};

// Map related state
const mapContainer = ref(null);
const map = ref(null);
const heatmap = ref(null);
const markers = ref([]);

const mapFilters = reactive({
  showFire: true,
  showCrime: true,
  timeRange: '24h',
  visualizationType: 'markers'
});

const mapStats = reactive({
  totalIncidents: 156,
  activeIncidents: 23
});

// Sample incident data
const incidents = [
  {
    type: 'fire',
    position: { lat: 13.3247, lng: 121.1863 }, // Naujan coordinates
    title: 'Fire Incident',
    severity: 'high',
    timestamp: new Date().getTime()
  },
  {
    type: 'crime',
    position: { lat: 13.3267, lng: 121.1883 },
    title: 'Reported Crime',
    severity: 'medium',
    timestamp: new Date().getTime() - 3600000
  },
  // Add more sample incidents as needed
];

// Initialize Google Maps
const initMap = () => {
  const mapOptions = {
    center: { lat: 13.3247, lng: 121.1863 }, // Naujan, Oriental Mindoro
    zoom: 14,
    styles: [
      // Dark theme map styles
      {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#263c3f" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b9a76" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#212a37" }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9ca5b3" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#746855" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#1f2835" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#f3d19c" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#515c6d" }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#17263c" }]
      }
    ]
  };

  // Initialize the map
  /* eslint-disable */
  map.value = new google.maps.Map(mapContainer.value, mapOptions);

  // Initialize heatmap layer
  if (window.google && google.maps && google.maps.visualization) {
    heatmap.value = new google.maps.visualization.HeatmapLayer({
      data: incidents.map(incident => ({
        location: new google.maps.LatLng(incident.position.lat, incident.position.lng),
        weight: incident.severity === 'high' ? 3 : incident.severity === 'medium' ? 2 : 1
      })),
      map: null // Initially hidden
    });
  } else {
    console.error('Google Maps visualization library not loaded');
  }
  /* eslint-enable */

  // Add markers
  updateVisualization();
};

// Update map visualization based on selected type
const updateVisualization = () => {
  // Clear existing markers
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];
  
  // Hide heatmap
  if (heatmap.value) {
    heatmap.value.setMap(null);
  }

  if (mapFilters.visualizationType === 'markers') {
    // Show markers
    incidents.forEach(incident => {
      if ((incident.type === 'fire' && mapFilters.showFire) || 
          (incident.type === 'crime' && mapFilters.showCrime)) {
        /* eslint-disable */
        const marker = new google.maps.Marker({
          position: incident.position,
          map: map.value,
          title: incident.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: incident.type === 'fire' ? '#ef4444' : '#eab308',
            fillOpacity: 0.7,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 8
          }
        });
        /* eslint-enable */
        markers.value.push(marker);
      }
    });
  } else if (mapFilters.visualizationType === 'heatmap' && heatmap.value) {
    // Show heatmap
    heatmap.value.setMap(map.value);
  } else if (mapFilters.visualizationType === 'choropleth') {
    // Implementation for choropleth visualization would go here
    // This would involve loading GeoJSON data and styling polygons based on incident density
    console.log('Choropleth visualization not implemented');
  }
};

// Map controls
const zoomIn = () => {
  const currentZoom = map.value?.getZoom() || 14;
  map.value?.setZoom(currentZoom + 1);
};

const zoomOut = () => {
  const currentZoom = map.value?.getZoom() || 14;
  map.value?.setZoom(currentZoom - 1);
};

// Watch for filter changes
watch(mapFilters, () => {
  updateVisualization();
}, { deep: true });

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Start the slider
  setInterval(nextSlide, 5000);

  // Set up Intersection Observer
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5
  });

  // Observe stat elements
  statElements.value.forEach(el => observer.observe(el));

  // Observe milestone elements
  milestoneElements.value.forEach(el => observer.observe(el));

  // Load Google Maps
  loadGoogleMapsScript();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const loadGoogleMapsScript = () => {
  const script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe50S-5Ul4XkfcQ5tcCR4Xb3zTEiDvPgs&libraries=places,visualization";
  script.async = true;
  script.onload = () => {
    initMap();
  };
  document.head.appendChild(script);
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -20px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(20px, 20px) scale(1.05); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.6s ease-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s ease-out forwards;
}

.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-800 { animation-delay: 0.8s; }

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 1s linear infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.feature-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
}

html {
  scroll-behavior: smooth;
}

/* Additional styles for map controls */
.map-control {
  @apply bg-gray-800/90 rounded-lg hover:bg-gray-700 transition-colors;
}

.map-control:focus {
  @apply outline-none ring-2 ring-red-500;
}
</style>