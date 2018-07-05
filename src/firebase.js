import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

firebase.initializeApp({
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
const storageRef = storage.ref();
const postsStorageRef = storageRef.child("posts");

export const getPosts = async () => {
  const posts = [];

  const querySnapshot = await firestore
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get();

  querySnapshot.forEach(async doc => {
    const userDoc = await doc.data().userRef.get();
    posts.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      user: userDoc.data()
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

export const createPost = async file => {
  const docRef = await firestore.collection("posts").add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    published: false
  });
  const uploadTask = await uploadFile(file, docRef.id);
  const downloadUrl = await uploadTask.ref.getDownloadURL();
  await docRef.update({
    imageUrl: downloadUrl,
    // userRef: firestore.doc('users/' + firebase.auth().currentUser.uid)
    userRef: firestore.doc("users/o8mb5tlcanZQ9w60DWqF")
  });
  return docRef.id;
};

export const uploadFile = async (file, id) => {
  const uploadTask = postsStorageRef.child(`${id}.jpg`).put(file);
  return uploadTask;
};
