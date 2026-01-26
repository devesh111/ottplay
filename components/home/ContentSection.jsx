'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import ContentCard from '@/components/content/ContentCard';

/**
 * Content Section Component
 * 
 * Displays a horizontal scrollable section of content cards
 * with title, description, and view all link
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {Array} props.items - Array of content items
 * @param {string} props.viewAllLink - Link to view all items
 * @param {string} props.gradient - Gradient class for title
 * @returns {JSX.Element} The content section
 */
export default function ContentSection({ 
  title, 
  description, 
  items = [], 
  viewAllLink = '#',
  gradient = 'from-[#ec4899] to-[#a855f7]'
}) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {title}
            </h2>
            <p className="text-[#9ca3af] text-lg">{description}</p>
          </div>
          <Link
            href={viewAllLink}
            className="hidden sm:flex items-center space-x-2 text-[#ec4899] hover:text-[#a855f7] transition-colors font-semibold group"
          >
            <span>View All</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content Cards Scroll */}
        <div
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
          onScroll={handleScroll}
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-full sm:w-80">
                <ContentCard
                  id={item.id}
                  title={item.title}
                  titleAr={item.titleAr}
                  description={item.description}
                  posterUrl={item.posterUrl}
                  rating={item.rating}
                  type={item.type}
                  language={item.language}
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <p className="text-[#9ca3af]">No content available</p>
            </div>
          )}
        </div>

        {/* Mobile View All Link */}
        <Link
          href={viewAllLink}
          className="sm:hidden flex items-center justify-center space-x-2 text-[#ec4899] hover:text-[#a855f7] transition-colors font-semibold group mt-6"
        >
          <span>View All</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
