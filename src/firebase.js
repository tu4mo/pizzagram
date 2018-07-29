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

    this.usersCache = {};

    this.isSigningUp = false;

    this.onAuthStateChangedCallback = null;

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

  async getPosts(userId) {
    const posts = [];

    let query = this.firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .where("published", "==", true);

    if (userId) {
      query = query.where("userId", "==", userId);
    }

    const querySnapshot = await query.get();

    for (const doc of querySnapshot.docs) {
      posts.push(await this.createPostObject(doc));
    }

    return posts;
  }

  async getPost(id) {
    const docRef = await this.firestore
      .collection("posts")
      .doc(id)
      .get();

    return await this.createPostObject(docRef);
  }

  async createPostObject(doc) {
    try {
      const data = doc.data();
      const user = await this.getUser(data.userId);

      const querySnapshot = await this.firestore
        .collection("likes")
        .where("postId", "==", doc.id)
        .get();

      const likes = [];

      for (const doc of querySnapshot.docs) {
        likes.push(doc.data().userId);
      }

      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        id: doc.id,
        liked: likes.includes(this.currentUser().uid),
        likes,
        user
      };
    } catch (error) {
      //
    }
  }

  async getUser(id) {
    if (this.usersCache[id]) {
      return this.usersCache[id];
    }

    const querySnapshot = await this.firestore
      .collection("users")
      .where("id", "==", id)
      .limit(1)
      .get();

    const doc = querySnapshot.docs[0] || {};

    const user = { ...doc.data(), username: doc.id };

    this.usersCache[id] = user;

    return user;
  }

  async getUserByUsername(username) {
    const docRef = await this.firestore
      .collection("users")
      .doc(username)
      .get();

    return { ...docRef.data(), username: docRef.id };
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
