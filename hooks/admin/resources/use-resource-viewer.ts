import { useState, useEffect } from 'react';
import { Resource } from '@/types';
import useResourceAnalytics from '@/hooks/admin/resources/use-resource-analytics';

interface UseResourceViewerProps {
  resourceId?: string;
}

const useResourceViewer = ({ resourceId }: UseResourceViewerProps) => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackResourceView } = useResourceAnalytics();

  useEffect(() => {
    const fetchResource = async () => {
      if (!resourceId) {
        setError('Resource ID is required');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // TEMPORARY: Get from localStorage until API is ready
        const storedMetadata = localStorage.getItem('resourceMetadata');
        if (!storedMetadata) {
          throw new Error('Resource metadata not found');
        }

        const metadataMap = JSON.parse(storedMetadata);

        // Check both by ID and by fileName
        const foundResourceEntry = Object.entries(metadataMap).find(
          ([fileName, data]) =>
            (data as Record<string, unknown>).id === resourceId || fileName === resourceId
        );

        if (!foundResourceEntry) {
          throw new Error('Resource not found');
        }

        // Construct the full resource with fileName from the key
        const [fileName, resourceData] = foundResourceEntry;

        // Extract file extension for type
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

        // Construct the resource with required properties
        const completeResource: Resource = {
          id: ((resourceData as Record<string, unknown>).id as string) || resourceId,
          fileName,
          title:
            ((resourceData as Record<string, unknown>).title as string) ||
            fileName.split('/').pop() ||
            'Untitled',
          description:
            ((resourceData as Record<string, unknown>).description as string) ||
            'No description available',
          type: ((resourceData as Record<string, unknown>).type as string) || fileExtension,
          category:
            ((resourceData as Record<string, unknown>).category as string) || 'Uncategorized',
          dateUploaded:
            ((resourceData as Record<string, unknown>).dateUploaded as string) ||
            new Date().toISOString().split('T')[0],
          fileSize:
            ((resourceData as Record<string, unknown>).fileSize as string) || 'Unknown size',
          downloads: ((resourceData as Record<string, unknown>).downloads as number) || 0,
          viewCount: ((resourceData as Record<string, unknown>).viewCount as number) || 0,
          fileUrl: (resourceData as Record<string, unknown>).fileUrl as string,
          visibility: (((resourceData as Record<string, unknown>).visibility as string) ||
            'all') as 'all' | 'admin',
          department:
            ((resourceData as Record<string, unknown>).department as string) || 'computer-science',
        };

        setResource(completeResource);

        // Track view
        trackResourceView(resourceId);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resource');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [resourceId, trackResourceView]);

  // Determine file type for appropriate viewer
  const getFileType = () => {
    if (!resource) return null;

    const extension = resource.fileName.split('.').pop()?.toLowerCase();

    // Group by viewer type
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'ogg', 'mkv', 'avi', 'mov', 'wmv', '3gp', 'flv'].includes(extension || ''))
      return 'video';
    if (['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(extension || '')) return 'audio';
    if (
      ['txt', 'text', 'md', 'csv', 'log', 'json', 'xml', 'html', 'css', 'js'].includes(
        extension || ''
      )
    )
      return 'text';

    return 'generic';
  };

  return {
    resource,
    isLoading,
    error,
    fileType: getFileType(),
  };
};

export default useResourceViewer;
