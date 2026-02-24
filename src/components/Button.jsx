import { useMemo } from "react";

function Button({
    children,
    onClick,
    loading = false,
    loadingText = "Loading...",
    disabled = false,
    variant = "primary",
    className = "",
    as: Component = "button",
    ...restProps
}) {
    const variants = {
        primary: "bg-[#3f37c9] hover:bg-[#480ca8] text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        orange: "bg-orange-600 hover:bg-orange-700 text-white",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300",
    };

    const spinnerColor =
        variant === "secondary" || variant === "ghost"
            ? "border-gray-800 border-t-transparent"
            : "border-white border-t-transparent";

    // Only pass disabled to real <button> elements
    const buttonOnlyProps =
        Component === "button"
            ? {
                  disabled: disabled || loading,
              }
            : {};

    return (
        <Component
            onClick={onClick}
            className={`ripple px-6 py-3 rounded-lg font-semibold transition-all 
                disabled:opacity-50 disabled:cursor-not-allowed 
                ${variants[variant]} ${className}`}
            aria-disabled={disabled || loading}
            {...buttonOnlyProps}
            {...restProps} // passes `to`, `href`, etc. when using Link
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div
                        className={`w-5 h-5 border-2 ${spinnerColor} rounded-full animate-spin`}
                    ></div>
                    <span>{loadingText}</span>
                </div>
            ) : (
                children
            )}
        </Component>
    );
}

export default Button;
