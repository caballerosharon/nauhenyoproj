import { createRouter, createWebHistory } from 'vue-router';
import UserDashboard from '../views/UserDashboard.vue';
import MakeReport from '../views/makeReport.vue';
import MakeFireReport from '../views/makeFireReport.vue';  
import UserMap from '../views/UserMap.vue';
import UserReportHistory from '../views/UserReportHistory.vue';
import userSignup from '../views/userSignup.vue';
import LoginUser from '../views/LoginUser.vue';
import userProfile from '../views/userProfile.vue';
import npsDashboard from '../views/npsDashboard.vue';
import npsReports from '../views/npsReports.vue';
import npsHistory from '../views/npsHistory.vue';
import bfpDashboard from '../views/bfpDashboard.vue';
import bfpReports from '../views/bfpReports.vue';
import bfpFireman from '../views/bfpFireman.vue';
import bfpHistory from '../views/bfpHistory.vue';
import NPSLogin from '../views/NPSLogin.vue';
import BFPLogin from '../views/BFPLogin.vue';
import AdminRoleSelector from '../views/AdminRoleSelector.vue';
import tryLang from '../views/tryLang.vue';
import trialMuna from '../views/trialMuna.vue';
import firemanSignup from '../views/firemanSignup.vue';
import firemanLogin from '../views/firemanLogin.vue';
import firemanProfile from '../views/firemanProfile.vue';
import firemanDashboard from '../views/firemanDashboard.vue';
import bfpMap from '../views/bfpMap.vue';
import npsPolice from '../views/npsPolice.vue';
import npsMap from '../views/npsMap.vue';
import landingPage from '../views/landingPage.vue';
import pantryLang from '../views/pantryLang.vue';
import trialList from '../views/trialList.vue';

const routes = [
  { path: '/signup', name: 'userSignup', component: userSignup },
  { path: '/login', name: 'LoginUser', component: LoginUser },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard },
  { path: '/reportcrime', name: 'MakeReport', component: MakeReport },
  { path: '/reportfire', name: 'MakeFireReport', component: MakeFireReport },
  { path: '/usermap', name: 'UserMap', component: UserMap }, 
  { path: '/history', name: 'UserReportHistory', component: UserReportHistory },
  { path: '/profile', name: 'userProfile', component: userProfile }, 
  { path: '/npsdashboard', name: 'npsDashboard', component: npsDashboard },
  { path: '/npsreports', name: 'npsReports', component: npsReports },
  { path: '/npshistory', name: 'npsHistory', component: npsHistory },
  { path: '/npsmap', name: 'npsMap', component: npsMap },
  { path: '/', name: 'landingPage', component: landingPage },
  { path: '/pantry', name: 'pantryLang', component: pantryLang },
  { path: '/npspolice', name: 'npsPolice', component: npsPolice },

  { path: '/bfplogin', name: 'BFPLogin', component: BFPLogin },
  { path: '/bfpfireman', name: 'bfpFireman', component: bfpFireman },
  { path: '/bfpmap', name: 'bfpMap', component: bfpMap },
  { path: '/bfpdashboard', name: 'bfpDashboard', component: bfpDashboard },
  { path: '/bfpreports', name: 'bfpReports', component: bfpReports },
  { path: '/bfphistory', name: 'bfpHistory', component: bfpHistory },
  { path: '/npslogin', name: 'NPSLogin', component: NPSLogin },
  { path: '/role', name: 'AdminRoleSelector', component: AdminRoleSelector },
  { path: '/try', name: 'tryLang', component: tryLang },
  { path: '/trial', name: 'trialMuna', component: trialMuna },
  { path: '/firemandashboard', name: 'firemanDashboard', component: firemanDashboard },
  { path: '/firemansignup', name: 'firemanSignup', component: firemanSignup },
  { path: '/firemanlogin', name: 'firemanLogin', component: firemanLogin },
  { path: '/firemanprofile', name: 'firemanProfile', component: firemanProfile },

  { path: '/trialist', name: 'trialList', component: trialList },
];


  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  


export default router;
