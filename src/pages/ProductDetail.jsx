import { useParams, Link } from "react-router-dom"; // removed unused useNavigate
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { getProductById, getProductsByCategory } from "../data/products";
import toast from "react-hot-toast";
import Button from "../components/Button";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart, toggleFavorite, isFavorite } = useCart();

    // Get the product
    const product = getProductById(id);

    // Local state
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // Early return for 404 - all hooks are above this (Rules of Hooks safe)
    if (!product) {
        return (
            <div className="max-w-7xl mx-auto text-center py-16">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Product Not Found
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-8">
                    Sorry, we couldn't find the product you're looking for.
                </p>
                <Button
                    as={Link}
                    to="/"
                    variant="primary"
                    className="px-8 py-3"
                >
                    Back to Home
                </Button>
            </div>
        );
    }

    // Related products
    const relatedProducts = getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 4);

    // Handlers
    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        addToCart(product, quantity);

        // Better plural handling
        const itemText =
            quantity === 1 ? product.name : `${quantity} ${product.name}s`;
        toast.success(`${itemText} added to cart!`, {
            duration: 2000,
            icon: "🛒",
        });

        setIsAdding(false);
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
                        <div className="relative w-full overflow-hidden bg-gray-100 rounded-2xl">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-auto object-contain p-8 bg-gray-50"
                                width="1200"
                                height="1200"
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

                            {/* Stock Badges */}
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
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                        {product.category}
                    </div>

                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {product.name}
                    </h1>

                    {product.brand && (
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                            Brand:{" "}
                            <span className="font-semibold">
                                {product.brand}
                            </span>
                        </p>
                    )}

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

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-orange-400">
                            ${product.price}
                        </span>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                            Description
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

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
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-12 h-12 !p-0 rounded-l-lg text-2xl font-bold"
                                    >
                                        −
                                    </Button>
                                    <span className="px-8 py-3 font-semibold text-lg min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="w-12 h-12 !p-0 rounded-r-lg text-2xl font-bold"
                                    >
                                        +
                                    </Button>
                                </div>
                                <span className="text-gray-500">
                                    {product.stock} available
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button - now perfectly consistent */}
                    <div className="flex gap-4 mb-8">
                        <Button
                            onClick={handleAddToCart}
                            loading={isAdding}
                            loadingText="Adding to cart..."
                            disabled={product.stock === 0}
                            variant={
                                product.stock > 0 ? "primary" : "secondary"
                            }
                            className="flex-1 text-lg py-4"
                        >
                            {product.stock > 0
                                ? "🛒 Add to Cart"
                                : "Out of Stock"}
                        </Button>
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
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
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
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 line-clamp-1">
                                            {relatedProduct.name}
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-orange-400">
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
