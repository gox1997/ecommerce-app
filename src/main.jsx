import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom"; // ADD THIS

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            {" "}
            {/* WRAP EVERYTHING IN BrowserRouter */}
            <CartProvider>
                <App />
            </CartProvider>
        </BrowserRouter>
    </StrictMode>,
);
