import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail"; // Add this import

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="p-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route
                        path="/product/:id"
                        element={<ProductDetail />}
                    />{" "}
                </Routes>
            </main>
        </div>
    );
}

export default App;
