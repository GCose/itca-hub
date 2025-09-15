const ResourceFilterSkeleton = () => {
  return (
    <>
      {/*==================== Filter Section Skeleton ====================*/}
      <div className="mb-6 bg-white rounded-xl p-4">
        <div className="flex items-center mb-4">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-2" />
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        {/*==================== Search Box Skeleton ====================*/}
        <div className="mb-4">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
        </div>
        {/*==================== End of Search Box Skeleton ====================*/}

        {/*==================== Filter Grid Skeleton ====================*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        {/*==================== End of Filter Grid Skeleton ====================*/}
      </div>
      {/*==================== End of Filter Section Skeleton ====================*/}
    </>
  );
};

export default ResourceFilterSkeleton;
