import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Loader } from 'lucide-react';
import { downloadResource } from '@/utils/download';
import { toast } from 'sonner';

interface GenericViewerProps {
  fileUrl: string;
  title: string;
  fileType?: string;
  resourceId?: string;
  token?: string;
}

const GenericViewer: React.FC<GenericViewerProps> = ({
  fileUrl,
  title,
  fileType = 'unknown',
  resourceId,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const fileName = fileUrl.split('/').pop() || title;

    try {
      const success = await downloadResource(fileUrl, fileName, title);
      if (success) {
        toast.success('Download started', { description: `${title} is being downloaded.` });
      } else {
        toast.error('Download failed', { description: 'Please try again.' });
      }
    } catch {
      toast.error('Download failed', { description: 'Please try again.' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-b-lg p-8 flex flex-col items-center justify-center">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h4 className="text-xl font-medium text-gray-700 mb-2">{title}</h4>
        <p className="text-gray-500 mb-6 text-center">
          This file type ({fileType.toUpperCase()}) cannot be previewed directly.
          <br />
          You can download it or open it in a new tab to view the content.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isDownloading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </button>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 w-full max-w-md">
          <h5 className="text-sm font-medium text-gray-900 mb-2">File Information</h5>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">{fileType.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Name:</span>
              <span className="font-medium truncate ml-2">{title}</span>
            </div>
            {resourceId && (
              <div className="flex justify-between">
                <span>Resource ID:</span>
                <span className="font-medium font-mono text-xs">{resourceId.slice(-8)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericViewer;
