import { createRouter, createWebHistory } from 'vue-router';
import UserDashboard from '../views/UserDashboard.vue';
import MakeReport from '../views/makeReport.vue';
import MakeFireReport from '../views/makeFireReport.vue';  // Import makeReport.vue
import UserMap from '../views/UserMap.vue';
import UserReportHistory from '../views/UserReportHistory.vue';
import userSignup from '../views/userSignup.vue';
import LoginUser from '../views/LoginUser.vue';
import userProfile from '../views/userProfile.vue';



const routes = [
  { path: '/signup', name: 'userSignup', component: userSignup },
  { path: '/login', name: 'LoginUser', component: LoginUser },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard },
  { path: '/reportcrime', name: 'MakeReport', component: MakeReport },
  { path: '/reportfire', name: 'MakeFireReport', component: MakeFireReport },
  { path: '/usermap', name: 'UserMap', component: UserMap }, 
  { path: '/history', name: 'UserReportHistory', component: UserReportHistory },
  { path: '/profile', name: 'userProfile', component: userProfile }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
