import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        // Sort by date, newest first
        setOrders(savedOrders.sort((a, b) => b.id - a.id));
    }, []);

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    No Orders Yet
                </h2>
                <p className="text-gray-600 mb-8">
                    You haven't placed any orders. Start shopping!
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                Order History
            </h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-4 pb-4 border-b">
                            <div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                                    Order #{order.id}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600">
                                    {formatDate(order.date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-orange-500">
                                    ${order.total.toFixed(2)}
                                </p>
                                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                                    Completed
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-3">
                                Items:
                            </h4>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 items-center"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <Link
                                                to={`/product/${item.id}`}
                                                className="font-semibold text-gray-800 hover:text-blue-600"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                Quantity: {item.quantity} × $
                                                {item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-orange-400">
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-700 mb-2">
                                Shipping Address:
                            </h4>
                            <p className="text-gray-600">
                                {order.shipping.fullName}
                            </p>
                            <p className="text-gray-600">
                                {order.shipping.address}
                            </p>
                            <p className="text-gray-600">
                                {order.shipping.city}, {order.shipping.zipCode}
                            </p>
                            <p className="text-gray-600">
                                {order.shipping.country}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderHistory;
