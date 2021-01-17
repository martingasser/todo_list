import { createRouter, createWebHistory } from 'vue-router'

import TodoList from '@/views/TodoList.vue'
import api from '@/api'

const routes = [
  {
    path: '/',
    name: 'TodoList',
    component: TodoList,
    beforeEnter (to, from, next) {        
      api.isAuthenticated()
        .then(() => {
            next()
        })
        .catch(() => {
            next('/login')
        })
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router