import { useState, useMemo } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

function Home() {
    const [isLoading, setIsLoading] = useState(false);

    // Show loading when needed
    if (isLoading) {
        return <LoadingSpinner text="Loading products..." />;
    }

    const { addToCart, toggleFavorite, isFavorite } = useCart();

    // Filter state
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: "", max: "" },
        sortBy: "",
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Filter and sort products
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
    }, [products, searchQuery, filters]);

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            categories: [],
            priceRange: { min: "", max: "" },
            sortBy: "",
        });
        setSearchQuery("");
    };

    // Add to cart handler
    const [addingToCart, setAddingToCart] = useState(null);
    const handleAddToCart = async (product) => {
        setAddingToCart(product.id); // Start loading for this product

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            duration: 2000,
            icon: "🛒",
        });

        setAddingToCart(null); // Stop loading
    };

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
                        // SHOW SKELETONS WHILE LOADING
                        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        // No results message
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">😕</div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                                No products found
                            </h3>
                            <p className="text-sm sm:text-basetext-gray-600 mb-6">
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
                                <div
                                    key={product.id}
                                    className="product-card group"
                                >
                                    {/* Favorite button  */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <span className="text-xl">
                                            {isFavorite(product.id)
                                                ? "❤️"
                                                : "🤍"}
                                        </span>
                                    </button>

                                    {/* Product Image */}
                                    <Link to={`/product/${product.id}`}>
                                        <div className="relative h-64 sm:h-72 md:h-64 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />

                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Stock badges */}
                                            {product.stock <= 5 &&
                                                product.stock > 0 && (
                                                    <span className="badge badge-warning absolute top-3 right-3">
                                                        Only {product.stock}{" "}
                                                        left!
                                                    </span>
                                                )}
                                            {product.stock === 0 && (
                                                <span className="badge badge-error absolute top-3 right-3">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4 sm:p-5">
                                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                                            {product.category}
                                        </div>

                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                                            {product.description}
                                        </p>

                                        {/* Price and Rating  */}
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <span className="text-xl sm:text-2xl  font-bold text-orange-500">
                                                    ${product.price}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                                <span>⭐</span>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Button with ripple effect */}
                                        <button
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={product.stock === 0}
                                            className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all ripple ${
                                                product.stock > 0
                                                    ? "btn-primary btn-lift"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            {product.stock > 0
                                                ? "🛒 Add to Cart"
                                                : "Out of Stock"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
