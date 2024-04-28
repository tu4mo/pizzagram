import type { NavigationGuard } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('./views/Home.vue')
const Post = () => import('./views/Post.vue')
const Profile = () => import('./views/Profile.vue')
const ResetPassword = () => import('./views/ResetPassword.vue')
const LogIn = () => import('./views/LogIn.vue')
const Notifications = () => import('./views/Notifications.vue')
const SignUp = () => import('./views/SignUp.vue')
const Upload = () => import('./views/Upload.vue')

import { getCurrentUser } from './api/auth'

const checkAutentication: NavigationGuard = async (to, from, next) => {
  if (await getCurrentUser()) {
    next()
  } else {
    next({ name: 'login' })
  }
}

const disallowLoggedUser: NavigationGuard = async (to, from, next) => {
  if (await getCurrentUser()) {
    next({ name: 'home' })
  } else {
    next()
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
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
      beforeEnter: disallowLoggedUser,
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
      beforeEnter: disallowLoggedUser,
    },
    {
      path: '/upload/:id?',
      name: 'upload',
      component: Upload,
      beforeEnter: checkAutentication,
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})
