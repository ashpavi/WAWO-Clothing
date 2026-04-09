import { useState } from "react";
import {
  FaArrowLeft,
  FaCreditCard,
  FaUniversity,
  FaMoneyBillWave
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { createOrder } from "../../firebase/services/orderService";
import { formatPrice } from "../../utils/formatPrice";
import { bankTransferDetails } from "../../utils/bankTransferDetails";
import { useAuth } from "../../hooks/useAuth";

export default function Checkout() {

  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bankTransfer");

  const [shippingData, setShippingData] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    zipcode: "",
    contactno: "",
    email: ""
  });

  const [errors, setErrors] = useState({});

  /* ================= CALCULATIONS ================= */

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const COD_FEE = paymentMethod === "cod" ? 350 : 0;
  const total = subtotal + COD_FEE;

  /* ================= VALIDATION ================= */

  const validateForm = () => {

    const newErrors = {};

    if (!shippingData.fullName.trim())
      newErrors.fullName = "* Full name is required";

    if (!shippingData.streetAddress.trim())
      newErrors.streetAddress = "* Address is required";

    if (!shippingData.city.trim())
      newErrors.city = "* City is required";

    if (!shippingData.contactno.trim()) {
      newErrors.contactno = "* Phone number is required";
    } else if (!/^\d{10}$/.test(shippingData.contactno)) {
      newErrors.contactno = "* Enter a valid 10-digit phone number";
    }

    if (!shippingData.email.trim()) {
      newErrors.email = "* Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      newErrors.email = "* Enter a valid email address";
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= PLACE ORDER ================= */

  const handlePlaceOrder = async () => {

    if (!validateForm()) return;
    if (loading) return;

    for (const item of cartItems) {
      if (item.stock === 0) return alert(`${item.name} is out of stock`);
      if (item.quantity > item.stock) {
        return alert(`${item.name} only has ${item.stock} left`);
      }
    }

    setLoading(true);

    try {

      const paymentDetails =
        paymentMethod === "bankTransfer" ? bankTransferDetails : null;

      const order = {
        customer: shippingData,
        items: cartItems,
        paymentMethod,
        paymentDetails,
        subtotal,
        codFee: COD_FEE,
        total,
        status: "Processing",
        userId: currentUser ? currentUser.uid : null,
        isGuest: !currentUser,
      };

      const orderId = await createOrder(order);

      clearCart();

      navigate("/orderSuccess", {
        state: {
          orderId,
          shippingData,
          paymentMethod,
          paymentDetails,
          items: cartItems,
          subtotal,
          codFee: COD_FEE,
          total,
          date: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="bg-gray-50 min-h-screen py-10">

      <div className="max-w-7xl mx-auto px-4">

        {/* BACK */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm mb-8"
        >
          <FaArrowLeft />
          Back to Cart
        </button>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* ADDRESS */}
            <div className="bg-white p-6 rounded-2xl border space-y-4">

              <h3 className="font-semibold">Delivery Address</h3>

              <input
                placeholder="Full Name"
                className={`input ${errors.fullName && "border-red-500"}`}
                onChange={(e)=>setShippingData({...shippingData,fullName:e.target.value})}
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}

              <input
                placeholder="Street Address"
                className={`input ${errors.streetAddress && "border-red-500"}`}
                onChange={(e)=>setShippingData({...shippingData,streetAddress:e.target.value})}
              />
              {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <input
                    placeholder="City"
                    className={`input ${errors.city && "border-red-500"}`}
                    onChange={(e)=>setShippingData({...shippingData,city:e.target.value})}
                  />
                  {errors.city && <p className="error">{errors.city}</p>}
                </div>

                <input
                  placeholder="ZIP Code (Optional)"
                  className="input"
                  onChange={(e)=>setShippingData({...shippingData,zipcode:e.target.value})}
                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <input
                    placeholder="Phone"
                    className={`input ${errors.contactno && "border-red-500"}`}
                    onChange={(e)=>setShippingData({...shippingData,contactno:e.target.value})}
                  />
                  {errors.contactno && <p className="error">{errors.contactno}</p>}
                </div>

                <div>
                  <input
                    placeholder="Email"
                    className={`input ${errors.email && "border-red-500"}`}
                    onChange={(e)=>setShippingData({...shippingData,email:e.target.value})}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>

              </div>

            </div>

            {/* PAYMENT */}
            <div className="bg-white p-6 rounded-2xl border space-y-4">

              <h3 className="font-semibold">Payment Method</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <button disabled className="p-4 border rounded-xl opacity-50">
                  <FaCreditCard /> Card (Coming Soon)
                </button>

                <button
                  onClick={()=>setPaymentMethod("bankTransfer")}
                  className={`p-4 border rounded-xl ${
                    paymentMethod==="bankTransfer" && "border-blue-600 bg-blue-50"
                  }`}
                >
                  <FaUniversity /> Bank Transfer
                </button>

                <button
                  onClick={()=>setPaymentMethod("cod")}
                  className={`p-4 border rounded-xl ${
                    paymentMethod==="cod" && "border-blue-600 bg-blue-50"
                  }`}
                >
                  <FaMoneyBillWave /> COD
                </button>

              </div>

              {/* 🔥 BANK TRANSFER UI */}
              {paymentMethod === "bankTransfer" && (
                <div className="mt-4 p-5 border rounded-xl bg-blue-50 space-y-4">

                  <h4 className="font-semibold text-blue-700">
                    Bank Transfer Details
                  </h4>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p><b>Bank:</b> {bankTransferDetails.bankName}</p>
                    <p><b>Branch:</b> {bankTransferDetails.branch}</p>
                    <p><b>Account Number:</b> {bankTransferDetails.accountNumber}</p>
                    <p><b>Account Holder:</b> {bankTransferDetails.accountHolder}</p>
                  </div>

                  <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                    <p className="font-medium mb-1">Instructions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete the bank transfer using above details</li>
                      <li>Send your deposit slip via WhatsApp after payment</li>
                      <li>Mention your <b>Name</b> and <b>City</b> as reference</li>
                    </ul>
                  </div>

                  <a
                    href="https://wa.me/94765358085"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    💬 Send Slip via WhatsApp
                  </a>

                </div>
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-2xl border space-y-4 h-fit">

            <h3 className="font-semibold">Order Summary</h3>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {paymentMethod==="cod" && (
              <div className="flex justify-between">
                <span>COD Fee</span>
                <span>{formatPrice(350)}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white ${
                loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Placing..." : "Place Order"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}