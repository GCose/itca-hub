const EventsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between animate-pulse">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="h-5 w-20 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-3/4 mb-2 bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 mb-4 bg-gray-200 rounded"></div>

              <div className="flex flex-wrap gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
              <div className="h-5 w-24 mb-3 bg-gray-200 rounded"></div>
              <div className="w-36 h-2 mb-1 bg-gray-200 rounded-full"></div>
              <div className="w-36 h-4 mb-4 bg-gray-200 rounded"></div>

              <div className="flex space-x-2">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsLoadingSkeleton;
