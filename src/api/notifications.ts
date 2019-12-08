import { currentUser, firestore, getUser } from ".";

export const subscribeToNotifications = (
  callback: (notifications: any[]) => void
) => {
  const user = currentUser();

  if (!user) {
    return;
  }

  return firestore
    .collection("notifications")
    .orderBy("createdAt", "desc")
    .where("userId", "==", user.uid)
    .where("read", "==", false)
    .onSnapshot(async querySnapshot => {
      const notifications = [];
      for await (const doc of querySnapshot.docs) {
        const data = doc.data();
        const from = await getUser(data.fromUserId);
        notifications.push({
          ...data,
          createdAt: data.createdAt.toDate(),
          from
        });
      }
      callback(notifications);
    });
};

export const markNotificationsAsRead = async () => {
  const user = currentUser();

  if (!user) {
    return;
  }

  const notifications = await firestore
    .collection("notifications")
    .where("userId", "==", user.uid)
    .where("read", "==", false)
    .get();

  const batch = firestore.batch();

  notifications.docs.forEach(async doc => {
    const notification = firestore.collection("notifications").doc(doc.id);
    batch.update(notification, { read: true });
  });

  await batch.commit();
};
