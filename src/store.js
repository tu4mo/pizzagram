import Vue from "vue";
import Vuex from "vuex";

import Firebase from "./firebase";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      isAuthenticated: false,
      username: "",
      userId: ""
    },
    isLoading: false,
    isLastPostReached: false,
    feeds: {},
    file: null,
    notifications: {},
    users: {},
    posts: {}
  },

  getters: {
    getUser: state => username => state.users[username] || {},

    getUserById: state => userId =>
      Object.values(state.users).find(user => user.id === userId) || {},

    getIsMe: state => userId => state.auth.userId === userId,

    getHasLiked: state => postId =>
      state.posts[postId].likes &&
      state.posts[postId].likes.includes(state.auth.userId),

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
    },

    getTopPosters: ({ users }) =>
      Object.keys(users)
        .sort((a, b) => users[a].posts + users[b].posts)
        .slice(0, 10),

    getNotifications: state => state.notifications || []
  },

  mutations: {
    setIsAuthenticated(state, { isAuthenticated, username, userId }) {
      state.auth.isAuthenticated = isAuthenticated;
      state.auth.username = username;
      state.auth.userId = userId;
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

    clearFeed(state, feed) {
      delete state.feeds[feed];
    },

    setFile(state, file) {
      state.file = file;
    },

    addToUsers(state, user) {
      state.users = { ...state.users, [user.username]: user };
    },

    addToPosts(state, post) {
      state.posts = { ...state.posts, [post.id]: { ...post, likes: null } };
    },

    removePost(state, postId) {
      Vue.delete(state.posts, postId);
      Object.keys(state.feeds).forEach(feed => {
        Vue.delete(state.feeds[feed], postId);
      });
    },

    addLikes(state, { postId, likes }) {
      state.posts = {
        ...state.posts,
        [postId]: {
          ...state.posts[postId],
          likes
        }
      };
    },

    toggleLike(state, postId) {
      const likes = state.posts[postId].likes || [];
      const { userId } = state.auth;

      if (likes.includes(userId)) {
        state.posts[postId].likes = likes.filter(userId => userId !== userId);
      } else {
        state.posts[postId].likes = [...likes, userId];
      }
    },

    setIsLastPostReached(state, isLastPostReached) {
      state.isLastPostReached = isLastPostReached;
    },

    addNotifications(state, notifications) {
      state.notifications = notifications;
    }
  },

  actions: {
    async getPostById({ commit, state }, { postId, force }) {
      if (state.posts[postId] && !force) {
        return;
      }

      const post = await Firebase.getPost(postId);
      commit("addToPosts", post);
    },

    async getPostsForHome({ commit, getters }) {
      commit("setIsLoading", true);

      const postsInHome = getters.getPostsByFeed("home");
      const lastPost =
        postsInHome.length > 0 ? postsInHome[postsInHome.length - 1].doc : null;

      const posts = await Firebase.getPosts({
        startAfter: lastPost
      });

      posts.forEach(post => {
        commit("addToPosts", post);
        commit("addToFeeds", { feed: "home", postId: post.id });
      });

      commit("setIsLoading", false);

      if (posts.length < Firebase.QUERY_LIMIT) {
        commit("setIsLastPostReached", true);
      }
    },

    async getPostsByUser({ commit, getters }, username) {
      const user = getters.getUser(username);
      if (Object.keys(user).length) {
        const posts = await Firebase.getPosts({ userId: user.id });
        posts.forEach(post => {
          commit("addToPosts", post);
          commit("addToFeeds", { feed: username, postId: post.id });
        });
      }
    },

    removePost({ commit }, postId) {
      Firebase.removePost(postId);
      commit("removePost", postId);
    },

    async getUser({ commit, state }, username) {
      if (state.users[username]) {
        return;
      }

      const user = await Firebase.getUserByUsername(username);
      commit("addToUsers", user);
    },

    async getUserById({ commit, state }, userId) {
      if (Object.values(state.users).some(user => user.id === userId)) {
        return;
      }

      const user = await Firebase.getUser(userId);
      commit("addToUsers", user);
    },

    async toggleLike({ commit, dispatch }, postId) {
      commit("toggleLike", postId);
      await Firebase.toggleLike(postId);
      dispatch("getLikes", { postId, force: true });
    },

    async getLikes({ commit, state }, { postId, force = false }) {
      if (state.posts[postId].likes && !force) {
        return;
      }

      const likes = await Firebase.getLikes(postId);
      commit("addLikes", { postId, likes });
    },

    async getTopPosters({ commit }) {
      const topPosters = await Firebase.fetchTopPosters();
      topPosters.forEach(user => commit("addToUsers", user));
    },

    async fetchNotifications({ commit }) {
      const notifications = await Firebase.fetchNotifications();
      commit("addNotifications", notifications);
    }
  }
});

Firebase.setOnAuthStateChangedCallback(async user => {
  if (user) {
    const userData = await Firebase.getUser(user.uid);
    store.commit("setIsAuthenticated", {
      isAuthenticated: true,
      username: userData.username,
      userId: user.uid
    });
    store.commit("addToUsers", userData);
  } else {
    store.commit("setIsAuthenticated", {
      isAuthenticated: false,
      username: ""
    });
  }
});

Firebase.subscribe(posts => {
  posts.forEach(post => {
    store.commit("addToPosts", post);
    store.commit("addToFeeds", { feed: "home", postId: post.id });
  });
});

export default store;
