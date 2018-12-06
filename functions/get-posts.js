module.exports = db => async data => {
  const { userId, startAfter } = data;

  let query = db
    .collection("posts")
    .orderBy("createdAt", "desc")
    .where("published", "==", true);

  if (userId) {
    query = query.where("userId", "==", userId);
  } else {
    query = query.limit(9);
  }

  if (startAfter) {
    const lastPost = await db
      .collection("posts")
      .doc(startAfter)
      .get();

    query = query.startAfter(lastPost);
  }

  const querySnapshot = await query.get();

  const posts = [];

  querySnapshot.docs.forEach(doc => posts.push(createPostObject(doc)));

  return posts;
};

const createPostObject = doc => {
  const data = doc.data();

  return {
    ...data,
    createdAt: data.createdAt.toDate().toJSON(),
    id: doc.id
  };
};
