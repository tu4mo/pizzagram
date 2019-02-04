import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { GeoFirestore } from "geofirestore";

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

    this.auth = firebase.auth();

    this.firestore = firebase.firestore();
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref();

    const geofirestore = new GeoFirestore(this.firestore);
    this.locations = geofirestore.collection("locations");

    this.isSigningUp = false;

    this.onAuthStateChangedCallback = null;

    this.QUERY_LIMIT = 9;

    this.auth.onAuthStateChanged(async user => {
      if (!this.isSigningUp) {
        this.onAuthStateChangedCallback(user);
      }
    });
  }

  initializeAuth() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(user => {
        resolve(user);
      });
    });
  }

  setOnAuthStateChangedCallback(callback) {
    this.onAuthStateChangedCallback = callback;
  }

  async getPosts({ userId, startAfter } = {}) {
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

    const posts = [];

    querySnapshot.docs.forEach(doc => posts.push(this.createPostObject(doc)));

    return posts;
  }

  async getPost(id) {
    try {
      const docRef = await this.firestore
        .collection("posts")
        .doc(id)
        .get();

      return this.createPostObject(docRef);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  createPostObject(doc) {
    const data = doc.data();

    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      doc,
      id: doc.id
    };
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

  createUserObject(doc) {
    const data = doc.data();

    return { ...data, createdAt: data.createdAt.toDate(), username: doc.id };
  }

  async sharePost({ caption, file, rating, latitude, longitude, location }) {
    const docRef = await this.firestore.collection("posts").add({
      caption,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      imageUrl: null,
      published: false,
      rating,
      latitude,
      longitude,
      location,
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

    await this.auth.createUserWithEmailAndPassword(email, password);

    const gravatar = md5(email.toLowerCase());

    await userDoc.update({
      gravatar,
      id: this.currentUser().uid
    });

    this.onAuthStateChangedCallback(this.currentUser());

    this.isSigningUp = false;
  }

  async signIn(email, password) {
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    await this.auth.signOut();
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
    return this.auth.currentUser;
  }

  async fetchTopPosters() {
    try {
      const querySnapshot = await this.firestore
        .collection("users")
        .orderBy("posts", "desc")
        .limit(10)
        .get();

      const users = [];

      for (const doc of querySnapshot.docs) {
        users.push(this.createUserObject(doc));
      }

      return users;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async getNearbyLocations(latitude, longitude) {
    const query = this.locations.near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: 0.5
    });

    const querySnapshot = await query.get();

    const locations = [];

    for (const doc of querySnapshot.docs) {
      locations.push({
        id: doc.id,
        name: doc.data().name
      });
    }

    return locations;
  }

  async addLocation({ name, latitude, longitude }) {
    await this.locations.add({
      coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
      name
    });
  }
}

export default new Firebase();
