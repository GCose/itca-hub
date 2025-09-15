const EventsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl overflow-hidden"
        >
          {/*==================== Image Skeleton ====================*/}
          <div className="h-48 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse">
            <div className="h-full w-full bg-gray-200 animate-pulse" />
          </div>

          {/*==================== Content Skeleton ====================*/}
          <div className="p-6">
            {/*==================== Title Skeleton ====================*/}
            <div className="mb-3">
              <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-3/4 animate-pulse" />
            </div>

            {/*==================== Description Skeleton ====================*/}
            <div className="mb-4">
              <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-5/6 animate-pulse mb-2" />
              <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-4/6 animate-pulse" />
            </div>

            {/*==================== Meta Info Skeleton ====================*/}
            <div className="space-y-3 mb-4">
              {/* Date & Time */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-32 animate-pulse" />
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-24 animate-pulse" />
              </div>

              {/* Capacity */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-20 animate-pulse" />
              </div>
            </div>

            {/*==================== Status Badge Skeleton ====================*/}
            <div className="mb-4">
              <div className="inline-block h-6 w-20 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse" />
            </div>

            {/*==================== Progress Bar Skeleton ====================*/}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-16 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-12 animate-pulse" />
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                />
              </div>
            </div>

            {/*==================== Action Buttons Skeleton ====================*/}
            <div className="flex space-x-2 pt-2">
              <div className="flex-1 h-9 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-9 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-9 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsLoadingSkeleton;
