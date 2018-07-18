import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import md5 from "md5";

export default firebase.initializeApp({
  apiKey: "AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg",
  authDomain: "pizzagram-cc.firebaseapp.com",
  databaseURL: "https://pizzagram-cc.firebaseio.com",
  projectId: "pizzagram-cc",
  storageBucket: "pizzagram-cc.appspot.com",
  messagingSenderId: "393669371775"
});

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

const storage = firebase.storage();
const storageRef = storage.ref().child("user");

export const initializeAuth = () =>
  new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      resolve(user);
    });
  });

export const getPosts = async () => {
  const posts = [];
  const usersCache = {};

  const querySnapshot = await firestore
    .collection("posts")
    .orderBy("createdAt", "desc")
    .where("published", "==", true)
    .get();

  querySnapshot.forEach(async doc => {
    const docData = doc.data();

    if (!usersCache[docData.userId]) {
      const user = await getUser(docData.userId);
      usersCache[docData.userId] = user;
    }

    posts.push({
      id: doc.id,
      ...docData,
      createdAt: docData.createdAt.toDate(),
      user: usersCache[docData.userId]
    });
  });

  return posts;
};

export const getPost = async id => {
  const docRef = await firestore
    .collection("posts")
    .doc(id)
    .get();

  const data = docRef.data();

  return {
    imageUrl: data.imageUrl
  };
};

export const getUser = async id => {
  const docRef = await firestore
    .collection("users")
    .doc(id)
    .get();

  const data = docRef.data();

  return data;
};

export const createPost = async file => {
  const docRef = await firestore.collection("posts").add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    published: false,
    userId: firebase.auth().currentUser.uid
  });
  const uploadTask = await uploadFile(file, docRef.id);
  const downloadUrl = await uploadTask.ref.getDownloadURL();

  await docRef.update({
    imageUrl: downloadUrl
  });

  return docRef.id;
};

export const uploadFile = async (file, id) => {
  const uploadTask = storageRef
    .child(firebase.auth().currentUser.uid)
    .child("posts")
    .child(`${id}.jpg`)
    .put(file);

  return uploadTask;
};

export const sharePost = async (id, caption) => {
  const postRef = await firestore.collection("posts").doc(id);

  await postRef.update({
    caption,
    published: true
  });
};

export const signUp = async (username, email, password) => {
  const userDoc = firestore.collection("users").doc(username);

  await userDoc.set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid: null
  });

  await firebase.auth().createUserWithEmailAndPassword(email, password);

  const gravatar = md5(email.toLowerCase());

  await userDoc.update({
    gravatar,
    uid: firebase.auth().currentUser.uid
  });
};

export const signIn = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  await firebase.auth().signOut();
};
