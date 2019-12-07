import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Post from "./views/Post.vue";
import Profile from "./views/Profile.vue";
import ResetPassword from "./views/ResetPassword.vue";
import LogIn from "./views/LogIn.vue";
import Notifications from "./views/Notifications.vue";
import SignUp from "./views/SignUp.vue";
import Top from "./views/Top.vue";
import Upload from "./views/Upload.vue";

import { currentUser, initializeAuth } from "./api";

Vue.use(Router);

let firstCheck = true;

const checkAutentication = async (to, from, next) => {
  if (firstCheck) {
    firstCheck = false;

    const user = await initializeAuth();

    if (user) {
      next();
    } else {
      next({ name: "login" });
    }

    return;
  }

  if (currentUser()) {
    next();
  } else {
    next({ name: "login" });
  }
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: checkAutentication
    },
    {
      path: "/profile/:username?",
      name: "profile",
      component: Profile
    },
    {
      path: "/login",
      name: "login",
      component: LogIn
    },
    {
      path: "/notifications",
      name: "notifications",
      component: Notifications,
      beforeEnter: checkAutentication
    },
    {
      path: "/post/:postId",
      name: "post",
      component: Post
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp
    },
    {
      path: "/top",
      name: "top",
      component: Top
    },
    {
      path: "/upload/:id?",
      name: "upload",
      component: Upload,
      beforeEnter: checkAutentication
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
