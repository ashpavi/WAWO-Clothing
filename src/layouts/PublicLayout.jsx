import { Outlet } from "react-router-dom";
import Navbar from "../components/store/Navbar";
import Footer from "../components/store/Footer";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
