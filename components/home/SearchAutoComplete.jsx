"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { fetchSearchContent } from "@/lib/api/ottplay";

export function SearchAutocomplete() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const getItemLink = (item) => {
        if (item.content_type === "movie") return "/movie/" + item.seo_url;
        if (item.content_type === "show") return "/show/" + item.seo_url;
        if (item.content_type === "sport")
            return "/sports/" + item.format + "/" + item.seo_url;
        return "#";
    };

    const fetchAutocomplete = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchSearchContent({
                query: searchQuery,
            });

            const transformedResults = (response.result || []).map((item) => ({
                id: item._id || item.ottplay_id || item.name,
                title: item.name || item.title || "",
                type: item.content_type || "content",
                image: item.imageurl || item.posters?.[0] || "",
                url: getItemLink(item),
            }));

            setResults(transformedResults);
            setIsOpen(true);
            setSelectedIndex(-1);
        } catch (error) {
            console.error("Error fetching autocomplete results:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle input change with debouncing
     * Waits 300ms after user stops typing before making API call
     */
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Clear previous debounce timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new debounce timer
        debounceTimer.current = setTimeout(() => {
            fetchAutocomplete(value);
        }, 300);
    };

    const handleSearchSubmit = () => {
        if (query.trim()) {
            setTimeout(() => {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                setIsOpen(false);
            }, 0);
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "Enter") {
                handleSearchSubmit();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : prev,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    // If a result is selected, navigate to search results
                    handleSearchSubmit();
                } else {
                    // Otherwise, submit the search query
                    handleSearchSubmit();
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;

            // Don't close if clicking inside dropdown or on input
            if (
                dropdownRef.current?.contains(target) ||
                inputRef.current?.contains(target)
            ) {
                return;
            }

            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Display maximum 5 results in the dropdown
    const displayedResults = results.slice(0, 5);
    const hasMoreResults = results.length > 5;

    return (
        <div className="w-full max-w-2xl mx-auto relative">
            {/* Search Input Field */}
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Search movies, shows, and more..."
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query && setIsOpen(true)}
                        className="pl-10 pr-4 py-2 text-base"
                    />
                    {isLoading && (
                        <Loader2 className="absolute right-3 w-5 h-5 text-muted-foreground animate-spin" />
                    )}
                </div>

                {/* Autocomplete Dropdown */}
                {isOpen && (query.trim() || isLoading) && (
                    <Card
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-2 p-0 z-50 shadow-lg border"
                    >
                        {isLoading && results.length === 0 ? (
                            // Loading state
                            <div className="p-4 text-center text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                Loading suggestions...
                            </div>
                        ) : results.length === 0 ? (
                            // No results state
                            <div className="p-4 text-center text-muted-foreground">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <>
                                {/* Scrollable Results Area - Max 5 items visible */}
                                <ScrollArea className="max-h-80 overflow-y-scroll">
                                    <div className="divide-y">
                                        {displayedResults.map(
                                            (result, index) => (
                                                <div
                                                    key={result.id}
                                                    className={`p-3 cursor-pointer transition-colors ${
                                                        index === selectedIndex
                                                            ? "bg-accent"
                                                            : "hover:bg-accent/50"
                                                    }`}
                                                    onClick={() => {
                                                        setQuery(result.title);
                                                        handleSearchSubmit();
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Result Image Thumbnail */}
                                                        {result.image && (
                                                            <img
                                                                src={
                                                                    result.image
                                                                }
                                                                alt={
                                                                    result.title
                                                                }
                                                                className="w-10 h-14 object-cover rounded shrink-0"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    // Hide image if it fails to load
                                                                    e.target.style.display =
                                                                        "none";
                                                                }}
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            {/* Result Title */}
                                                            <p className="font-medium text-sm truncate">
                                                                {result.title}
                                                            </p>
                                                            {/* Result Type Badge */}
                                                            {result.type && (
                                                                <p className="text-xs text-muted-foreground capitalize">
                                                                    {
                                                                        result.type
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </ScrollArea>

                                {/* "See all search results" Button */}
                                <div className="border-t">
                                    <Button
                                        onClick={handleSearchSubmit}
                                        variant="outline"
                                        className="w-full justify-center whitespace-break-spaces hover:text-white"
                                    >
                                        See all search results for "{query}"
                                    </Button>
                                </div>

                                {/* Info about additional results */}
                                {hasMoreResults && (
                                    <div className="px-3 py-2 mb-3 text-xs text-muted-foreground text-center border-t">
                                        {results.length - 5} more results
                                        available
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}
