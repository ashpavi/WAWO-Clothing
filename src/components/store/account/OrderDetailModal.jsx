import {
  FaTimes,
  FaBox,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity
} from "react-icons/fa";
import { useEffect } from "react";
import { formatPrice } from "../../../utils/formatPrice";

export default function OrderDetailModal({ order, onClose }) {

  if (!order) return null;

  // ✅ FIXED (no fallback)
  const paymentDetails = order.paymentDetails;

  useEffect(() => {

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };

  }, []);

  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative p-8">

        {/* CLOSE */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={18} />
        </button>


        {/* HEADER */}

        <div className="mb-6">

          <h2 className="text-2xl font-semibold">
            Order #{order.id}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Status: {order.status}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Placed on {
              order.createdAt?.toDate?.().toLocaleDateString() || "N/A"
            }
          </p>

        </div>


        {/* ITEMS */}

        <div className="mb-6">

          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FaBox />
            Items
          </h3>

          <div className="space-y-3">

            {order.items.map((item, index) => (

              <div
                key={index}
                className="flex justify-between text-sm border-b pb-2"
              >

                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  {formatPrice(item.price * item.quantity)}
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* SHIPPING */}

        <div className="mb-6">

          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FaMapMarkerAlt />
            Shipping Address
          </h3>

          <p className="text-sm text-gray-700">
            {order.customer?.fullName}
          </p>

          <p className="text-sm text-gray-600">
            {order.customer?.streetAddress}
          </p>

          <p className="text-sm text-gray-600">
            {order.customer?.city}, {order.customer?.zipcode}
          </p>

          <p className="text-sm text-gray-600">
            Contact: {order.customer?.contactno}
          </p>

        </div>

        {/* PAYMENT METHOD */}

        <div className="mb-6">

          <h3 className="font-semibold mb-3 flex items-center gap-2">
            Payment Method
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-700">

            {order.paymentMethod === "card" && (
              <>
                <FaCreditCard className="text-blue-600" />
                Credit Card
              </>
            )}

            {/* ✅ SAFE CHECK ADDED */}
            {order.paymentMethod === "bankTransfer" && paymentDetails && (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2">
                  <FaUniversity className="text-blue-600" />
                  Bank Transfer
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-gray-700">
                  <p><strong>Bank:</strong> {paymentDetails.bankName}</p>
                  <p><strong>Account:</strong> {paymentDetails.accountHolder}</p>
                  <p><strong>Account No:</strong> {paymentDetails.accountNumber}</p>
                </div>
              </div>
            )}

            {order.paymentMethod === "paypal" && (
              <>
                <FaUniversity className="text-blue-600" />
                PayPal
              </>
            )}

            {order.paymentMethod === "cod" && (
              <>
                <FaMoneyBillWave className="text-green-600" />
                Cash on Delivery
              </>
            )}

          </div>

        </div>


        {/* TOTAL */}

        <div className="border-t pt-4 flex justify-between font-bold text-lg">

          <span>Total</span>

          <span className="text-blue-600">
            {formatPrice(order.total)}
          </span>

        </div>

      </div>

    </div>

  );

}