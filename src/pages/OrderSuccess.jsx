import { useLocation, Link, Navigate } from "react-router-dom";

function OrderSuccess() {
    const location = useLocation();
    const order = location.state?.order;

    // Redirect if no order data
    if (!order) {
        return <Navigate to="/" replace />;
    }

    const subtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const tax = subtotal * 0.25;
    const shipping = subtotal > 50 ? 0 : 10;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-5xl">✓</span>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. We've sent a confirmation email
                    to{" "}
                    <span className="font-semibold">
                        {order.shipping.email}
                    </span>
                </p>

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Order Details
                        </h2>
                        <span className="text-sm text-gray-600">
                            Order #{order.id}
                        </span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <div className="flex gap-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-semibold text-orange-400">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>
                                {shipping === 0
                                    ? "FREE"
                                    : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total</span>
                            <span className="text-orange-500">
                                ${order.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semiboldtext-gray-800 mb-3">
                        Shipping Address
                    </h3>
                    <p className="text-gray-700">{order.shipping.fullName}</p>
                    <p className="text-gray-600">{order.shipping.address}</p>
                    <p className="text-gray-600">
                        {order.shipping.city}, {order.shipping.zipCode}
                    </p>
                    <p className="text-gray-600">{order.shipping.country}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Link
                        to="/"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
