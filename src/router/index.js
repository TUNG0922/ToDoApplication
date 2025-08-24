// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Use relative imports
import UserDashboard from '../components/DashboardView/UserDashboard.vue'
import SignIn from '../components/UserValidation/SignIn.vue'
import SignUp from '../components/UserValidation/SignUp.vue'
import About from '../components/views/About.vue'
import TodoDetail from '../components/views/TodoDetail.vue'
import Todos from '../components/views/Todos.vue'

const routes = [
  { path: '/', name: 'SignUp', component: SignUp },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/userdashboard/:userEmail/:userName', name: 'UserDashboard', component: UserDashboard, props: true},
  { path: '/todos', name: 'Todos', component: Todos },
  { path: '/todos/:id', name: 'TodoDetail', component: TodoDetail, props: true },
  { path: '/about', name: 'About', component: About },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
