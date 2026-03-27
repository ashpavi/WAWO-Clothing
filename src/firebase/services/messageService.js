import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebaseConfig";

const messageCollection = collection(db, "contactMessages");

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const mapMessage = (docSnap) => {
  const data = docSnap.data();
  const createdAt = toDate(data.createdAt);

  return {
    id: docSnap.id,
    fullName: data.fullName || "",
    email: data.email || "",
    topic: data.topic || "General",
    message: data.message || "",
    status: data.status || "new",
    createdAt,
  };
};

export const submitContactMessage = async ({ fullName, email, topic, message }) => {
  const payload = {
    fullName,
    email,
    topic,
    message,
    status: "new",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(messageCollection, payload);
  return docRef.id;
};

export const subscribeContactMessages = (onData, onError) => {
  const q = query(messageCollection, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map(mapMessage);
      onData(data);
    },
    onError
  );
};

export const markContactMessageRead = async (id) => {
  await updateDoc(doc(db, "contactMessages", id), {
    status: "read",
    readAt: serverTimestamp(),
  });
};
