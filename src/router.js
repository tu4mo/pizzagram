import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Profile from "./views/Profile.vue";
import LogIn from "./views/LogIn.vue";
import SignUp from "./views/SignUp.vue";
import Upload from "./views/Upload.vue";

import { initializeAuth } from "./firebase";
import store from "./store";

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

  if (!store.state.auth.isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
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
      component: Profile,
      beforeEnter: checkAutentication
    },
    {
      path: "/login",
      name: "login",
      component: LogIn
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp
    },
    {
      path: "/upload/:id?",
      name: "upload",
      component: Upload,
      beforeEnter: checkAutentication
    }
  ]
});
