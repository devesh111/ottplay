import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Appends OTTPlay impolicy params to an image URL.
 * - desktop: width=600
 * - mobile:  width=300
 *
 * Only applies to images hosted on images.ottplay.com.
 * Other URLs (logos, icons, SVGs) are returned as-is.
 *
 * @param {string|null|undefined} url  - Original image URL
 * @param {"desktop"|"mobile"} variant - Target device class
 * @returns {string|null}
 */
export function getOptimizedImageUrl(url, variant = "desktop") {
    if (!url) return null;
    // Only transform ottplay CDN images; skip SVGs and other domains
    if (!url.includes("images.ottplay.com") || url.endsWith(".svg")) return url;

    // Strip any existing query string before adding our own
    const base = url.split("?")[0];
    const width = variant === "mobile" ? 300 : 600;
    return `${base}?impolicy=ottplay-202501_high&width=${width}`;
}

export function getOptimizedVerticalImageUrl(url, variant = "desktop") {
    if (!url) return null;
    // Only transform ottplay CDN images; skip SVGs and other domains
    if (!url.includes("images.ottplay.com") || url.endsWith(".svg")) return url;

    // Strip any existing query string before adding our own
    const base = url.split("?")[0];
    const width = variant === "mobile" ? 150 : 300;
    return `${base}?impolicy=ottplay-202501_high&width=${width}`;
}

export function getOptimizedVerticalImage(url, variant = "desktop") {
    if (!url) return null;
    // Only transform ottplay CDN images; skip SVGs and other domains
    if (!url.includes("images.ottplay.com") || url.endsWith(".svg")) return url;

    // Strip any existing query string before adding our own
    const base = url.split("?")[0];
    const width = variant === "mobile" ? 150 : 200;
    return `${base}?impolicy=ottplay-202501_high&width=${width}`;
}

export function getOptimizedHorizontalImageUrl(url, variant = "desktop") {
    if (!url) return null;
    // Only transform ottplay CDN images; skip SVGs and other domains
    if (!url.includes("images.ottplay.com") || url.endsWith(".svg")) return url;

    // Strip any existing query string before adding our own
    const base = url.split("?")[0];
    const width = variant === "mobile" ? 200 : 400;
    return `${base}?impolicy=ottplay-202501_high&width=${width}`;
}