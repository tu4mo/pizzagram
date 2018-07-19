import Vue from "vue";
import Vuex from "vuex";

import firebase, { getMe, getPosts, getUserByUsername } from "./firebase";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      isAuthenticated: false,
      username: ""
    },
    users: {},
    posts: {}
  },
  getters: {
    getUser: state => username => state.users[username] || {},
    getPosts: state => username => state.posts[username] || []
  },
  mutations: {
    setIsAuthenticated(state, { isAuthenticated, username }) {
      state.auth.isAuthenticated = isAuthenticated;
      state.auth.username = username;
    },
    setUser(state, user) {
      state.user = user;
    },
    addToUsers(state, user) {
      state.users = {
        ...state.users,
        [user.username]: user
      };
    },
    addToPosts(state, { username, posts }) {
      const postsWithKey = posts.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.id]: curr
        };
      }, {});

      state.posts = {
        ...state.posts,
        [username]: { ...(state.posts[username] || {}), ...postsWithKey }
      };
    }
  },
  actions: {
    async getPostsByUser({ commit, getters }, username) {
      const user = getters.getUser(username);
      if (Object.keys(user).length) {
        const posts = await getPosts(user.id);
        commit("addToPosts", { username, posts });
      }
    },
    async getUser({ commit }, username) {
      const user = await getUserByUsername(username);
      commit("addToUsers", user);
    }
  }
});

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    const user = await getMe();
    store.commit("setIsAuthenticated", {
      isAuthenticated: true,
      username: user.username
    });
    store.commit("addToUsers", user);
  } else {
    store.commit("setIsAuthenticated", {
      isAuthenticated: false,
      username: ""
    });
  }
});

export default store;
