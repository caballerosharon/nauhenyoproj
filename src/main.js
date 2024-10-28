import { createApp } from 'vue'
import App from './App.vue'
import router from './router';


const app = createApp(App);
app.use(router); // Use the router in the app
app.mount('#app');
console.log("Vue app is mounting...");
