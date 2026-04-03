

import { useProducts } from "../../hooks/useProducts";

import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";
import slide3 from "../../assets/slide3.png";
import ProductCard from "../../components/store/ProductCard";
import Carousel from "../../components/store/HeroCarousel";
import AboutHeroArtwork from "../../components/store/AboutHeroArtwork";
import { useCategories } from "../../hooks/useCategories";
import { useNavigate } from "react-router-dom";


export default function HomePage() {

  const { products } = useProducts();
  const { categories } = useCategories();

  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16">

      {/* HERO */}
      <section>
        <Carousel
          slides={[
            {
              tag: "New Collection",
              title: "Refined Essentials For Modern Living",
              subtitle:
                "Crafted with precision and designed for those who value timeless quality.",
              image: slide1
            },
            {
              tag: "Signature Series",
              title: "Elevate Your Everyday Experience",
              subtitle:
                "Minimal design. Maximum impact. Discover products made to inspire.",
              image: slide2
            },
            {
              tag: "Editor's Pick",
              title: "Curated For Excellence",
              subtitle:
                "Hand-selected premium pieces tailored to your lifestyle.",
              image: slide3
            }
          ]}
        />
      </section>


      {/* CATEGORY SECTION */}
      <section>

        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">

          <h2 className="text-xl sm:text-2xl font-bold mb-8">
            Shop By Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {categories.map((category) => (

              <div
                key={category.id}
                onClick={() =>
                  navigate(`/products?category=${category.name}`)
                }
                className="relative group cursor-pointer overflow-hidden rounded-xl"
              >

                {/* CATEGORY IMAGE */}

                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-55 object-cover
                            transition-transform duration-500
                            group-hover:scale-110"
                />


                {/* DARK OVERLAY */}

                <div className="absolute inset-0
                                bg-black/40
                                group-hover:bg-black/50
                                transition">
                </div>


                {/* CATEGORY NAME */}

                <div className="absolute inset-0 flex items-center justify-center">

                  <h3 className="text-white text-lg sm:text-xl font-semibold
                                tracking-wide
                                transform transition
                                group-hover:scale-110">

                    {category.name}

                  </h3>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FEATURED PRODUCTS */}
      <section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-xl sm:text-2xl font-bold">
              Featured Products
            </h2>

          </div>

          <div className="grid 
                          grid-cols-2 
                          sm:grid-cols-2 
                          md:grid-cols-3 
                          lg:grid-cols-4 
                          gap-4 sm:gap-6">

            {featuredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        </div>

      </section>


      {/* PROMO */}
      <section className="relative overflow-hidden text-white py-16 sm:py-20">

        <div className="absolute inset-0">
          <AboutHeroArtwork />
        </div>

        <div className="absolute inset-0 bg-[#2a0a4a]/80"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Special Weekend Sale
          </h2>

          <p className="mt-4 text-base sm:text-lg opacity-90">
            Get up to 40% off on selected items.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-8 bg-[#7b6bee] text-white 
                             px-8 py-3 rounded-xl 
                             font-semibold 
                             hover:bg-[#8b7cf1] 
                             transition cursor-pointer"
          >
            Explore Deals
          </button>

        </div>

      </section>

    </div>
  );
}