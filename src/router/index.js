// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Use relative imports
import UserDashboard from '../components/DashboardView/UserDashboard.vue'
import SignIn from '../components/UserValidation/SignIn.vue'
import SignUp from '../components/UserValidation/SignUp.vue'
import Calendar from '../components/views/Calendar.vue'

const routes = [
  { path: '/', name: 'SignUp', component: SignUp },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/userdashboard', name: 'UserDashboard', component: UserDashboard},
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
