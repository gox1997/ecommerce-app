import { products } from "./data/products";
import { useCart } from "./context/CartContext";

function App() {
    const { addToCart, cart, toggleFavorite, isFavorite } = useCart();

    // Handler for add to cart button
    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header with cart count */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            🛒 E-commerce Store
                        </h1>
                        <p className="text-gray-600">
                            Browse our collection of {products.length} amazing
                            products
                        </p>
                    </div>

                    {/* Cart indicator */}
                    <div className="flex items-center gap-4">
                        <button className="relative">
                            <span className="text-3xl">🛒</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {cart.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    )}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="relative h-64 overflow-hidden group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />

                                {/* Favorite button */}
                                <button
                                    onClick={() => toggleFavorite(product.id)}
                                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                                >
                                    <span className="text-xl">
                                        {isFavorite(product.id) ? "❤️" : "🤍"}
                                    </span>
                                </button>

                                {/* Stock badges */}
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        Only {product.stock} left!
                                    </span>
                                )}
                                {product.stock === 0 && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="text-xs text-gray-500 uppercase mb-1">
                                    {product.category}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
                                        <span className="text-sm text-gray-600">
                                            {product.rating}
                                        </span>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                        product.stock > 0
                                            ? "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                    disabled={product.stock === 0}
                                >
                                    {product.stock > 0
                                        ? "🛒 Add to Cart"
                                        : "Out of Stock"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
