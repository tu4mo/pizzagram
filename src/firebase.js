import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import md5 from "md5";

class Firebase {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg",
      authDomain: "pizzagram-cc.firebaseapp.com",
      databaseURL: "https://pizzagram-cc.firebaseio.com",
      projectId: "pizzagram-cc",
      storageBucket: "pizzagram-cc.appspot.com",
      messagingSenderId: "393669371775"
    });

    this.firestore = firebase.firestore();
    this.firestore.settings({ timestampsInSnapshots: true });

    this.storage = firebase.storage();
    this.storageRef = this.storage.ref();

    this.isSigningUp = false;

    this.onAuthStateChangedCallback = null;

    this.QUERY_LIMIT = 9;

    firebase.auth().onAuthStateChanged(async user => {
      if (!this.isSigningUp) {
        this.onAuthStateChangedCallback(user);
      }
    });
  }

  initializeAuth() {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => {
        resolve(user);
      });
    });
  }

  setOnAuthStateChangedCallback(callback) {
    this.onAuthStateChangedCallback = callback;
  }

  async getPosts({ userId, startAfter } = {}) {
    const posts = [];

    let query = this.firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .where("published", "==", true);

    if (userId) {
      query = query.where("userId", "==", userId);
    } else {
      query = query.limit(this.QUERY_LIMIT);
    }

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const querySnapshot = await query.get();

    querySnapshot.docs.forEach(async doc =>
      posts.push(this.createPostObject(doc))
    );

    return Promise.all(posts);
  }

  async getPost(id) {
    try {
      const docRef = await this.firestore
        .collection("posts")
        .doc(id)
        .get();

      return await this.createPostObject(docRef);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async createPostObject(doc) {
    try {
      const data = doc.data();

      return {
        doc,
        ...data,
        createdAt: data.createdAt.toDate(),
        id: doc.id
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async getUser(id) {
    const querySnapshot = await this.firestore
      .collection("users")
      .where("id", "==", id)
      .limit(1)
      .get();

    const doc = querySnapshot.docs[0] || {};
    const user = this.createUserObject(doc);

    return user;
  }

  async getUserByUsername(username) {
    const docRef = await this.firestore
      .collection("users")
      .doc(username)
      .get();

    return this.createUserObject(docRef);
  }

  async createUserObject(doc) {
    const data = doc.data();

    return { ...data, createdAt: data.createdAt.toDate(), username: doc.id };
  }

  async sharePost(file, caption) {
    const docRef = await this.firestore.collection("posts").add({
      caption,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      imageUrl: null,
      published: false,
      userId: this.currentUser().uid
    });
    const uploadTask = await this.uploadFile(file, docRef.id);
    const downloadUrl = await uploadTask.ref.getDownloadURL();

    await docRef.update({
      imageUrl: downloadUrl,
      published: true
    });

    return docRef.id;
  }

  async uploadFile(file, id) {
    const uploadTask = this.storageRef
      .child("posts")
      .child(`${id}.jpg`)
      .put(file);

    return uploadTask;
  }

  async removePost(id) {
    await this.firestore
      .collection("posts")
      .doc(id)
      .delete();
  }

  async signUp(username, email, password) {
    this.isSigningUp = true;

    const userDoc = this.firestore.collection("users").doc(username);

    await userDoc.set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: null
    });

    await firebase.auth().createUserWithEmailAndPassword(email, password);

    const gravatar = md5(email.toLowerCase());

    await userDoc.update({
      gravatar,
      id: this.currentUser().uid
    });

    this.onAuthStateChangedCallback(this.currentUser());

    this.isSigningUp = false;
  }

  async signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    await firebase.auth().signOut();
  }

  async getLikes(postId) {
    try {
      const querySnapshot = await this.firestore
        .collection("likes")
        .where("postId", "==", postId)
        .get();

      const likes = [];

      for (const doc of querySnapshot.docs) {
        likes.push(doc.data().userId);
      }

      return likes;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async toggleLike(postId) {
    const userId = this.currentUser().uid;

    const doc = await this.firestore
      .collection("likes")
      .doc(`${userId}_${postId}`);

    const snapshot = await doc.get();

    if (snapshot.exists) {
      await doc.delete();
    } else {
      await doc.set({ postId, userId });
    }
  }

  currentUser() {
    return firebase.auth().currentUser;
  }
}

export default new Firebase();
