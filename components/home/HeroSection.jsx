'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info, ChevronRight } from 'lucide-react';

/**
 * Hero Section Component
 * 
 * Large banner section featuring:
 * - Featured content with background image
 * - Gradient overlay
 * - Title and description
 * - Call-to-action buttons (Play, More Info)
 * - Animated elements
 * 
 * @component
 * @returns {JSX.Element} The hero section
 */
export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full h-screen max-h-[600px] overflow-hidden rounded-xl">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=600&fit=crop)',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay - Pink, Purple, Green */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1e]/95 via-[#ec4899]/20 to-[#10b981]/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1e] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ec4899]/20 to-[#a855f7]/20 border border-[#ec4899]/50 mb-6 transform transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#ec4899] animate-pulse"></div>
            <span className="text-sm font-semibold text-[#ec4899]">Now Streaming</span>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight transform transition-all duration-1000 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#10b981] bg-clip-text text-transparent">
              Discover Your Next
            </span>
            <br />
            <span className="text-[#e5e5ff]">Favorite Story</span>
          </h1>

          {/* Description */}
          <p
            className={`text-lg text-[#9ca3af] mb-8 max-w-xl leading-relaxed transform transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Stream thousands of movies and TV shows in stunning quality. From blockbuster films to exclusive series, find your next obsession today.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Play Button */}
            <button className="group px-8 py-4 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg flex items-center justify-center space-x-2 hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
              <Play size={24} className="group-hover:translate-x-1 transition-transform" />
              <span>Play Now</span>
            </button>

            {/* More Info Button */}
            <button className="group px-8 py-4 rounded-lg border-2 border-[#10b981] text-[#10b981] font-bold text-lg flex items-center justify-center space-x-2 hover:bg-[#10b981]/10 transition-all">
              <Info size={24} />
              <span>More Info</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div
            className={`flex gap-8 mt-12 transform transition-all duration-1000 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div>
              <p className="text-2xl font-bold text-[#ec4899]">10K+</p>
              <p className="text-sm text-[#9ca3af]">Movies & Shows</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#a855f7]">4K</p>
              <p className="text-sm text-[#9ca3af]">Ultra HD Quality</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#10b981]">24/7</p>
              <p className="text-sm text-[#9ca3af]">Streaming Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#ec4899] rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-[#ec4899] rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
