import CartItem from "../../components/store/CartItem";
import OrderSummary from "../../components/store/OrderSummary";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";


export default function CartPage() {

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem
  } = useCart();

  /* ================= CALCULATIONS ================= */

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  

  return (

    <div className="bg-gray-50 min-h-screen py-10 sm:py-14">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>

          {cartItems.length > 0 && (
            <span className="text-sm text-gray-500">
              {cartItems.length} item{cartItems.length > 1 && "s"}
            </span>
          )}

        </div>


        {/* ================= EMPTY STATE ================= */}

        {cartItems.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">

            <h2 className="text-lg font-semibold text-gray-800">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* ================= CART ITEMS ================= */}

            <div className="lg:col-span-2 space-y-6">

              {cartItems.map((item) => (

                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={() => increaseQty(item.id)}
                  onDecrease={() => decreaseQty(item.id)}
                  onRemove={() => removeItem(item.id)}
                />

              ))}

            </div>


            {/* ================= ORDER SUMMARY ================= */}

            <div className="lg:sticky lg:top-24 h-fit">

              <OrderSummary
                subtotal={subtotal}
              />

            </div>

          </div>

        )}

      </div>

    </div>

  );

}