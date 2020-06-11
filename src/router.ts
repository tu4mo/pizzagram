import Vue from 'vue'
import Router, { NavigationGuard } from 'vue-router'

const Home = () => import('./views/Home.vue')
const Post = () => import('./views/Post.vue')
const Profile = () => import('./views/Profile.vue')
const ResetPassword = () => import('./views/ResetPassword.vue')
const LogIn = () => import('./views/LogIn.vue')
const Notifications = () => import('./views/Notifications.vue')
const SignUp = () => import('./views/SignUp.vue')
const Top = () => import('./views/Top.vue')
const Upload = () => import('./views/Upload.vue')

import { currentUser, initializeAuth } from './api/user'

Vue.use(Router)

let firstCheck = true

const checkAutentication: NavigationGuard = async (to, from, next) => {
  if (firstCheck) {
    firstCheck = false

    const user = await initializeAuth()

    if (user) {
      next()
    } else {
      next({ name: 'login' })
    }

    return
  }

  if (currentUser()) {
    next()
  } else {
    next({ name: 'login' })
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: checkAutentication,
    },
    {
      path: '/profile/:username?',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications,
      beforeEnter: checkAutentication,
    },
    {
      path: '/post/:postId',
      name: 'post',
      component: Post,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/top',
      name: 'top',
      component: Top,
    },
    {
      path: '/upload/:id?',
      name: 'upload',
      component: Upload,
      beforeEnter: checkAutentication,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})
