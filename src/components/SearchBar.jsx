import { useState } from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Handle search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearch(value);

        // Debounce: update parent after user stops typing
        setTimeout(() => {
            setSearchQuery(value);
        }, 300);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setLocalSearch("");
        setSearchQuery("");
    };

    return (
        <div className="relative">
            <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                </span>
                <input
                    type="text"
                    value={localSearch}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                />
                {localSearch && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
