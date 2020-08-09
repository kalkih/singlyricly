import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Login from '@/components/Login'
import Main from '@/views/Main'
import Welcome from '@/views/Welcome'

const APP_NAME = process.env.VUE_APP_NAME

Vue.use(Router)

const isAuth = () => store.getters['auth/isAuthenticated']

const authGuard = (to, from, next, route) => {
  if (!isAuth()) {
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
      beforeEnter: authGuard,
    },
    {
      path: '/sync',
      name: 'sync',
      component: () => import('../views/Sync.vue'),
      beforeEnter: authGuard,
      meta: { title: 'Sync Lyrics' },
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/Add.vue'),
      beforeEnter: authGuard,
      meta: { title: 'Add Lyrics' },
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
        authGuard(to, from, next, '/')
      },
      meta: { title: 'About' },
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      beforeEnter: (to, from, next) => {
        store.dispatch('togglePrivacyPolicy', true)
        authGuard(to, from, next, '/')
      },
      meta: { title: 'Privacy Policy' },
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: Welcome,
      beforeEnter: (to, from, next) => {
        isAuth() ? next('/') : next()
      },
      meta: { title: 'Welcome' },
    },
    { path: '*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} - ${APP_NAME}`
    : APP_NAME
  next()
})

export default router
