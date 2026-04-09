import { useState, useEffect } from "react";
import ProductCard from "../../components/store/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useSearchParams } from "react-router-dom";

export default function ProductList() {

  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get("category") || "All";
  const selectedBrand = searchParams.get("brand") || "All";
  const priceRange = Number(searchParams.get("maxPrice")) || 50000;
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();


  /* AUTO GENERATE BRANDS FROM PRODUCTS */

  const brands = [
    "All",
    ...new Set(products.map((p) => p.brand))
  ];


  /* FILTER PRODUCTS */

  const filteredProducts = products.filter((product) => {

    const categoryMatch =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const brandMatch =
      selectedBrand === "All" ||
      product.brand === selectedBrand;

    const priceMatch =
      product.price <= priceRange;

    const searchMatch =
      !searchQuery ||
      `${product.name || ""} ${product.brand || ""} ${product.category || ""}`
        .toLowerCase()
        .includes(searchQuery);

    return categoryMatch && brandMatch && priceMatch && searchMatch;

  });


  /* UPDATE URL */

  const updateFilter = (key, value) => {

    const params = new URLSearchParams(searchParams);

    if (value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);

  };


  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">

      {/* HEADER */}

      <div className="text-center mb-10">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Our Products
        </h1>

        <p className="text-gray-500 mt-2">
          {searchQuery
            ? `Showing results for "${searchParams.get("search")}"`
            : "Discover the best products curated for you"}
        </p>

        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>

      </div>


      {/* MOBILE FILTER BUTTON */}

      <div className="lg:hidden mb-6 flex justify-between items-center">

        <button
          onClick={() => setShowFilters(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Filters
        </button>

        <p className="text-sm text-gray-500">
          {filteredProducts.length} items
        </p>

      </div>


      <div className="flex gap-8">

        {/* BACKDROP */}

        {showFilters && (
          <div
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          ></div>
        )}


        {/* SIDEBAR */}

        <aside
          className={`
          fixed lg:static top-0 left-0 h-full w-72 bg-white z-40
          pt-20 lg:pt-6 px-6 pb-6 shadow-lg lg:shadow-none
          transform ${showFilters ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300
        `}
        >

          {/* CLOSE */}

          <div className="lg:hidden absolute top-5 right-5">

            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-600 text-xl hover:text-black"
            >
              ✕
            </button>

          </div>


          {/* CATEGORY */}

          <div className="mb-8">

            <h3 className="font-semibold text-gray-700 mb-3">
              Category
            </h3>

            <label className="flex items-center gap-2 mb-2">

              <input
                type="radio"
                checked={selectedCategory === "All"}
                onChange={() => updateFilter("category", "All")}
              />

              All

            </label>


            {categories.map((cat) => (

              <label
                key={cat.id}
                className="flex items-center gap-2 mb-2"
              >

                <input
                  type="radio"
                  checked={selectedCategory === cat.name}
                  onChange={() =>
                    updateFilter("category", cat.name)
                  }
                />

                {cat.name}

              </label>

            ))}

          </div>


          {/* BRAND */}

          <div className="mb-8">

            <h3 className="font-semibold text-gray-700 mb-3">
              Brand
            </h3>

            {brands.map((brand) => (

              <label
                key={brand}
                className="flex items-center gap-2 mb-2"
              >

                <input
                  type="radio"
                  checked={selectedBrand === brand}
                  onChange={() =>
                    updateFilter("brand", brand)
                  }
                />

                {brand}

              </label>

            ))}

          </div>


          {/* PRICE */}

          <div className="mb-6">

            <h3 className="font-semibold text-gray-700 mb-3">
              Price Range
            </h3>

            <input
              type="range"
              min="0"
              max="50000"
              value={priceRange}
              onChange={(e) =>
                updateFilter("maxPrice", e.target.value)
              }
              className="w-full"
            />

            <p className="text-sm text-gray-500 mt-2">
              Up to LKR {priceRange}
            </p>

          </div>


          {/* RESET */}

          <button
            onClick={() => setSearchParams({})}
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Reset Filters
          </button>

        </aside>


        {/* PRODUCTS */}

        <main className="flex-1">

          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {loading ? (

              <p className="text-center col-span-full">
                Loading products...
              </p>

            ) : (

              filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-center  text-gray-500 col-span-full lg:ml-[-300px] pt-3">
                  No products found for your current search and filters.
                </p>
              )

            )}

          </div>

        </main>

      </div>

    </div>
  );

}