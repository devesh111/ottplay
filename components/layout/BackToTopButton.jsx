"use client";

import { ArrowUp, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Chevron } from "react-day-picker";

// Component to handle the scroll-to-top functionality
const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Toggles button visibility based on scroll depth
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 100);
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        // Performs smooth scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return isVisible ? (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 w-10 h-10 bg-primary text-white rounded-full shadow-lg z-10 flex justify-center items-center" 
            aria-label="Back to top"
        >
            <ChevronUp width={20} />
        </button>
    ) : null;
};

export default BackToTopButton;
