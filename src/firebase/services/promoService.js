import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const promoRef = doc(db, "homepage", "promo");

//  SUBSCRIBE
export const subscribePromoConfig = (onData, onError) => {
  return onSnapshot(
    promoRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data());
      } else {
        onData(null);
      }
    },
    (error) => {
      console.error("Promo fetch error:", error);
      if (onError) onError(error);
    }
  );
};

//  SAVE 
export const savePromoConfig = async (data) => {
  await setDoc(promoRef, data, { merge: true });
};