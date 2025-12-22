// Format price to currency
export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

// Calculate discount price
export const calculateDiscount = (price, discountPercent) => {
    return price - (price * discountPercent) / 100;
};

// Generate star rating display
export const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
        full: fullStars,
        half: hasHalfStar ? 1 : 0,
        empty: emptyStars,
    };
};

// Truncate long text
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

// Check if product is in stock
export const isInStock = (stock) => {
    return stock > 0;
};

// Get stock status message
export const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return `Only ${stock} left!`;
    return "In Stock";
};
