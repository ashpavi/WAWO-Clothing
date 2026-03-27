import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const lastIndex = slides.length - 1;

  const isAtFirstSlide = current === 0;
  const isAtLastSlide = current === lastIndex;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < lastIndex ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [lastIndex]);

  const nextSlide = () => {
    setCurrent((prev) => (prev < lastIndex ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="relative overflow-hidden bg-gray-100">

      {/* SLIDES WRAPPER */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full grid grid-cols-1 md:grid-cols-2 
                       items-center 
                       px-6 sm:px-12 lg:px-20 
                       py-16 sm:py-24"
          >
            {/* LEFT CONTENT */}
            <div className="space-y-6 
                text-center md:text-left 
                md:pl-12 lg:pl-20 
                md:pr-6">

              <span className="text-sm uppercase tracking-wider text-blue-600 font-semibold">
                {slide.tag}
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {slide.title}
              </h2>

              <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
                {slide.subtitle}
              </p>

              <Link to="/products">
                <button className="mt-4 bg-black text-white px-8 py-3 rounded-full 
                                   hover:bg-gray-800 transition-all duration-300">
                  Shop Collection
                </button>
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center mt-10 md:mt-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-72 sm:w-96 md:w-[450px] 
                           rounded-3xl shadow-2xl 
                           hover:scale-105 transition duration-500"
              />
            </div>

          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      <button
        onClick={prevSlide}
        disabled={isAtFirstSlide}
        className={`absolute left-6 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full transition ${
          isAtFirstSlide
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-110"
        }`}
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAtLastSlide}
        className={`absolute right-6 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full transition ${
          isAtLastSlide
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-110"
        }`}
      >
        <FaChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 transition-all duration-300 cursor-pointer rounded-full ${
              index === current
                ? "w-8 bg-black"
                : "w-2 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
