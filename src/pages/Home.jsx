import { useState, useMemo, useCallback } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

function Home() {
    const { addToCart, toggleFavorite, isFavorite } = useCart();

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: "", max: "" },
        sortBy: "",
    });
    const [addingToCart, setAddingToCart] = useState(null);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    (product.brand &&
                        product.brand.toLowerCase().includes(query)),
            );
        }

        if (filters.categories.length > 0) {
            result = result.filter((product) =>
                filters.categories.includes(product.category),
            );
        }

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
    }, []);

    const handleAddToCart = useCallback(
        async (product) => {
            setAddingToCart(product.id);
            await new Promise((resolve) => setTimeout(resolve, 400));
            addToCart(product);
            toast.success(`${product.name} added to cart!`, {
                duration: 2000,
                icon: "🛒",
            });
            setAddingToCart(null);
        },
        [addToCart],
    );

    const handleToggleFavorite = useCallback(
        (productId) => {
            toggleFavorite(productId);
        },
        [toggleFavorite],
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    Products
                    <span className="text-lg font-normal ml-2 text-gray-600">
                        ({filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "item" : "items"})
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <Filters
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                <div className="lg:col-span-3">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">😕</div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                                No products found
                            </h3>
                            <p className="text-sm sm:text-base text-gray-800 mb-6">
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
