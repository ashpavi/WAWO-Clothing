import { FaTrash } from "react-icons/fa";
import { formatPrice } from "../../utils/formatPrice";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-5 border rounded-xl p-5 bg-white shadow-sm">

      {/* PRODUCT IMAGE */}
      <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">

        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-xs">
            No Image
          </span>
        )}

      </div>


      {/* PRODUCT DETAILS */}
      <div className="flex-1">

        <div className="flex justify-between">

          <h3 className="font-semibold text-lg">
            {item.name}
          </h3>

          <p className="font-semibold text-lg">
            {formatPrice(itemTotal)}
          </p>

        </div>


        {/* OPTIONAL DETAILS */}
        {(item.color || item.size) && (
          <p className="text-gray-500 text-sm mt-1">
            {item.color && `Color: ${item.color}`}
            {item.color && item.size && " | "}
            {item.size && `Size: ${item.size}`}
          </p>
        )}


        {/* STOCK STATUS */}
        <span className="inline-block bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full mt-2">
          In Stock
        </span>


        {/* QUANTITY + REMOVE */}
        <div className="flex items-center gap-4 mt-4">

          {/* QUANTITY */}
          <div className="flex items-center border rounded-lg overflow-hidden">

            <button
              onClick={onDecrease}
              className="px-3 py-1 hover:bg-gray-100"
            >
              -
            </button>

            <span className="px-4">
              {item.quantity}
            </span>

            <button
              onClick={onIncrease}
              className="px-3 py-1 hover:bg-gray-100"
            >
              +
            </button>

          </div>


          {/* REMOVE */}
          <button
            onClick={onRemove}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm"
          >
            <FaTrash size={14} />
            Remove
          </button>

        </div>

      </div>

    </div>
  );
}