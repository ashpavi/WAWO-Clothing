import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout.jsx";
import AccountLayout from "../pages/public/account/AccountLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";



import ProtectedRoutes from "./ProtectedRoutes.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import SuperAdminRoutes from "./SuperAdminRoutes.jsx";

/* PUBLIC PAGES */
import HomeRedirect from "./HomeRedirect.jsx";
import ProductList from "../pages/public/ProductList.jsx";
import ProductDetails from "../pages/public/ProductDetails.jsx";
import NoResults from "../pages/public/NoResults.jsx";
import CartPage from "../pages/public/CartPage.jsx";
import Checkout from "../pages/public/Checkout.jsx";
import OrderSuccess from "../pages/public/OrderSuccess.jsx";
import Login from "../pages/public/Login.jsx";
import Register from "../pages/public/Register.jsx";
import AboutUs from "../pages/public/AboutUs.jsx";
import ContactUs from "../pages/public/ContactUs.jsx";
import SizeGuide from "../pages/public/SizeGuide.jsx";

/* ACCOUNT PAGES */
import Dashboard from "../pages/public/account/Dashboard.jsx";
import MyOrdersPage from "../pages/public/account/MyOrdersPage.jsx";
import ProfileSettings from "../pages/public/account/ProfileSettings.jsx";
import OrderDetailModal from "../components/store/account/OrderDetailModal.jsx";




/* ADMIN PAGES */
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProducts from "../pages/admin/AdminProducts.jsx";
import AddProducts from "../pages/admin/AddProducts.jsx";
import AdminCategory from "../pages/admin/AdminCategory.jsx";
import AddCategory from "../pages/admin/AddCategory.jsx";
import AdminOrder from "../pages/admin/AdminOrder.jsx";
import AdminUser from "../pages/admin/AdminUser.jsx";
import AdminMessages from "../pages/admin/AdminMessages.jsx";
import AdminHeroSettings from "../pages/admin/AdminHeroSettings.jsx";

/* SUPER ADMIN */
import SuperAdminLayout from "../layouts/SuperAdminLayout.jsx";
import Overview from "../pages/superAdmin/Overview.jsx";
import ManageAdmins from "../pages/superAdmin/ManageAdmins.jsx";
import AdminBankDetails from "../pages/admin/AdminBankDetails.jsx";
import AdminPromoSettings from "../pages/admin/AdminPromoSettings.jsx";


export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails/>} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/sizeGuide" element={<SizeGuide />} />
        <Route path="/no-results" element={<NoResults />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Protected Checkout */}
        <Route path="/checkout" element={<Checkout />} />
      

        <Route
          path="/orderSuccess"
          element={
            
              <OrderSuccess />
            
          }
        />

        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      {/* ================= ACCOUNT ROUTES ================= */}
      <Route
        element={
          <ProtectedRoutes>
            <AccountLayout />
          </ProtectedRoutes>
        }
      >
        <Route path="/account" element={<Dashboard />} />
        <Route path="/account/orders" element={<MyOrdersPage />} />
        <Route path="/account/profile" element={<ProfileSettings />} />
        <Route path="/account/order/:orderId" element={<OrderDetailModal />} />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        element={
          <AdminRoutes>
            <AdminLayout />
          </AdminRoutes>
        }
      >
        <Route path="/admin/adminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AddProducts />} />
        <Route path="/admin/categories" element={<AdminCategory />} />
        <Route path="/admin/categories/add" element={<AddCategory />} />
        <Route path="/admin/orders" element={<AdminOrder />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/hero-settings" element={<AdminHeroSettings />} />
        <Route path="/admin/promo-settings" element={<AdminPromoSettings />} />
        <Route path="/admin/bank-details" element={<AdminBankDetails />} />
      </Route>

      {/* ================= SUPER ADMIN ROUTE ================= */}
      <Route
        path="/superadmin"
        element={
          <SuperAdminRoutes>
            <SuperAdminLayout />
          </SuperAdminRoutes>
        }
      >
        <Route index element={<Overview />} />
        <Route path="manageAdmins" element={<ManageAdmins />} />
      </Route>

    </Routes>
  );
}