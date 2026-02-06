import { useState, useMemo, useEffect, useCallback } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ProductCard from "../components/ProductCard";

function Home() {
    const { addToCart, toggleFavorite, isFavorite } = useCart();

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: "", max: "" },
        sortBy: "",
    });
    const [addingToCart, setAddingToCart] = useState(null);

    // Show spinner ONLY when filters or search actually change
    useEffect(() => {
        if (
            filters.categories.length === 0 &&
            filters.priceRange.min === "" &&
            filters.priceRange.max === "" &&
            filters.sortBy === "" &&
            searchQuery === ""
        ) {
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [filters, searchQuery]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Apply search
        if (searchQuery) {
            result = result.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.category
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (product.brand &&
                        product.brand
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())),
            );
        }

        // Apply category filter
        if (filters.categories.length > 0) {
            result = result.filter((product) =>
                filters.categories.includes(product.category),
            );
        }

        // Apply price range filter
        if (filters.priceRange.min !== "") {
            result = result.filter(
                (product) => product.price >= filters.priceRange.min,
            );
        }
        if (filters.priceRange.max !== "") {
            result = result.filter(
                (product) => product.price <= filters.priceRange.max,
            );
        }

        // Apply sorting
        if (filters.sortBy) {
            result.sort((a, b) => {
                switch (filters.sortBy) {
                    case "price-asc":
                        return a.price - b.price;
                    case "price-desc":
                        return b.price - a.price;
                    case "name-asc":
                        return a.name.localeCompare(b.name);
                    case "name-desc":
                        return b.name.localeCompare(a.name);
                    case "rating-desc":
                        return b.rating - a.rating;
                    default:
                        return 0;
                }
            });
        }

        return result;
    }, [searchQuery, filters]);

    const handleClearFilters = useCallback(() => {
        setFilters({
            categories: [],
            priceRange: { min: "", max: "" },
            sortBy: "",
        });
        setSearchQuery("");
    }, []); // Empty deps = function never changes

    /**
     * This function needs to stay stable across renders because:
     * 1. It's passed to ProductCard (which is memoized)
     * 2. We don't want ProductCards to re-render when this reference changes
     *
     * Dependencies: [addToCart]
     * - Only recreate if addToCart changes (which it won't from CartContext)
     */
    const handleAddToCart = useCallback(
        async (product) => {
            setAddingToCart(product.id);
            await new Promise((resolve) => setTimeout(resolve, 500));
            addToCart(product);
            toast.success(`${product.name} added to cart!`, {
                duration: 2000,
                icon: "🛒",
            });
            setAddingToCart(null);
        },
        [addToCart], // Only recreate if addToCart changes
    );

    const handleToggleFavorite = useCallback(
        (productId) => {
            toggleFavorite(productId);
        },
        [toggleFavorite],
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    Products
                    <span className="text-lg font-normal ml-2">
                        ({filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "item" : "items"})
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <Filters
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">😕</div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                                No products found
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                Try adjusting your filters or search query
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isFavorite={isFavorite(product.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    onAddToCart={handleAddToCart}
                                    isAddingToCart={addingToCart === product.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
