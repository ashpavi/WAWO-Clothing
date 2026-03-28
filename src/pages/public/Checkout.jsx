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
  const { cartItems } = useCart();
  const { currentUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [shippingData, setShippingData] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    zipcode: "",
    contactno: "",
    email: ""
  });

  /* ================= ORDER CALCULATIONS ================= */

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const COD_FEE = paymentMethod === "cod" ? 350 : 0;

  const total = subtotal + COD_FEE;

  /* ================= PLACE ORDER ================= */
  const validateForm = () => {

  if (!shippingData.fullName.trim()) {
    alert("Please enter your full name");
    return false;
  }

  if (!shippingData.streetAddress.trim()) {
    alert("Please enter your street address");
    return false;
  }

  if (!shippingData.city.trim()) {
    alert("Please enter your city");
    return false;
  }

  if (!shippingData.zipcode.trim()) {
    alert("Please enter your ZIP code");
    return false;
  }

  if (!shippingData.contactno.trim()) {
    alert("Please enter your contact number");
    return false;
  }

  if (!shippingData.email.trim()) {
    alert("Please enter your email address");
    return false;
  }

  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return false;
  }

  return true;
};

 const handlePlaceOrder = async () => {

  if (!validateForm()) return;

  try {

    const paymentDetails = paymentMethod === "bankTransfer"
      ? bankTransferDetails
      : null;

    const order = {
      customer: shippingData,
      items: cartItems,
      paymentMethod,
      paymentDetails,
      subtotal,
      codFee: COD_FEE,
      total,
      status: "Processing",
      date: new Date().toISOString(),
      userId: currentUser ? currentUser.uid : null,
      isGuest: !currentUser,
    };

    const orderId = await createOrder(order);

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

    console.error("Order creation failed:", error);

  }

};

  return (

    <div className="bg-gray-50 min-h-screen py-10 sm:py-14">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm text-gray-600 mb-10 hover:text-black"
        >
          <FaArrowLeft />
          Back to Cart
        </button>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">


          {/* ================= LEFT SIDE ================= */}

          <div className="lg:col-span-2 space-y-8">
            {!currentUser && (
              <div className="bg-white border rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Checkout as a guest or login for a faster experience
                  </p>
                  <p className="text-xs text-gray-500">
                    Save your details, track orders, and checkout quicker next time.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Login
                </button>

              </div>
            )}


            {/* DELIVERY ADDRESS */}

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border space-y-6">

              <h3 className="text-lg font-semibold">
                Delivery Address
              </h3>


              <input
                value={shippingData.fullName}
                onChange={(e) =>
                  setShippingData({ ...shippingData, fullName: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full Name"
              />


              <input
                value={shippingData.streetAddress}
                onChange={(e) =>
                  setShippingData({ ...shippingData, streetAddress: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Street Address"
              />


              <div className="grid grid-cols-2 gap-4">

                <input
                  value={shippingData.city}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, city: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="City"
                />

                <input
                  value={shippingData.zipcode}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, zipcode: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ZIP Code"
                />

              </div>


              <div className="grid grid-cols-2 gap-4">

                <input
                  value={shippingData.contactno}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, contactno: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contact Number"
                />

                <input
                  value={shippingData.email}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, email: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Email Address"
                />

              </div>

            </div>


            {/* PAYMENT METHOD */}

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border space-y-6">

              <h3 className="text-lg font-semibold">
                Payment Method
              </h3>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer
                    transition-colors ${paymentMethod === "card" ? "border-blue-600 bg-blue-50" : ""}`}
                >
                  <FaCreditCard />
                  Credit Card
                </button>


                <button
                  type="button"
                  onClick={() => setPaymentMethod("bankTransfer")}
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer
                    transition-colors ${paymentMethod === "bankTransfer" ? "border-blue-600 bg-blue-50" : ""}`}
                >
                  <FaUniversity />
                  Bank Transfer
                </button>


                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer
                    transition-colors ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50" : ""}`}
                >
                  <FaMoneyBillWave />
                  Cash on Delivery
                </button>

              </div>

              <div
                className={`grid transition-all duration-300 ease-out ${paymentMethod === "bankTransfer"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-sky-50 to-white p-5 text-sm text-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold mb-4">
                      <FaUniversity />
                      Transfer Details
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Bank Name</p>
                        <p className="font-medium">{bankTransferDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Account Name</p>
                        <p className="font-medium">{bankTransferDetails.accountName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Account Number</p>
                        <p className="font-medium">{bankTransferDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">SWIFT Code</p>
                        <p className="font-medium">{bankTransferDetails.swiftCode}</p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-xl bg-white/80 px-4 py-3 text-xs text-gray-600 border border-blue-100">
                      {bankTransferDetails.reference}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="bg-white border rounded-2xl p-6 shadow-sm lg:sticky lg:top-24 h-fit space-y-6">

            <h3 className="text-lg font-semibold">
              Order Summary
            </h3>


            {/* ITEMS */}

            <div className="space-y-3 text-sm">

              {cartItems.map((item) => (

                <div key={item.id} className="flex justify-between">

                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    {formatPrice(item.price * item.quantity)}
                  </span>

                </div>

              ))}

            </div>


            <hr />


            {/* SUBTOTAL */}

            <div className="flex justify-between text-sm">

              <span>Subtotal</span>

              <span>{formatPrice(subtotal)}</span>

            </div>


            {/* COD FEE */}

            {paymentMethod === "cod" && (

              <div className="flex justify-between text-sm">

                <span>Cash on Delivery</span>

                <span>{formatPrice(350)}</span>

              </div>

            )}


            <hr />


            {/* TOTAL */}

            <div className="flex justify-between font-bold text-lg">

              <span>Total</span>

              <span className="text-blue-600">
                {formatPrice(total)}
              </span>

            </div>


            {/* PLACE ORDER */}

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
            >
              Place Order →
            </button>


            <p className="text-xs text-gray-500 text-center">
              Secure 256-bit SSL encrypted payment.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}