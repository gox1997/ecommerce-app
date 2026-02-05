export const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "electronics",
        image: "/products/headphones.jpg",
        description:
            "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        rating: 4.5,
        stock: 25,
        brand: "AudioTech",
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "/products/smartwatch.jpg",
        description:
            "Fitness tracking smart watch with heart rate monitor and GPS.",
        rating: 4.7,
        stock: 15,
        brand: "FitPro",
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 89.99,
        category: "sports",
        image: "/products/shoes.jpg",
        description:
            "Comfortable running shoes with cushioned sole and breathable fabric.",
        rating: 4.3,
        stock: 30,
        brand: "RunFast",
    },
    {
        id: 4,
        name: "Laptop Backpack",
        price: 49.99,
        category: "accessories",
        image: "/products/laptop-backpack.jpg",
        description:
            "Durable laptop backpack with multiple compartments and USB charging port.",
        rating: 4.6,
        stock: 20,
        brand: "TravelPro",
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 129.99,
        category: "home",
        image: "/products/coffee-maker.jpg",
        description:
            "Programmable coffee maker with 12-cup capacity and auto-brew feature.",
        rating: 4.4,
        stock: 12,
        brand: "BrewMaster",
    },
    {
        id: 6,
        name: "Yoga Mat",
        price: 34.99,
        category: "sports",
        image: "/products/yoga-mat.jpg",
        description:
            "Non-slip yoga mat with extra cushioning and carrying strap.",
        rating: 4.8,
        stock: 40,
        brand: "ZenFit",
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        price: 59.99,
        category: "electronics",
        image: "/products/bluetooth-speaker.jpg",
        description:
            "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
        rating: 4.5,
        stock: 18,
        brand: "SoundWave",
    },
    {
        id: 8,
        name: "Desk Lamp",
        price: 39.99,
        category: "home",
        image: "/products/desk-lamp.jpg",
        description:
            "LED desk lamp with adjustable brightness and USB charging port.",
        rating: 4.2,
        stock: 22,
        brand: "LightUp",
    },
    {
        id: 9,
        name: "Water Bottle",
        price: 24.99,
        category: "sports",
        image: "/products/bottle.jpg",
        description:
            "Insulated stainless steel water bottle keeps drinks cold for 24 hours.",
        rating: 4.7,
        stock: 20,
        brand: "HydroMax",
    },
    {
        id: 10,
        name: "Phone Case",
        price: 19.99,
        category: "accessories",
        image: "/products/phone-case.jpg",
        description:
            "Protective phone case with shock absorption and slim design.",
        rating: 4.1,
        stock: 35,
        brand: "ShieldPro",
    },
    {
        id: 11,
        name: "Gaming Mouse",
        price: 69.99,
        category: "electronics",
        image: "/products/computer-mouse.jpg",
        description:
            "RGB gaming mouse with programmable buttons and adjustable DPI.",
        rating: 4.6,
        stock: 28,
        brand: "GamePro",
    },
    {
        id: 12,
        name: "Plant Pot Set",
        price: 29.99,
        category: "home",
        image: "/products/plant-pot-set.jpg",
        description:
            "Set of 3 ceramic plant pots with drainage holes and saucers.",
        rating: 4.4,
        stock: 15,
        brand: "GreenLife",
    },
];

// Helper function to get all unique categories
export const getCategories = () => {
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.sort();
};

// Helper function to get products by category
export const getProductsByCategory = (category) => {
    return products.filter((p) => p.category === category);
};

// Helper function to get product by ID
export const getProductById = (id) => {
    return products.find((p) => p.id === parseInt(id));
};
