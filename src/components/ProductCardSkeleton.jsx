function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="h-64 bg-gray-300"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>

                {/* Title */}
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>

                {/* Description */}
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>

                {/* Price and Rating */}
                <div className="flex justify-between items-center pt-2">
                    <div className="h-7 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                </div>

                {/* Button */}
                <div className="h-10 bg-gray-300 rounded w-full mt-3"></div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
