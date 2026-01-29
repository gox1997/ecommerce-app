import { useState, useMemo } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

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
                <h2 className="text-2xl font-bold">
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
                    {filteredProducts.length === 0 ? (
                        // No results message
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">😕</div>
                            <h3 className="text-2xl font-bold mb-2">
                                No products found
                            </h3>
                            <p className="mb-6">
                                Try adjusting your filters or search query
                            </p>
                            <Button
                                onClick={handleClearFilters}
                                className="font-semibold px-6 py-3 rounded-lg transition-colors"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                    {/* Favorite button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
                                    >
                                        <span className="text-xl">
                                            {isFavorite(product.id)
                                                ? "❤️"
                                                : "🤍"}
                                        </span>
                                    </button>

                                    {/* Product Image */}
                                    <Link to={`/product/${product.id}`}>
                                        <div className="relative h-64 overflow-hidden group cursor-pointer">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />

                                            {/* Stock badges */}
                                            {product.stock <= 5 &&
                                                product.stock > 0 && (
                                                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                                        Only {product.stock}{" "}
                                                        left!
                                                    </span>
                                                )}
                                            {product.stock === 0 && (
                                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <div className="text-xs  uppercase mb-1">
                                            {product.category}
                                        </div>
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-blue-600">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className=" text-sm mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Price and Rating */}
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-2xl font-bold text-blue-600">
                                                ${product.price}
                                            </span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 mr-1">
                                                    ⭐
                                                </span>
                                                <span className="text-sm text-#1f241f">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <Button
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            loading={
                                                addingToCart === product.id
                                            }
                                            disabled={product.stock === 0}
                                            variant={
                                                product.stock > 0
                                                    ? "primary"
                                                    : "secondary"
                                            }
                                            className="w-full"
                                        >
                                            {product.stock > 0
                                                ? "🛒 Add to Cart"
                                                : "Out of Stock"}
                                        </Button>
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
