import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import Boards from '../views/Boards.vue'
import Board from '../views/Board.vue'

import store from '@/store'

Vue.use(VueRouter)

const isLoggedIn = (to, from, next) => {
  store.dispatch('auth/authenticate').then(() => {
    next()
  }).catch(() => {
    next('/login')
  })
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter (to, from, next) {
      store.dispatch('auth/authenticate').then(() => {
        next('/boards')
      }).catch(() => {
        next('/login')
      })
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/boards',
    name: 'Boards',
    component: Boards,
    beforeEnter: isLoggedIn
  },
  {
    path: '/boards/:id',
    name: 'Board',
    component: Board,
    beforeEnter: isLoggedIn
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
