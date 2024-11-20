import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import './assets/tailwind.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

let appMounted = false

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user.uid)
  } else {
    console.log('No user is signed in.')
  }
  
  if (!appMounted) {
    app.mount('#app')
    appMounted = true
  }
})

console.log("Vue app is initializing...")