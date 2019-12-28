import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { GeoFirestore } from "geofirestore";

import userCache from "./user-cache";

import md5 from "md5";

firebase.initializeApp({
  apiKey: "AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg",
  authDomain: "pizzagram-cc.firebaseapp.com",
  databaseURL: "https://pizzagram-cc.firebaseio.com",
  projectId: "pizzagram-cc",
  storageBucket: "pizzagram-cc.appspot.com",
  messagingSenderId: "393669371775"
});

export const auth = firebase.auth();

export const firestore = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

const geofirestore = new GeoFirestore(firestore);
const locations = geofirestore.collection("locations");

let isSigningUp = false;

let onAuthStateChangedCallback: (user: firebase.User | null) => void;

export const QUERY_LIMIT = 9;

auth.onAuthStateChanged(async user => {
  !isSigningUp && onAuthStateChangedCallback(user);
});

export const initializeAuth = () =>
  new Promise<firebase.User | null>(resolve => {
    auth.onAuthStateChanged(user => {
      resolve(user);
    });
  });

export const setOnAuthStateChangedCallback = (
  callback: (user: firebase.User | null) => void
) => {
  onAuthStateChangedCallback = callback;
};

export const subscribeToPosts = (callback: (posts: any[]) => void) =>
  firestore
    .collection("posts")
    .orderBy("createdAt", "desc")
    .where("published", "==", true)
    .limit(QUERY_LIMIT)
    .onSnapshot(querySnapshot => {
      const posts: any[] = [];
      querySnapshot.forEach(doc => posts.push(createPostObject(doc)));
      callback(posts);
    });

export const getPosts = async ({
  userId,
  startAfter
}: { userId?: string; startAfter?: any } = {}) => {
  let query = firestore
    .collection("posts")
    .orderBy("createdAt", "desc")
    .where("published", "==", true);

  if (userId) {
    query = query.where("userId", "==", userId);
  } else {
    query = query.limit(QUERY_LIMIT);
  }

  if (startAfter) {
    query = query.startAfter(startAfter);
  }

  const querySnapshot = await query.get();

  const posts: any[] = [];

  querySnapshot.docs.forEach(doc => posts.push(createPostObject(doc)));

  return posts;
};

export const getPost = async (id: string) => {
  try {
    const docRef = await firestore
      .collection("posts")
      .doc(id)
      .get();

    return createPostObject(docRef);
  } catch (error) {
    console.error(error);
  }
};

const createPostObject = (doc: firebase.firestore.DocumentSnapshot) => {
  const data = doc.data();

  return data
    ? {
        ...data,
        createdAt: data.createdAt.toDate(),
        doc,
        id: doc.id
      }
    : data;
};

export const getUser = async (id: string) => {
  if (!Object.values(userCache.getAll()).find(user => user.id === id)) {
    try {
      const querySnapshot = await firestore
        .collection("users")
        .where("id", "==", id)
        .limit(1)
        .get();

      const doc = querySnapshot.docs[0];
      const user = createUserObject(doc);

      if (user) {
        userCache.set(user.username, user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return Object.values(userCache.getAll()).find(user => user.id === id);
};

export const getUserByUsername = async (username: string) => {
  if (!userCache.getAll()[username]) {
    const docRef = await firestore
      .collection("users")
      .doc(username)
      .get();

    const user = createUserObject(docRef);

    if (user) {
      userCache.set(user.username, user);
    }
  }

  return userCache.getAll()[username];
};

const createUserObject = (doc: firebase.firestore.DocumentSnapshot) => {
  const data = doc.data();

  return data
    ? { ...data, createdAt: data.createdAt.toDate(), username: doc.id }
    : data;
};

export const sharePost = async ({
  caption,
  file,
  rating,
  latitude,
  longitude,
  location
}: {
  caption: string;
  file: File;
  rating: number;
  latitude: number;
  longitude: number;
  location: string;
}) => {
  const user = currentUser();

  if (!user) {
    return;
  }

  const docRef = await firestore.collection("posts").add({
    caption,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    imageUrl: null,
    published: false,
    rating,
    latitude,
    longitude,
    location,
    userId: user.uid
  });
  const uploadTask = await uploadFile(file, docRef.id);
  const downloadUrl = await uploadTask.ref.getDownloadURL();

  await docRef.update({
    imageUrl: downloadUrl,
    published: true
  });

  return docRef.id;
};

const uploadFile = async (file: File, id: string) => {
  const uploadTask = storageRef
    .child("posts")
    .child(`${id}.jpg`)
    .put(file);

  return uploadTask;
};

export const removePost = async (id: string) => {
  await firestore
    .collection("posts")
    .doc(id)
    .delete();
};

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  isSigningUp = true;

  const userDoc = firestore.collection("users").doc(username);

  await userDoc.set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    id: null
  });

  await auth.createUserWithEmailAndPassword(email, password);

  const gravatar = md5(email.toLowerCase());

  const user = currentUser();

  if (!user) {
    return;
  }

  await userDoc.update({ gravatar, id: user.uid });

  onAuthStateChangedCallback(user);

  isSigningUp = false;
};

export const signIn = async (email: string, password: string) => {
  await auth.signInWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  await auth.signOut();
};

export const getLikes = async (postId: string) => {
  try {
    const querySnapshot = await firestore
      .collection("likes")
      .where("postId", "==", postId)
      .get();

    const likes = [];

    for (const doc of querySnapshot.docs) {
      likes.push(doc.data().userId);
    }

    return likes;
  } catch (error) {
    console.error(error);
  }
};

export const toggleLike = async (postId: string) => {
  const user = currentUser();

  if (!user) {
    return;
  }

  const doc = firestore.collection("likes").doc(`${user.uid}_${postId}`);
  const snapshot = await doc.get();

  if (snapshot.exists) {
    await doc.delete();
  } else {
    await doc.set({ postId, userId: user.uid });
  }
};

export const currentUser = () => auth.currentUser;

export const fetchTopPosters = async () => {
  try {
    const querySnapshot = await firestore
      .collection("users")
      .orderBy("posts", "desc")
      .limit(10)
      .get();

    const users = [];

    for (const doc of querySnapshot.docs) {
      users.push(createUserObject(doc));
    }

    return users;
  } catch (error) {
    console.error(error);
  }
};

export const getNearbyLocations = async (
  latitude: number,
  longitude: number
) => {
  try {
    const query = locations.near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: 0.4
    });

    const querySnapshot = await query.get();

    const locationsArray = [];

    for (const doc of querySnapshot.docs) {
      locationsArray.push({
        id: doc.id,
        name: doc.data().name
      });
    }

    return locationsArray;
  } catch (error) {
    console.error(error);
  }
};

export const addLocation = async ({
  name,
  latitude,
  longitude
}: {
  name: string;
  latitude: number;
  longitude: number;
}) => {
  await locations.add({
    coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
    name: name.trim()
  });
};
