import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function useOrders(userId = null) {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let q;

    if (userId) {
      //  CUSTOMER
      q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      //  ADMIN
      q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(orderList);
      setLoading(false);

    },
  (error) => {
    console.error("Firestore error:", error);
    setLoading(false); 
  });

    return unsubscribe;

  }, [userId]);

  const updateOrderStatus = async (orderId, status) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  };

  return {
    orders,
    loading,
    updateOrderStatus
  };
}