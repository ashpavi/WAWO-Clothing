import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductDetails() {

  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const product = products.find((p) => p.id === id);

  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="p-20 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  const handleAddToCart = () => {

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity: qty
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

  };

  return (

    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

      {/* BREADCRUMB */}

      <div className="text-sm text-gray-500 mb-8">

        <Link to="/" className="hover:text-blue-600">Home</Link>

        <span className="mx-2">/</span>

        <Link to="/products" className="hover:text-blue-600">Products</Link>

        <span className="mx-2">/</span>

        <span className="text-gray-700">{product.name}</span>

      </div>


      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* IMAGE GALLERY */}

        <div>

          {/* MAIN IMAGE */}

          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">

            <img
              src={product.images?.[imageIndex]}
              alt={product.name}
              className="w-full h-full object-contain p-6"
            />

          </div>


          {/* THUMBNAILS */}

          <div className="flex gap-3 mt-4">

            {product.images?.map((img, i) => (

              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition
                ${imageIndex === i
                  ? "border-blue-600"
                  : "border-gray-200 hover:border-gray-400"
                }`}
              >

                <img
                  src={img}
                  className="w-full h-full object-cover"
                />

              </button>

            ))}

          </div>

        </div>


        {/* PRODUCT INFO */}

        <div className="flex flex-col justify-center">

          <p className="text-sm text-gray-500 mb-2">
            {product.category}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-blue-600 mb-6">
            {formatPrice(product.price)}
          </p>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>


          {/* QUANTITY */}

          <div className="mb-8">

            <p className="text-sm font-semibold mb-2">
              Quantity
            </p>

            <div className="flex items-center border rounded-lg w-fit">

              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg"
              >
                −
              </button>

              <span className="px-6">{qty}</span>

              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 text-lg"
              >
                +
              </button>

            </div>

          </div>


          {/* ADD TO CART */}

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg text-white font-semibold transition
            ${added
              ? "bg-green-600"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {added ? "Added to Cart ✓" : "Add to Cart"}

          </button>

        </div>

      </div>

    </div>

  );

}