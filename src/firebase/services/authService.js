import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// REGISTER 
export const registerUser = async ({ name, email, password, phone }) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    phone: phone || "",
    role: "customer", 
    isBlocked: false,
    createdAt: new Date(),
  });

  return user;
};

// LOGIN
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    throw new Error("User record not found.");
  }

  const userData = userDoc.data();

  if (userData.isBlocked) {
    await signOut(auth);
    throw new Error("Your account has been blocked.");
  }

  return userData; 
};

// LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};