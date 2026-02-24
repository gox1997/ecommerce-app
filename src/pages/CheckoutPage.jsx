import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Button";

function CheckoutPage() {
    const { cart, getCartSubtotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Redirect if cart is empty
    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Your cart is empty
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-8">
                    Add some items to your cart before checking out.
                </p>
                <Button
                    onClick={() => navigate("/")}
                    variant="primary"
                    className="px-8 py-3"
                >
                    Continue Shopping
                </Button>
            </div>
        );
    }

    // Current step (1, 2, or 3)
    const [currentStep, setCurrentStep] = useState(1);

    // Form data
    const [formData, setFormData] = useState({
        // Shipping Info
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        country: "Croatia",

        // Payment Info (simulated)
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
    });

    // Form errors
    const [errors, setErrors] = useState({});

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Validate Step 1 (Shipping)
    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.zipCode.trim()) {
            newErrors.zipCode = "ZIP code is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fill all required fields");
            return false;
        }
        return true;
    };

    // Validate Step 2 (Payment)
    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = "Card number is required";
        } else if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }

        if (!formData.cardName.trim()) {
            newErrors.cardName = "Cardholder name is required";
        }

        if (!formData.expiryDate.trim()) {
            newErrors.expiryDate = "Expiry date is required";
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Format: MM/YY";
        }

        if (!formData.cvv.trim()) {
            newErrors.cvv = "CVV is required";
        } else if (formData.cvv.length !== 3) {
            newErrors.cvv = "CVV must be 3 digits";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fill all required fields");
            return false;
        }
        return true;
    };

    // Handle next step
    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Handle order placement
    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true); // Start loading

        // Simulate processing delay (optional but looks professional)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const subtotal = getCartSubtotal;
        const tax = subtotal * 0.25;
        const shipping = subtotal > 50 ? 0 : 10;
        const total = subtotal + tax + shipping;

        const order = {
            id: Date.now(),
            items: cart,
            shipping: { ...formData },
            total,
            date: new Date().toISOString(),
        };

        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        clearCart();
        setIsPlacingOrder(false); // Stop loading

        if (toast) {
            toast.success("Order placed successfully!", {
                duration: 3000,
                icon: "✅",
            });
        }

        navigate("/order-success", { state: { order } });
    };

    // Calculate totals
    const subtotal = getCartSubtotal;
    const tax = subtotal * 0.25;
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + tax + shipping;

    // Format card number with spaces
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\s/g, "");
        value = value.replace(/\D/g, "").slice(0, 16);
        value = value.match(/.{1,4}/g)?.join(" ") || value;
        setFormData((prev) => ({ ...prev, cardNumber: value }));
    };

    // Format expiry date
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }
        setFormData((prev) => ({ ...prev, expiryDate: value }));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                Checkout
            </h1>

            {/* Progress Steps */}

            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    {[1, 2, 3].map((step) => {
                        const isActive = currentStep === step;
                        const isCompleted = currentStep > step;
                        const isPending = currentStep < step;

                        return (
                            <div
                                key={step}
                                className="flex flex-col items-center relative flex-1"
                            >
                                {/* Circle */}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-all duration-300 ${
                                        isCompleted
                                            ? "bg-green-600 text-white"
                                            : isActive
                                              ? "bg-blue-600 text-white ring-4 ring-blue-200"
                                              : "bg-gray-300 text-gray-600"
                                    }`}
                                    aria-label={`Step ${step}: ${
                                        step === 1
                                            ? "Shipping"
                                            : step === 2
                                              ? "Payment"
                                              : "Review"
                                    }`}
                                    role="img"
                                >
                                    {isCompleted ? "✓" : step}
                                </div>

                                {/* Label Below */}
                                <div
                                    className={`mt-3 text-sm font-semibold text-center ${
                                        isCompleted || isActive
                                            ? "text-blue-600"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {step === 1 && "Shipping"}
                                    {step === 2 && "Payment"}
                                    {step === 3 && "Review"}
                                </div>

                                {/* Connecting Line (for steps 1-2 and 2-3) */}
                                {step < 3 && (
                                    <div
                                        className={`absolute top-6 left-[50%] w-full h-1 transition-colors duration-300 ${
                                            isCompleted || currentStep > step
                                                ? "bg-blue-600"
                                                : "bg-gray-300"
                                        }`}
                                        style={{
                                            width: "calc(100% - 3rem)",
                                            zIndex: -1,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Step 1: Shipping Information */}
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                                    Shipping Information
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.fullName
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Ivan Horvat"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-sm sm:text-base mt-1">
                                                {errors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                    errors.email
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="ivan.horvat@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm sm:text-base mt-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                    errors.phone
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="+385 91 234 5678"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm sm:text-base mt-1">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.address
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="Ilica 99"
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm sm:text-base mt-1">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                    errors.city
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Zagreb"
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm sm:text-base mt-1">
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                    errors.zipCode
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="10000"
                                            />
                                            {errors.zipCode && (
                                                <p className="text-red-500 text-sm sm:text-base mt-1">
                                                    {errors.zipCode}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Country *
                                            </label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Croatia">
                                                    Croatia
                                                </option>
                                                <option value="Slovenia">
                                                    Slovenia
                                                </option>
                                                <option value="Serbia">
                                                    Serbia
                                                </option>
                                                <option value="Bosnia">
                                                    Bosnia & Herzegovina
                                                </option>
                                                <option value="Montenegro">
                                                    Montenegro
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Information */}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                                    Payment Information
                                </h2>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm sm:text-base text-yellow-800">
                                        <strong>Note:</strong> This is a demo.
                                        No real payment will be processed.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Card Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.cardNumber
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                        />
                                        {errors.cardNumber && (
                                            <p className="text-red-500 text-sm sm:text-base mt-1">
                                                {errors.cardNumber}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Cardholder Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.cardName
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="JOHN DOE"
                                        />
                                        {errors.cardName && (
                                            <p className="text-red-500 text-sm sm:text-base mt-1">
                                                {errors.cardName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleExpiryChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                    errors.expiryDate
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                            />
                                            {errors.expiryDate && (
                                                <p className="text-red-500 text-sm sm:text-base mt-1">
                                                    {errors.expiryDate}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 3);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        cvv: value,
                                                    }));
                                                }}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                    errors.cvv
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="123"
                                                maxLength="3"
                                            />
                                            {errors.cvv && (
                                                <p className="text-red-500 text-sm sm:text-base mt-1">
                                                    {errors.cvv}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review Order */}
                        {currentStep === 3 && (
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                                    Review Your Order
                                </h2>

                                {/* Shipping Details */}
                                <div className="mb-6">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                                        Shipping To:
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="font-semibold text-sm sm:text-base">
                                            {formData.fullName}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {formData.address}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {formData.city}, {formData.zipCode}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {formData.country}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base mt-2">
                                            {formData.email}
                                        </p>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {formData.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                                        Order Items:
                                    </h3>
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4 bg-gray-50 rounded-lg p-4"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm sm:text-base text-gray-600">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-orange-400">
                                                        $
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-8">
                            {currentStep > 1 && (
                                <Button
                                    variant="secondary"
                                    onClick={handlePrevious}
                                    className="px-6 py-3"
                                >
                                    Previous
                                </Button>
                            )}

                            {currentStep < 3 ? (
                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                    className="flex-1"
                                >
                                    Continue to{" "}
                                    {currentStep === 1 ? "Payment" : "Review"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handlePlaceOrder}
                                    loading={isPlacingOrder}
                                    loadingText="Processing..."
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Place Order
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (25%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600 font-semibold">
                                            FREE
                                        </span>
                                    ) : (
                                        `$${shipping.toFixed(2)}`
                                    )}
                                </span>
                            </div>

                            <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-orange-500">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 mb-2">
                                {cart.length}{" "}
                                {cart.length === 1 ? "item" : "items"} in cart
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
