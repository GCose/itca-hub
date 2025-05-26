import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import useResourceAnalytics from '@/hooks/admin/resources/use-resource-analytics';

interface GenericViewerProps {
  fileUrl: string;
  title: string;
  fileType: string;
  resourceId: string;
}

const GenericViewer: React.FC<GenericViewerProps> = ({ fileUrl, title, fileType, resourceId }) => {
  const { trackResourceDownload } = useResourceAnalytics();

  const handleDownload = async () => {
    try {
      // Track download first
      await trackResourceDownload(resourceId);

      // Then trigger download
      window.location.href = fileUrl;
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/*==================== Generic Viewer Content ====================*/}
      <div className="flex-1 bg-gray-50 rounded-b-lg p-8 flex flex-col items-center justify-center">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h4 className="text-xl font-medium text-gray-700 mb-2">{title}</h4>
        <p className="text-gray-500 mb-6">
          This file type ({fileType.toUpperCase()}) cannot be previewed directly.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </a>
        </div>
      </div>
      {/*==================== End of Generic Viewer Content ====================*/}
    </div>
  );
};

export default GenericViewer;
