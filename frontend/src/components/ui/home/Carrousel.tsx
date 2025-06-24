"use client";

import React, { useState, useEffect } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoArrowForward,
} from "react-icons/io5";
import { CarouselProps } from "@/types";
import defaultSlides from "@/data/Carrousel";
import Button from "@/components/common/Button";

const Carousel: React.FC<CarouselProps> = ({
  slides = defaultSlides,
  autoPlayInterval = 5000,
  showIndicators = true,
  showNavigation = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Efecto para manejar el autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Contenedor de Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative flex-none w-full h-full">
            {/* Imagen de Fondo */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h2 className="text-sm md:text-base font-medium text-amber-300 uppercase tracking-wider mb-2 opacity-90">
                  {slide.subtitle}
                </h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                  {slide.description}
                </p>                {slide.buttonText && (
                  <Button
                    onClick={() => {
                      if (slide.buttonLink) {
                        if (slide.target === "_blank") {
                          window.open(slide.buttonLink, "_blank");
                        } else {
                          window.location.href = slide.buttonLink;
                        }
                      }
                    }}
                    className="inline-flex items-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    {slide.buttonText}
                    <IoArrowForward className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas de Navegación */}
      {showNavigation && (
        <>
          {" "}
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-amber/20 hover:bg-amber/30 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-amber/20 hover:bg-amber/30 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Siguiente"
          >
            <IoChevronForward className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicadores */}
      {showIndicators && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contador de Slides */}
      <div className="absolute top-8 right-8 z-20 text-white/80 text-sm font-medium">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default Carousel;
