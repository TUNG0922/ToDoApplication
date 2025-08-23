// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Use relative imports instead of @ alias
import UserDashboard from '../components/DashboardView/UserDashboard.vue'
import About from '../components/views/About.vue'
import TodoDetail from '../components/views/TodoDetail.vue'
import Todos from '../components/views/Todos.vue'

const routes = [
  { path: '/', name: 'UserDashboard', component: UserDashboard },
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
