import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { getCartCount } = useCart();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-3xl">🛒</span>
                        <span className="text-2xl font-bold text-gray-800">
                            ShopEasy
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                        >
                            Home
                        </Link>

                        <Link
                            to="/orders"
                            className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                        >
                            Orders
                        </Link>
                        <Link
                            to="/cart"
                            className="relative hover:scale-110 transition-transform"
                        >
                            <span className="text-3xl">🛒</span>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
