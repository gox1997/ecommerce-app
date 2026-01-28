function Button({
    children,
    onClick,
    loading = false,
    disabled = false,
    variant = "primary",
    className = "",
}) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        orange: "bg-orange-600 hover:bg-orange-700 text-white", // Added for your vibrant theme
    };

    const spinnerColor =
        variant === "secondary"
            ? "border-gray-800 border-t-transparent"
            : "border-white border-t-transparent";

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            aria-disabled={disabled || loading}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div
                        className={`w-5 h-5 border-2 ${spinnerColor} rounded-full animate-spin`}
                    ></div>
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}

export default Button;
