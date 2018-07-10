import Vue from "vue";
import Vuex from "vuex";

import firebase from "./firebase";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAuthenticated: false
  },
  mutations: {
    setIsAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    }
  },
  actions: {}
});

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    store.commit("setIsAuthenticated", true);
  } else {
    store.commit("setIsAuthenticated", false);
  }
});

export default store;
