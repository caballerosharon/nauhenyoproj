import { createRouter, createWebHistory } from 'vue-router';
import UserDashboard from '../views/UserDashboard.vue';
import MakeReport from '../views/makeReport.vue'; // Import makeReport.vue
import UserMap from '../views/UserMap.vue';
import UserReportHistory from '../views/UserReportHistory.vue';
import userSignup from '../views/userSignup.vue';
import LoginUser from '../views/LoginUser.vue';



const routes = [
  { path: '/signup', name: 'userSignup', component: userSignup },
  { path: '/login', name: 'LoginUser', component: LoginUser },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard },
  { path: '/report', name: 'MakeReport', component: MakeReport },
  { path: '/usermap', name: 'UserMap', component: UserMap }, 
  { path: '/history', name: 'UserReportHistory', component: UserReportHistory }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
