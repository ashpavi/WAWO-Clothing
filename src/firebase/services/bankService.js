import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 🔹 GET BANK DETAILS
export const getBankDetails = async () => {
  const ref = doc(db, "bank", "details");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  } else {
    return null;
  }
};

// 🔹 UPDATE BANK DETAILS (ADMIN)
export const updateBankDetails = async (data) => {
  const ref = doc(db, "bank", "details");

  // ✅ creates if not exists, updates if exists
  await setDoc(ref, data, { merge: true });
};