import {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
    useCallback,
} from "react";

/**
 * CONTEXT OPTIMIZATION EXPLAINED:
 * ================================
 *
 * THE CRITICAL PROBLEM WITH CONTEXT:
 *
 * When you use React Context, every component that consumes the context
 * re-renders when ANY value in the context changes. This is a huge
 * performance problem!
 *
 * Example of the problem:
 * - User adds item to cart
 * - cart state changes
 * - value object gets recreated (new reference!)
 * - ALL components using useCart() re-render
 * - This includes your entire Home page with all product cards!
 *
 * The fix requires understanding TWO concepts together:
 *
 * 1. useMemo for the value object
 *    - Keeps the same object reference unless dependencies change
 *    - Prevents unnecessary context updates
 *
 * 2. useCallback for all functions
 *    - Keeps function references stable
 *    - Ensures they don't cause the useMemo to recreate the value
 */

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    /**
     * USECALLBACK FOR ALL CONTEXT FUNCTIONS:
     * =======================================
     *
     * Why we need useCallback here:
     *
     * Without it:
     * Every time CartProvider re-renders (which happens when cart/favorites change),
     * ALL these functions get recreated with new references. This causes the
     * useMemo'd value object below to think something changed, recreating it,
     * which triggers re-renders in ALL consuming components.
     *
     * With useCallback:
     * Functions keep the same reference across renders. Only the ones that
     * actually depend on changing state get recreated when needed.
     */

    const addToCart = useCallback((product, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id,
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
    }, []); // No dependencies - uses setCart callback form

    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart((prevCart) =>
                prevCart.filter((item) => item.id !== productId),
            );
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item,
            ),
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    /**
     * USEMEMO FOR COMPUTED VALUES:
     * =============================
     *
     * These functions calculate values from cart state.
     * We memoize them so they only recalculate when cart changes.
     *
     * Before: getCartCount() ran on EVERY render
     * After: getCartCount is recalculated only when cart changes
     */
    const getCartCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const getCartSubtotal = useMemo(() => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    }, [cart]);

    const getCartTotal = useMemo(() => {
        const subtotal = getCartSubtotal;
        const tax = subtotal * 0.25;
        const shipping = subtotal > 50 ? 0 : 10;
        return subtotal + tax + shipping;
    }, [getCartSubtotal]);

    // Favorites functions
    const addToFavorites = useCallback((productId) => {
        setFavorites((prev) => {
            if (prev.includes(productId)) {
                return prev;
            }
            return [...prev, productId];
        });
    }, []);

    const removeFromFavorites = useCallback((productId) => {
        setFavorites((prev) => prev.filter((id) => id !== productId));
    }, []);

    const toggleFavorite = useCallback((productId) => {
        setFavorites((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            }
            return [...prev, productId];
        });
    }, []);

    /**
     * For isFavorite, we return a function instead of memoizing each call.
     * This is because we can't predict which productIds will be checked.
     * The function itself is stable (useCallback), so it won't cause re-renders.
     */
    const isFavorite = useCallback(
        (productId) => {
            return favorites.includes(productId);
        },
        [favorites],
    );

    /**
     * THE CRITICAL OPTIMIZATION - MEMOIZED CONTEXT VALUE:
     * ====================================================
     *
     * This is the most important part!
     *
     * Without useMemo:
     * Every render creates a new object { cart, favorites, addToCart, ... }
     * React sees: oldValue !== newValue (different object references)
     * React re-renders ALL consumers, even if nothing actually changed
     *
     * With useMemo:
     * The object is only recreated when dependencies change
     * If only cart changes, we get a new object (expected)
     * If something else re-renders CartProvider, we keep the same object
     *
     * Dependencies: [cart, favorites, ...all our functions]
     * - cart: needs to be here, changes when items added/removed
     * - favorites: needs to be here, changes when favorites toggled
     * - All functions: useCallback keeps them stable, so won't trigger updates
     * - Computed values: useMemo keeps them stable until cart changes
     */
    const value = useMemo(
        () => ({
            cart,
            favorites,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartCount, // This is now a VALUE not a function
            getCartSubtotal, // This is now a VALUE not a function
            getCartTotal, // This is now a VALUE not a function
            addToFavorites,
            removeFromFavorites,
            toggleFavorite,
            isFavorite,
        }),
        [
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
        ],
    );

    /**
     * IMPORTANT NOTE ABOUT THE API CHANGE:
     * =====================================
     *
     * In the old version, you called: getCartCount()
     * In this version, you use: getCartCount (no parentheses!)
     *
     * This is because they're now VALUES computed with useMemo,
     * not FUNCTIONS that run on every call.
     *
     * Benefits:
     * - No repeated calculations
     * - Values update automatically when cart changes
     * - Much better performance
     *
     * You'll need to update code like this:
     * OLD: {getCartCount()}
     * NEW: {getCartCount}
     */

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}
