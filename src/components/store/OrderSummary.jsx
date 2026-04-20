import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

export default function OrderSummary({ subtotal }) {

  const navigate = useNavigate();

  const isDisabled = subtotal === 0;

  const isFreeDelivery = subtotal >= 5000;

  const DELIVERY_FEE = !isFreeDelivery && subtotal > 0 ? 350 : 0;

  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm space-y-5">

      <h2 className="text-xl font-semibold">
        Order Summary
      </h2>

      {/* SUBTOTAL */}
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {/* 💡 FREE DELIVERY MESSAGE */}
      {!isFreeDelivery && subtotal > 0 && (
        <p className="text-sm text-orange-600 font-medium">
          Spend {formatPrice(5000 - subtotal)} more to get FREE delivery 🚚
        </p>
      )}

      {/* 🚚 DELIVERY FEE */}
      {!isFreeDelivery && subtotal > 0 && (
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span>{formatPrice(350)}</span>
        </div>
      )}

      {/* ✅ FREE DELIVERY UNLOCKED */}
      {isFreeDelivery && subtotal > 0 && (
        <div className="flex justify-between text-green-600 font-medium">
          <span>Delivery</span>
          <span>FREE</span>
        </div>
      )}

      <hr />

      {/* TOTAL */}
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {/* CHECKOUT BUTTON */}
      <button
        disabled={isDisabled}
        onClick={() => navigate("/checkout")}
        className={`w-full py-3 rounded-lg text-white transition
          ${isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        Proceed to Checkout →
      </button>

      <p className="text-xs text-gray-500 text-center">
        Secure 256-bit SSL encrypted payment processing.
      </p>

    </div>
  );
}