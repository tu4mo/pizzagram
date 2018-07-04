import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyD2v4grRUlM0uh1OkP55fDvbuy0BcQNycg",
  authDomain: "pizzagram-cc.firebaseapp.com",
  databaseURL: "https://pizzagram-cc.firebaseio.com",
  projectId: "pizzagram-cc",
  storageBucket: "pizzagram-cc.appspot.com",
  messagingSenderId: "393669371775"
});

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

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
