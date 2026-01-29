import { getCategories } from "../data/products";

function Filters({ filters, setFilters, onClearFilters }) {
    const categories = getCategories();

    // Handle category toggle
    const handleCategoryToggle = (category) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    // Handle price range change
    const handlePriceChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value === "" ? "" : Number(value),
            },
        }));
    };

    // Handle sort change
    const handleSortChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            sortBy: e.target.value,
        }));
    };

    return (
        <div className="bg-[#dee2e6] rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                    Clear All
                </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                    Categories
                </h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label
                            key={category}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 capitalize">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                    Price Range
                </h3>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-xs text-gray-600 mb-1 block">
                            Min ($)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={filters.priceRange.min}
                            onChange={(e) =>
                                handlePriceChange("min", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-600 mb-1 block">
                            Max ($)
                        </label>
                        <input
                            type="number"
                            placeholder="999"
                            value={filters.priceRange.max}
                            onChange={(e) =>
                                handlePriceChange("max", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Sort By */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                    Sort By
                </h3>
                <select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="rating-desc">Rating: High to Low</option>
                </select>
            </div>

            {/* Active Filters Count */}
            {(filters.categories.length > 0 ||
                filters.priceRange.min !== "" ||
                filters.priceRange.max !== "" ||
                filters.sortBy !== "") && (
                <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                        {filters.categories.length +
                            (filters.priceRange.min !== "" ? 1 : 0) +
                            (filters.priceRange.max !== "" ? 1 : 0) +
                            (filters.sortBy !== "" ? 1 : 0)}{" "}
                        filter(s) active
                    </p>
                </div>
            )}
        </div>
    );
}

export default Filters;
