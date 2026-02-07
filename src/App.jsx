import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            <Navbar />

            <main className="p-2 sm:p-4 md:p-6 lg:p-8">
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <LoadingSpinner size="lg" text="Loading page..." />
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route
                            path="/product/:id"
                            element={<ProductDetail />}
                        />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route
                            path="/order-success"
                            element={<OrderSuccess />}
                        />
                        <Route path="/orders" element={<OrderHistory />} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
}

export default App;
