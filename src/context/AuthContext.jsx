import { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../firebase/services/authService";

import { CartContext } from "./CartContext"; // ✅ NEW

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { clearCart } = useContext(CartContext); // ✅ NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      // PREVENT REDIRECT WHEN CREATING ADMIN
      const isCreatingAdmin = localStorage.getItem("creatingAdmin");

      if (isCreatingAdmin) {
        localStorage.removeItem("creatingAdmin");
        setLoading(false);
        return;
      }

      if (user) {

        clearCart(); // ✅ CLEAR cart on login

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.isBlocked) {
            await signOut(auth);
            setCurrentUser(null);
            setLoading(false);
            return;
          }

          setCurrentUser({
            uid: user.uid,
            ...userData,
          });
        }

      } else {

        clearCart(); // ✅ CLEAR cart on logout
        setCurrentUser(null);

      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};