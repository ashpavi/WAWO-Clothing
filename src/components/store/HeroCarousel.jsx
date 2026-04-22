import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const lastIndex = slides.length - 1;

  /* AUTO SLIDE (STOP AT LAST) */
  useEffect(() => {
    if (current === lastIndex) return;

    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, [current, lastIndex]);

  const nextSlide = () => {
    setCurrent((prev) => (prev < lastIndex ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="relative w-full overflow-hidden bg-black h-[60vh] sm:h-[75vh] md:h-[90vh]">

      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">

            {/* IMAGE */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* CONTENT */}
            <div
              className="
                relative z-20 h-full flex flex-col
                justify-center
                items-center sm:items-start
                text-center sm:text-left
                px-4 sm:px-10 lg:px-30
              "
            >
              <div className="space-y-4 max-w-[90%] sm:max-w-md md:max-w-lg text-white">

                <span className="block text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  {slide.tag}
                </span>

                <h2 className="text-xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  {slide.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-100">
                  {slide.subtitle}
                </p>

                <Link to="/products">
                  <button className="mt-3 bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                    Shop Collection
                  </button>
                </Link>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* NAVIGATION (Desktop only) */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full z-30 hover:scale-110 transition"
      >
        <FaChevronLeft size={12} />
      </button>

      <button
        onClick={nextSlide}
        disabled={current === lastIndex}
        className={`hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full z-30 transition ${
          current === lastIndex
            ? "bg-white/40 cursor-not-allowed"
            : "bg-white/90 hover:scale-110"
        }`}
      >
        <FaChevronRight size={12} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              index === current ? "w-5 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}