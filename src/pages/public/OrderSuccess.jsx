import {
  FaCheckCircle,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCreditCard,
  FaUniversity,
  FaMoneyBillWave
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";
import { useEffect } from "react";

export default function OrderSuccess() {

  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const date = location.state?.date;
  const orderId = location.state?.orderId;
  const shippingData = location.state?.shippingData;
  const paymentMethod = location.state?.paymentMethod;
  const paymentDetails = location.state?.paymentDetails;

  const items = location.state?.items || [];
  const subtotal = location.state?.subtotal || 0;
  const deliveryFee = location.state?.deliveryFee || 0;
  const total = location.state?.total || 0;

  /* CLEAR CART AFTER ORDER */
  useEffect(() => {
    clearCart();
  }, []);

  return (

    <div className="bg-gray-50 min-h-screen py-16 sm:py-20">

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* SUCCESS MESSAGE */}
        <div className="text-center mb-12">

          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-6 rounded-full shadow-sm">
              <FaCheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Thank You for Your Purchase!
          </h1>

          {orderId && (
            <p className="text-gray-600 text-sm sm:text-base">
              Order{" "}
              <span className="font-semibold text-blue-600">
                #{orderId}
              </span>{" "}
              has been successfully placed.
            </p>
          )}

          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(date).toLocaleDateString()}
          </p>

        </div>

        {/* DELIVERY ADDRESS */}
        {shippingData && (
          <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 mb-8">

            <div className="flex items-center gap-2 mb-6">
              <FaMapMarkerAlt className="text-blue-600" />
              <h3 className="font-semibold text-lg">
                Delivery Address
              </h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>{shippingData.fullName}</strong></p>
              <p>{shippingData.streetAddress}</p>
              <p>{shippingData.city}, {shippingData.zipcode}</p>
              <p>Contact: {shippingData.contactno}</p>
              <p>Email: {shippingData.email}</p>
            </div>

          </div>
        )}

        {/* PAYMENT METHOD */}
        {paymentMethod && (
          <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 mb-8">

            <h3 className="font-semibold text-lg mb-6">
              Payment Method
            </h3>

            <div className="flex items-center gap-3 text-gray-700">

              {paymentMethod === "card" && (
                <>
                  <FaCreditCard className="text-blue-600" />
                  Credit Card
                </>
              )}

              {paymentMethod === "bankTransfer" && paymentDetails && (
                <div className="w-full space-y-4">

                  <div className="flex items-center gap-3">
                    <FaUniversity className="text-blue-600" />
                    Bank Transfer
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm space-y-4">

                    <div className="grid gap-3 sm:grid-cols-2">

                      <div>
                        <p className="text-xs text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-800">
                          {paymentDetails.bankName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Branch</p>
                        <p className="font-medium text-gray-800">
                          {paymentDetails.branch}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="font-medium text-gray-800">
                          {paymentDetails.accountNumber}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Account Holder</p>
                        <p className="font-medium text-gray-800">
                          {paymentDetails.accountHolder}
                        </p>
                      </div>

                    </div>

                    <div className="bg-white border rounded-lg p-3 text-gray-600 text-xs">
                      <p className="font-medium mb-1 text-gray-700">Instructions:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Complete the bank transfer using the above details</li>
                        <li>Send your deposit slip via WhatsApp after payment</li>
                        <li>Mention your <b>Name</b> and <b>City</b> as reference</li>
                      </ul>
                    </div>

                    <a
                      href="https://wa.me/94765358085"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs"
                    >
                      💬 Send Slip via WhatsApp
                    </a>

                  </div>

                </div>
              )}

              {paymentMethod === "cod" && (
                <>
                  <FaMoneyBillWave className="text-blue-600" />
                  Cash on Delivery
                </>
              )}

            </div>

          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 mb-10">

          <h3 className="font-semibold text-lg mb-6">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {/* DELIVERY */}
          {deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}

          {deliveryFee === 0 && subtotal > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
          )}

          <hr className="my-6" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span className="text-blue-600">
              {formatPrice(total)}
            </span>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            Continue Shopping
            <FaArrowRight />
          </button>

          <button
            onClick={() => navigate("/account/orders")}
            className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100"
          >
            View Orders
          </button>

        </div>

      </div>

    </div>
  );
}