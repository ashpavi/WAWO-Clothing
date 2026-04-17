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

  /* ADD TO CART */
  const handleAddToCart = () => {

    const finalPrice =
      product.isOnSale && product.discountPrice
        ? product.discountPrice
        : product.price;

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice, 
      stock: product.stock,
      images: product.images,
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
        <div className="flex flex-col justify-start pt-10">

          <p className="text-sm text-gray-500 mb-2">
            {product.category}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          {/* 🔥 PRICE SECTION */}
          <div className="mb-4">
            {product.isOnSale && product.discountPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 line-through text-lg">
                  {formatPrice(product.price)}
                </span>
                <span className="text-blue-800 font-bold text-2xl">
                  {formatPrice(product.discountPrice)}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-blue-800">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          {/* 🔥 STOCK */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-green-600 text-sm font-medium">
                {product.stock} items in stock
              </p>
            ) : (
              <p className="text-red-500 text-sm font-medium">
                Out of stock
              </p>
            )}
          </div>

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
                onClick={() =>
                  setQty((q) =>
                    q < product.stock ? q + 1 : q
                  )
                }
                className="px-4 py-2 text-lg"
              >
                +
              </button>

            </div>

          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-lg text-white font-semibold transition
            ${product.stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : added
              ? "bg-green-600"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {product.stock === 0
              ? "Out of Stock"
              : added
              ? "Added to Cart ✓"
              : "Add to Cart"}

          </button>

        </div>

      </div>

    </div>

  );

}