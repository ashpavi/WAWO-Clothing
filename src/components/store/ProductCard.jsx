import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const productId = product?.id ?? 1;
  const productPath = `/products/${productId}`;

  const handleAdd = () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.isOnSale && product.discountPrice
          ? product.discountPrice
          : product.price,
        images: product.images,
        stock: product.stock,
        quantity: 1
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    };

  return (
    <div
      className="
        bg-white rounded-xl border border-gray-200
        hover:shadow-lg hover:-translate-y-1
        transition-all duration-300
        overflow-hidden flex flex-col
      "
    >

      {/* IMAGE */}
      <Link
        to={productPath}
        className="block bg-gray-100 overflow-hidden aspect-square"
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="
            w-full h-full object-cover
            hover:scale-105 transition-transform duration-500
          "
        />
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">

        {/* BRAND */}
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">
            {product.brand}
          </p>
        )}

        {/* NAME */}
        <Link
          to={productPath}
          className="
            text-sm font-semibold text-gray-800
            hover:text-blue-600 transition
            line-clamp-2 min-h-[40px]
          "
        >
          {product.name}
        </Link>

        {/* PRICE */}
        <div className="mt-2">
          {product.isOnSale && product.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">
                {formatPrice(product.price)}
              </span>
              <span className="text-black font-bold text-lg">
                {formatPrice(product.discountPrice)}
              </span>
            </div>
          ) : (
            <p className="text-black font-bold text-lg">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* BUTTON (ALIGNED) */}
        <div className="mt-auto  pt-3">
          <button
            onClick={handleAdd}
            className={`
              w-full flex items-center justify-center gap-2
              py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            {added ? (
              <>
                <FaCheck size={12} />
                Added
              </>
            ) : (
              <>
                <FaShoppingCart size={12} />
                Add to Cart
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}