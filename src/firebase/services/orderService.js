import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ordersCollection = collection(db, "orders");

/* CREATE ORDER */

export const createOrder = async (orderData) => {

  const docRef = await addDoc(ordersCollection, {
    ...orderData,
    userId: orderData.userId,
    status: "Processing",
    createdAt: new Date()
  });

  return docRef.id;

};


/* GET ALL ORDERS */

export const getOrders = async () => {

  const q = query(ordersCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

};