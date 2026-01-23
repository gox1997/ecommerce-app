import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { getProductById, getProductsByCategory } from "../data/products";

function ProductDetail() {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate();
    const { addToCart, toggleFavorite, isFavorite } = useCart();

    // Get the product
    const product = getProductById(id);

    // Local state for quantity selector
    const [quantity, setQuantity] = useState(1);

    // If product not found
    if (!product) {
        return (
            <div className="max-w-7xl mx-auto text-center py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Product Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    Sorry, we couldn't find the product you're looking for.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    // Get related products (same category, excluding current)
    const relatedProducts = getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 4);

    // Handle quantity change
    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    // Handle add to cart
    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Show success message and redirect after short delay
        alert(`${quantity} ${product.name}(s) added to cart!`);
        // Optional: navigate to cart
        // navigate('/cart');
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="mb-8 text-sm">
                <ol className="flex items-center gap-2 text-gray-600">
                    <li>
                        <Link to="/" className="hover:text-blue-600">
                            Home
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="capitalize">
                        <span className="hover:text-blue-600 cursor-pointer">
                            {product.category}
                        </span>
                    </li>
                    <li>/</li>
                    <li className="text-gray-800 font-semibold">
                        {product.name}
                    </li>
                </ol>
            </nav>

            {/* Product Detail Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Left Column - Image */}
                <div className="relative">
                    <div className="sticky top-24">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[500px] object-cover"
                            />

                            {/* Favorite Button */}
                            <button
                                onClick={() => toggleFavorite(product.id)}
                                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
                            >
                                <span className="text-2xl">
                                    {isFavorite(product.id) ? "❤️" : "🤍"}
                                </span>
                            </button>

                            {/* Stock Badge */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Only {product.stock} left!
                                </div>
                            )}
                            {product.stock === 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Out of Stock
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div>
                    {/* Category */}
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                        {product.category}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {product.name}
                    </h1>

                    {/* Brand */}
                    {product.brand && (
                        <p className="text-gray-600 mb-4">
                            Brand:{" "}
                            <span className="font-semibold">
                                {product.brand}
                            </span>
                        </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center">
                            <span className="text-yellow-400 text-xl mr-1">
                                ⭐
                            </span>
                            <span className="text-lg font-semibold">
                                {product.rating}
                            </span>
                            <span className="text-gray-500 ml-1">/ 5</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                            {Math.floor(Math.random() * 100 + 20)} reviews
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <span className="text-4xl font-bold text-blue-600">
                            ${product.price}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Availability:
                            </span>
                            {product.stock > 0 ? (
                                <span className="text-green-600 font-semibold">
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-semibold">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-4 py-3 hover:bg-gray-100 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <span className="text-xl font-bold">
                                            −
                                        </span>
                                    </button>
                                    <span className="px-6 py-3 font-semibold text-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-4 py-3 hover:bg-gray-100 transition-colors"
                                        disabled={quantity >= product.stock}
                                    >
                                        <span className="text-xl font-bold">
                                            +
                                        </span>
                                    </button>
                                </div>
                                <span className="text-gray-500">
                                    {product.stock} available
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`flex-1 py-4 px-8 rounded-lg font-semibold text-lg transition-all ${
                                product.stock > 0
                                    ? "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {product.stock > 0
                                ? "🛒 Add to Cart"
                                : "Out of Stock"}
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t pt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>🚚</span>
                            <span>Free shipping on orders over $50</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>↩️</span>
                            <span>30-day return policy</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>🔒</span>
                            <span>Secure payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="border-t pt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Related Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                key={relatedProduct.id}
                                to={`/product/${relatedProduct.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                                            {relatedProduct.name}
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-blue-600">
                                                ${relatedProduct.price}
                                            </span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 text-sm mr-1">
                                                    ⭐
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {relatedProduct.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;
