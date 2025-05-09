import {
  type NavigationGuard,
  createRouter,
  createWebHistory,
} from 'vue-router'

const Account = () => import('./views/Account.vue')
const Home = () => import('./views/Home.vue')
const LogIn = () => import('./views/LogIn.vue')
const Notifications = () => import('./views/Notifications.vue')
const Post = () => import('./views/Post.vue')
const Profile = () => import('./views/Profile.vue')
const ResetPassword = () => import('./views/ResetPassword.vue')
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
      component: Home,
      name: 'home',
      path: '/',
    },
    {
      beforeEnter: checkAutentication,
      component: Account,
      name: 'account',
      path: '/account',
    },
    {
      children: [
        {
          component: Post,
          name: 'post',
          path: ':postId',
        },
      ],
      component: Profile,
      name: 'profile',
      path: '/profile/:username',
    },
    {
      beforeEnter: disallowLoggedUser,
      component: LogIn,
      name: 'login',
      path: '/login',
    },
    {
      beforeEnter: checkAutentication,
      component: Notifications,
      name: 'notifications',
      path: '/notifications',
    },
    {
      component: ResetPassword,
      name: 'reset-password',
      path: '/reset-password',
    },
    {
      beforeEnter: disallowLoggedUser,
      component: SignUp,
      name: 'signup',
      path: '/signup',
    },
    {
      beforeEnter: checkAutentication,
      component: Upload,
      name: 'upload',
      path: '/upload/:id?',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    const skipScrollToTop =
      (to.name === 'profile' && from.name === 'post') ||
      (to.name === 'post' && from.name === 'profile')

    if (savedPosition) {
      return savedPosition
    } else if (!skipScrollToTop) {
      return { left: 0, top: 0 }
    }
  },
})
