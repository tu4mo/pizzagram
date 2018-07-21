import Vue from "vue";
import Vuex from "vuex";

import Firebase from "./firebase";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      isAuthenticated: false,
      username: ""
    },
    isLoading: false,
    feeds: {},
    users: {},
    posts: {}
  },
  getters: {
    getUser: state => username => state.users[username] || {},
    getPostById: state => id => {
      return state.posts[id] ? state.posts[id] : {};
    },
    getPostsByFeed: state => feed => {
      const postIds = Object.keys(state.feeds[feed] || {});
      return postIds.length > 0
        ? postIds
            .map(postId => state.posts[postId])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
    }
  },
  mutations: {
    setIsAuthenticated(state, { isAuthenticated, username }) {
      state.auth.isAuthenticated = isAuthenticated;
      state.auth.username = username;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setUser(state, user) {
      state.user = user;
    },
    addToFeeds(state, { feed, postId }) {
      state.feeds = {
        ...state.feeds,
        [feed]: { ...(state.feeds[feed] || {}), [postId]: true }
      };
    },
    addToUsers(state, user) {
      state.users = { ...state.users, [user.username]: user };
    },
    addToPosts(state, post) {
      state.posts = { ...state.posts, [post.id]: post };
    }
  },
  actions: {
    async getPostById({ commit, state }, postId) {
      if (state.posts[postId]) {
        return;
      }

      const post = await Firebase.getPost(postId);
      commit("addToPosts", post);
    },
    async getPostsForHome({ commit }, setIsLoading) {
      if (setIsLoading) {
        commit("setIsLoading", true);
      }

      const posts = await Firebase.getPosts();
      posts.forEach(post => {
        commit("addToPosts", post);
        commit("addToFeeds", { feed: "home", postId: post.id });
      });

      if (setIsLoading) {
        commit("setIsLoading", false);
      }
    },
    async getPostsByUser({ commit, getters }, username) {
      const user = getters.getUser(username);
      if (Object.keys(user).length) {
        const posts = await Firebase.getPosts(user.id);
        posts.forEach(post => {
          commit("addToPosts", post);
          commit("addToFeeds", { feed: username, postId: post.id });
        });
      }
    },
    async getUser({ commit, state }, username) {
      if (state.users[username]) {
        return;
      }

      const user = await Firebase.getUserByUsername(username);
      commit("addToUsers", user);
    }
  }
});

Firebase.setOnAuthStateChangedCallback(async user => {
  if (user) {
    const userData = await Firebase.getUser(user.uid);
    store.commit("setIsAuthenticated", {
      isAuthenticated: true,
      username: userData.username
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
