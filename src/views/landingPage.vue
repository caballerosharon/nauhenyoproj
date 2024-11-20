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
            <button @click="showLoginModal = true" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  
    <!-- Login Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg max-w-md w-full animate-fade-in-up">
        <h2 class="text-2xl font-bold mb-6 text-center">Choose Login Type</h2>
        <div class="grid grid-cols-1 gap-4">
          <button @click="selectLoginType('admin')" class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
            <ShieldIcon class="w-6 h-6 mr-2" />
            Log in as Admin
          </button>
          <button @click="selectLoginType('user')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
            <UserIcon class="w-6 h-6 mr-2" />
            Log in as User
          </button>
          <button @click="selectLoginType('responder')" class="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
            <AlertCircleIcon class="w-6 h-6 mr-2" />
            Log in as Responder
          </button>
        </div>
        <button @click="showLoginModal = false" class="mt-6 text-gray-400 hover:text-white transition duration-300 ease-in-out block mx-auto">
          Cancel
        </button>
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
        <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out animate-fade-in-up animation-delay-400 shadow-lg">
          Report Incident
        </button>
      </div>
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon class="w-8 h-8 text-white" />
      </div>
    </section>
  
    <!-- About Us Section -->
    <section id="about" class="py-20 bg-gray-900 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <span class="text-red-500 text-sm font-medium mb-2 block">About Us</span>
          <h2 class="text-4xl font-bold mb-4">Empowering Communities Through Fire and Crime Reporting</h2>
          <p class="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            NauHenyo is designed to revolutionize how communities report and track both crime and fire incidents. reating a safer environment for everyone through efficient reporting and response systems.
          </p>
        </div>
      </div>
  
      <!-- Image Slider with Hoverable Cards -->
      <div class="relative max-w-5xl mx-auto overflow-hidden" style="height: 500px;">
        <div class="absolute inset-0 transition-transform duration-500 ease-in-out"
             :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="(slide, index) in slides" :key="index" 
               class="absolute top-0 left-0 w-full h-full bg-cover bg-center flex items-center justify-center"
               :style="{ backgroundImage: `url(${slide.image})`, left: `${index * 100}%` }">
            <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            <div class="relative z-10 text-center px-4">
              <h3 class="text-3xl font-bold mb-4">{{ slide.title }}</h3>
              <p class="text-xl max-w-2xl mx-auto">{{ slide.description }}</p>
            </div>
          </div>
        </div>
  
        <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-8 space-x-4">
          <div v-for="(card, index) in slides" :key="index" 
               @mouseenter="hoverCard(index)"
               class="w-48 h-32 bg-cover bg-center rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
               :style="{ backgroundImage: `url(${card.image})` }">
            <div class="w-full h-full bg-black bg-opacity-50 flex items-end p-4 transition-opacity duration-300"
                 :class="{ 'opacity-0': hoveredCard === index }">
              <h3 class="text-white text-sm font-semibold">{{ card.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Features Section -->
    <section id="features" class="relative py-20 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div class="container mx-auto px-4 relative z-10">
        <div class="grid grid-cols-12 gap-8">
          <!-- Left Column -->
          <div class="col-span-12 lg:col-span-4">
            <span class="text-red-500 text-sm font-medium mb-2 block">Key Features</span>
            <h2 class="text-4xl font-bold mb-6">Incident Reporting System</h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-8">
              NauHenyo provides tools for reporting and managing both crime and fire incidents, ensuring quick response and efficient handling of emergency situations.
            </p>
          </div>
  
          <!-- Right Column - Features Cards -->
          <div class="col-span-12 lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="(feature, index) in features" :key="index" 
                   class="bg-gray-800 rounded-xl p-8 shadow-lg transform hover:scale-105 transition duration-300"
                   :class="{ 'md:translate-y-12': index === 1 || index === 3 }"
              >
                <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <component :is="feature.icon" class="w-8 h-8 text-red-500" />
                </div>
                <h3 class="text-2xl font-bold mb-4">{{ feature.title }}</h3>
                <p class="text-gray-400">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gray-900 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <span class="text-red-500 text-sm font-medium mb-2 block">CONTACT</span>
          <h2 class="text-4xl font-bold">Contact Us</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <!-- Contact Info Column -->
          <div class="lg:col-span-4 space-y-8">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPinIcon class="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Address</h3>
                <p class="text-gray-300">Naujan, Oriental Mindoro</p>
              </div>
            </div>
  
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <PhoneIcon class="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Call Us</h3>
                <p class="text-gray-300">0956 6600 630</p>
              </div>
            </div>
  
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MailIcon class="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Email Us</h3>
                <p class="text-gray-300">nauhenyobfp@gmail.com</p>
              </div>
            </div>
          </div>
  
          <!-- Contact Form Column -->
          <div class="lg:col-span-8">
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="animate-fade-in-up">
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Your Name"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  >
                </div>
                <div class="animate-fade-in-up animation-delay-200">
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Your Email"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  >
                </div>
              </div>
              
              <div class="animate-fade-in-up animation-delay-400">
                <input
                  v-model="form.subject"
                  type="text"
                  placeholder="Subject"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                >
              </div>
  
              <div class="animate-fade-in-up animation-delay-600">
                <textarea
                  v-model="form.message"
                  rows="6"
                  placeholder="Message"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
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
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
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
  UserIcon
} from 'lucide-vue-next';

const router = useRouter();
const heroSection = ref(null);
const heroImage = ref(null);
const showLoginModal = ref(false);
const scrollPercentage = ref(0);
const selectedLoginType = ref(null);
const currentSlide = ref(0);
const hoveredCard = ref(null);

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
    description: 'Our advanced platform enables real-time crime reporting with precise location tracking, ensuring faster response times and more effective crime prevention.'
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
    description: 'Our advanced GPS integration allows for accurate pinpointing of reported incidents, enabling emergency responders to navigate efficiently and improve overall emergency management.'
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
};

const selectLoginType = (type) => {
  selectedLoginType.value = type;
  console.log(`Selected login type: ${type}`);
  showLoginModal.value = false;

  // Handle routing based on login type
  switch (type) {
    case 'admin':
      router.push('/role');
      break;
    case 'user':
      router.push('/login');
      break;
    case 'responder':
      router.push('/firefighter');
      break;
    default:
      console.error('Invalid login type');
  }
};

const hoverCard = (index) => {
  hoveredCard.value = index;
  currentSlide.value = index;
};

const handleScroll = () => {
  const scrollPosition = window.pageYOffset;
  const windowHeight = window.innerHeight;
  scrollPercentage.value = Math.min(scrollPosition / windowHeight, 1);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
</style>

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
</style>