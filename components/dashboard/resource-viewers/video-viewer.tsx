import React, { useState } from 'react';
import { FileVideo, Download } from 'lucide-react';
import { downloadResource } from '@/utils/download';
import { toast } from 'sonner';

interface VideoViewerProps {
  fileUrl: string;
  title: string;
  resourceId?: string;
}

const VideoViewer: React.FC<VideoViewerProps> = ({ fileUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [playbackError, setPlaybackError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isMkvFile = fileUrl.toLowerCase().endsWith('.mkv');
  const videoType = isMkvFile
    ? 'video/x-matroska'
    : `video/${fileUrl.split('.').pop()?.toLowerCase()}`;

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

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-b-lg p-4 flex items-center justify-center relative">
        {isLoading && !playbackError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        {playbackError || isMkvFile ? (
          <div className="text-center p-8">
            <FileVideo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">
              {isMkvFile
                ? 'MKV format is not supported for browser playback.'
                : 'This video format cannot be played in your browser.'}
            </p>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download Video'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <video
              controls
              controlsList="nodownload"
              onError={() => {
                setIsLoading(false);
                setPlaybackError(true);
              }}
              className="max-h-[600px] w-auto mx-auto"
              onLoadedData={() => setIsLoading(false)}
              preload="metadata"
            >
              <source src={fileUrl} type={videoType} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoViewer;
