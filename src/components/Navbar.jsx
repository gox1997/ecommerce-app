import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { FcShop } from "react-icons/fc";

function Navbar() {
    const { getCartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
                isScrolled ? "shadow-lg" : "shadow-md"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 py-2 sm:py-4">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <FcShop className="size-10 group-hover:scale-110 transition-transform" />

                        <span className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Shop
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-blue-600 font-semibold transition-colors relative group"
                        >
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </Link>

                        <Link
                            to="/orders"
                            className="text-gray-600 hover:text-blue-600 font-semibold transition-colors relative group hidden sm:block"
                        >
                            Orders
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </Link>

                        <Link
                            to="/cart"
                            className="relative hover:scale-110 transition-transform"
                        >
                            <span className="text-3xl">🛒</span>
                            {getCartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center scale-in animate-pulse-slow">
                                    {getCartCount}
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
