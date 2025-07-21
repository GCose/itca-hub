import React from 'react';
import Image from 'next/image';

interface ImageViewerProps {
  fileUrl: string;
  title: string;
  resourceId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ fileUrl, title }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="h-full w-full flex flex-col">
      {/*==================== Image Container ====================*/}
      <div className="flex-1 bg-gray-50 rounded-b-lg p-4 flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        <div className="relative w-full h-full">
          <Image
            fill
            alt={title}
            unoptimized
            src={fileUrl}
            style={{ objectFit: 'contain' }}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>
      {/*==================== End of Image Container ====================*/}
    </div>
  );
};

export default ImageViewer;
