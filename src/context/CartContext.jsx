import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const CartContext = createContext();

// Create provider component
export function CartProvider({ children }) {
    // State for cart items
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on initial render
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // State for favorites
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            // Check if product already exists in cart
            const existingItem = prevCart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                // If exists, increase quantity
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // If doesn't exist, add new item
                return [...prevCart, { ...product, quantity }];
            }
        });
    };

    // Remove item from cart completely
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Update quantity of specific item
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
    };

    // Get total number of items in cart
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Get cart subtotal (before tax/shipping)
    const getCartSubtotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // Calculate cart total with tax and shipping
    const getCartTotal = () => {
        const subtotal = getCartSubtotal();
        const tax = subtotal * 0.1; // 10% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        return subtotal + tax + shipping;
    };

    // Add to favorites
    const addToFavorites = (productId) => {
        setFavorites((prev) => {
            if (prev.includes(productId)) {
                return prev; // Already in favorites
            }
            return [...prev, productId];
        });
    };

    // Remove from favorites
    const removeFromFavorites = (productId) => {
        setFavorites((prev) => prev.filter((id) => id !== productId));
    };

    // Toggle favorite
    const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
            removeFromFavorites(productId);
        } else {
            addToFavorites(productId);
        }
    };

    // Check if item is in favorites
    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };

    // Value object with all functions and state
    const value = {
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartSubtotal,
        getCartTotal,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

// Custom hook to use cart context
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}
