function JobSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-5 relative">
            {/* HEADER */}
            <div className="flex gap-4 items-start">
                {/* Logo skeleton */}
                <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0" />

                {/* Title & Company */}
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>

                {/* Save button */}
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
            </div>

            {/* TAGS */}
            <div className="flex gap-2 mt-4">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-24 bg-gray-200 rounded-full" />
                <div className="h-5 w-20 bg-gray-200 rounded-full" />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                <div className="h-5 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
        </div>
    );
}

export default JobSkeleton;
