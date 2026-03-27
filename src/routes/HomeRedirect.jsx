import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import HomePage from "../pages/public/Homepage";

export default function HomeRedirect() {

  const navigate = useNavigate();

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const checkRole = async () => {

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const role = userSnap.data().role;

      if (role === "admin") {
        navigate("/admin/adminDashboard");
      }

      if (role === "superAdmin") {
        navigate("/superAdmin/superAdminDashboard");
      }

    };

    checkRole();

  }, []);

  return <HomePage />;
}