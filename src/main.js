import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';


const app = createApp(App);
app.use(router); // Use the router in the app
app.mount('#app');
console.log("Vue app is mounting...");
