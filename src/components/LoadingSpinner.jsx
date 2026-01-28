function LoadingSpinner({ size = "md", text = "Loading..." }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-24 h-24",
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div
                className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
            ></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
}

export default LoadingSpinner;
