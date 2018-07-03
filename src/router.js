import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Profile from "./views/Profile.vue";
import LogIn from "./views/LogIn.vue";
import SignUp from "./views/SignUp.vue";
import Upload from "./views/Upload.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile
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
      path: "/upload",
      name: "upload",
      component: Upload
    }
  ]
});
