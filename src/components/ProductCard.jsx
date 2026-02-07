import { memo } from "react";
import { Link } from "react-router-dom";

function ProductCard({
    product,
    isFavorite,
    onToggleFavorite,
    onAddToCart,
    isAddingToCart,
}) {
    return (
        <div className="product-card group">
            {/* Favorite button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                }}
                className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
            >
                <span className="text-xl">{isFavorite ? "❤️" : "🤍"}</span>
            </button>

            {/* Product Image */}
            <Link to={`/product/${product.id}`}>
                <div className="relative h-44 sm:h-72 md:h-64 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        loading="lazy"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Stock badges */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="badge badge-warning absolute top-3 right-3">
                            Only {product.stock} left!
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

                <Link
                    to={`/product/${product.id}`}
                    title={product.name}
                    className="block"
                >
                    <h3 className="line-clamp-1 font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Price and Rating */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-sm sm:text-xl font-bold text-orange-500">
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
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0 || isAddingToCart}
                    className={`text-base w-full px-1 py-1 pr-2 sm:px-2 sm:py-2 rounded-lg font-semibold transition-all ripple ${
                        product.stock > 0
                            ? "btn-primary btn-lift"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {isAddingToCart
                        ? "Adding..."
                        : product.stock > 0
                          ? "🛒 Add to Cart"
                          : "Out of Stock"}
                </button>
            </div>
        </div>
    );
}

export default memo(ProductCard);
