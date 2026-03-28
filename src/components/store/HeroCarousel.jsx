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

      {/* SLIDES */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full grid grid-cols-1 md:grid-cols-2 
                       items-center 
                       px-6 sm:px-10 lg:px-16 
                       py-10 sm:py-14"   
          >

            {/* LEFT */}
            <div className="space-y-4 
                text-center md:text-left 
                max-w-lg mx-auto md:mx-0 
                md:ml-10 lg:ml-30">

              <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
                {slide.tag}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {slide.title}
              </h2>

              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto md:mx-0">
                {slide.subtitle}
              </p>

              <Link to="/products">
                <button className="mt-2 bg-black text-white px-6 py-2.5 rounded-full 
                                   hover:bg-gray-800 transition-all duration-300 text-sm">
                  Shop Collection
                </button>
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center md:justify-center mt-6 md:mt-0">              
              <img
                src={slide.image}
                alt={slide.title}
                className="w-64 sm:w-80 md:w-[380px]   
                           rounded-2xl shadow-xl 
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
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2.5 rounded-full transition ${
          isAtFirstSlide
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-110"
        }`}
      >
        <FaChevronLeft size={14} />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAtLastSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2.5 rounded-full transition ${
          isAtLastSlide
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-110"
        }`}
      >
        <FaChevronRight size={14} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 transition-all duration-300 cursor-pointer rounded-full ${
              index === current
                ? "w-6 bg-black"
                : "w-2 bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  );
}