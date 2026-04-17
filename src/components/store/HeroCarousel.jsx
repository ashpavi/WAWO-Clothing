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
    <div className="relative overflow-hidden bg-gray-900 w-full max-w-[1920px] mx-auto h-[60vh] sm:h-[70vh] lg:h-[min(100vh,1080px)]">

      {/* SLIDES */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full relative h-[60vh] sm:h-[70vh] lg:h-[min(100vh,1080px)]">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />

            <div className="relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-20">
              <div className="space-y-4 text-left max-w-xl text-white">
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  {slide.tag}
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                  {slide.title}
                </h2>

                <p className="text-gray-100 text-sm sm:text-base max-w-md">
                  {slide.subtitle}
                </p>

                <Link to="/products">
                  <button className="mt-2 bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all duration-300 text-sm font-medium">
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
        disabled={isAtFirstSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-2.5 rounded-full transition ${
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
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-2.5 rounded-full transition ${
          isAtLastSlide
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-110"
        }`}
      >
        <FaChevronRight size={14} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 transition-all duration-300 cursor-pointer rounded-full ${
              index === current
                ? "w-6 bg-white"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
}