import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
    const { cart, removeFromCart, updateQuantity, getCartSubtotal, clearCart } =
        useCart();

    // Calculate totals
    const subtotal = getCartSubtotal();
    const tax = subtotal * 0.25; // 25% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Handle quantity change
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    // Empty cart message
    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Shopping Cart ({cart.length}{" "}
                {cart.length === 1 ? "item" : "items"})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                        >
                            {/* Product Image */}
                            <Link to={`/product/${item.id}`}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                                />
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1">
                                <Link to={`/product/${item.id}`}>
                                    <h3 className="font-semibold text-lg text-gray-800 hover:text-blue-600 mb-1">
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-500 mb-2">
                                    {item.category}
                                </p>
                                <p className="text-xl font-bold text-blue-600">
                                    ${item.price}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                >
                                    Remove
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity - 1,
                                            )
                                        }
                                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity + 1,
                                            )
                                        }
                                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                        disabled={item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600">
                                    Subtotal: $
                                    {(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Clear Cart Button */}
                    <button
                        onClick={clearCart}
                        className="w-full py-2 text-red-500 hover:text-red-700 font-semibold"
                    >
                        Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (25%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600 font-semibold">
                                            FREE
                                        </span>
                                    ) : (
                                        `$${shipping.toFixed(2)}`
                                    )}
                                </span>
                            </div>

                            {subtotal < 50 && subtotal > 0 && (
                                <p className="text-sm text-orange-600">
                                    Add ${(50 - subtotal).toFixed(2)} more for
                                    free shipping!
                                </p>
                            )}

                            <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <Link to="/checkout">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3">
                                Proceed to Checkout
                            </button>
                        </Link>

                        <Link
                            to="/"
                            className="block text-center text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
