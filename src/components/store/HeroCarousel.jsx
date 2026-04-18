import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const lastIndex = slides.length - 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < lastIndex ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [lastIndex]);

  const nextSlide = () => {
    setCurrent((prev) => (prev < lastIndex ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : lastIndex));
  };

  return (
    <div
      className="
        relative overflow-hidden w-full bg-gray-900
        aspect-[16/9]
        h-[55vh] 
        sm:h-[65vh] 
        md:h-[89vh]
      "
    >
      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full relative h-full">
            
            {/* IMAGE */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

            {/* CONTENT */}
            <div
              className="
                relative z-20 h-full flex flex-col
                items-center justify-center
                sm:items-start
                px-4 sm:px-10 lg:px-20
                text-center sm:text-left
              "
            >
              <div className="space-y-4 max-w-[90%] sm:max-w-md md:max-w-lg text-white">
                
                <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  {slide.tag}
                </span>

                <h2 className="text-lg sm:text-4xl md:text-5xl font-bold leading-tight">
                  {slide.title}
                </h2>

                <p className="text-gray-100 text-xs sm:text-base">
                  {slide.subtitle}
                </p>

                <Link to="/products">
                  <button
                    className="
                      mt-1 sm:mt-2
                      bg-white text-black
                      px-4 sm:px-6 py-1.5 sm:py-2.5
                      rounded-full
                      text-[11px] sm:text-sm
                      font-medium
                      hover:bg-gray-200 transition
                    "
                  >
                    Shop Collection
                  </button>
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full z-30 hover:scale-110 transition"
      >
        <FaChevronLeft size={12} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full z-30 hover:scale-110 transition"
      >
        <FaChevronRight size={12} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full cursor-pointer ${
              index === current ? "w-5 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}