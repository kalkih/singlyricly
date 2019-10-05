import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Login from '@/components/Login'
import Main from '@/views/Main'
import Welcome from '@/views/Welcome'

Vue.use(Router)

const isAuthenticated = (to, from, next, route) => {
  const isAuth = store.getters['auth/isAuthenticated']
  if (!isAuth) {
    next('/welcome')
  } else {
    route ? next(route) : next()
  }
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      beforeEnter: isAuthenticated,
    },
    {
      path: '/sync',
      name: 'sync',
      component: () => import('../views/Sync.vue'),
      beforeEnter: isAuthenticated,
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/Add.vue'),
      beforeEnter: isAuthenticated,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/about',
      name: 'about',
      beforeEnter: (to, from, next) => {
        store.dispatch('toggleAbout', true)
        isAuthenticated(to, from, next, '/')
      },
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome,
      // beforeEnter: (to, from, next) => {
      //   const isAuth = store.getters['auth/isAuthenticated']
      //   if (isAuth) {
      //     next('/')
      //   } else {
      //     next()
      //   }
      // },
    },
    { path: '*', redirect: '/' },
  ],
})

export default router
