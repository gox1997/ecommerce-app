import { useState, useRef, useEffect } from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const timeoutRef = useRef(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Handle search input with proper debouncing
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearch(value);

        // Clear previous timeout to avoid memory leak
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            setSearchQuery(value);
        }, 300);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setLocalSearch("");
        setSearchQuery("");

        // Clear any pending timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    return (
        <div className="relative">
            <label htmlFor="product-search" className="sr-only">
                Search products
            </label>
            <div className="relative">
                <span
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                >
                    🔍
                </span>
                <input
                    id="product-search"
                    type="search"
                    value={localSearch}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    aria-label="Search for products by name, category, or brand"
                />
                {localSearch && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
