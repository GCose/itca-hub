import { useState, useEffect, useCallback } from 'react';
import { Resource, ApiResource } from '@/types';
import { BASE_URL } from '@/utils/url';

interface UseResourceViewerProps {
  resourceId?: string;
  token: string;
}

const useResourceViewer = ({ resourceId, token }: UseResourceViewerProps) => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**==========================================================
   * Formats a file size in bytes to a human-readable string.
   ==========================================================*/
  const formatFileSize = (sizeInBytes: number): string => {
    if (!sizeInBytes) return 'Unknown';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  /**============================================================
   * Determines the file type based on the file name extension.
   ============================================================*/
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext;
  };

  /**=============================================
   * Get file info from Jeetix API (memoized)
   =============================================*/
  const getJeetixFileInfo = useCallback(async (fileName: string) => {
    try {
      const response = await fetch(
        `https://jeetix-file-service.onrender.com/api/storage/file/${encodeURIComponent(fileName)}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data.metadata) {
          return data.data.metadata;
        }
      }
    } catch (error) {
      console.warn('Could not fetch file info from Jeetix:', error);
    }
    return null;
  }, []);

  /**================================================  
   * Convert API resource to frontend Resource format
   ================================================*/
  const convertApiResource = useCallback(
    async (apiResource: ApiResource): Promise<Resource> => {
      const primaryFileUrl = apiResource.fileUrls[0] || '';
      const fileName = primaryFileUrl.split('/').pop() || '';
      const fileType = getFileType(fileName);

      const formatDate = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0];
      };

      // Get file info from Jeetix
      const jeetixMetadata = await getJeetixFileInfo(fileName);
      const fileSize = jeetixMetadata?.size
        ? formatFileSize(parseInt(jeetixMetadata.size))
        : 'Unknown';

      return {
        resourceId: apiResource.resourceId,
        title: apiResource.title,
        description: apiResource.description,
        category: apiResource.category,
        downloads: apiResource.downloads,
        viewCount: apiResource.viewCount,
        fileUrls: apiResource.fileUrls,
        fileUrl: primaryFileUrl,
        fileName: fileName,
        type: fileType,
        fileSize: fileSize,
        visibility: apiResource.visibility,
        academicLevel: apiResource.academicLevel,
        department: apiResource.department,
        isDeleted: apiResource.isDeleted,
        deletedAt: apiResource.deletedAt,
        deletedBy: apiResource.deletedBy,
        createdBy: apiResource.createdBy,
        updatedBy: apiResource.updatedBy,
        createdAt: apiResource.createdAt,
        updatedAt: apiResource.updatedAt,
        dateUploaded: formatDate(apiResource.createdAt),
      };
    },
    [getJeetixFileInfo]
  );

  /**====================================================================
   * Track resource view (separate function to avoid dependency issues)
   ====================================================================*/
  const trackView = useCallback(
    async (id: string) => {
      try {
        await fetch(`${BASE_URL}/resources/analytics/track-view/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (trackingError) {
        console.warn('Could not track resource view:', trackingError);
      }
    },
    [token]
  );

  /**=====================================================
   * FIXED: Fetch resource data with proper dependencies
   =====================================================*/
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const fetchResource = async () => {
      if (!resourceId || !token) {
        setError('Resource ID and authentication token are required');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/resources/${resourceId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Resource not found');
          }
          throw new Error(`Failed to fetch resource: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to fetch resource');
        }

        if (!isMounted) return; // Prevent state update if component unmounted

        const apiResource = data.data.resource as ApiResource;
        const convertedResource = await convertApiResource(apiResource);

        setResource(convertedResource);

        // Track view after successfully loading the resource
        await trackView(resourceId);
      } catch (err) {
        if (!isMounted) return; // Prevent state update if component unmounted

        console.error('Error fetching resource:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resource');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResource();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [resourceId, token, convertApiResource, trackView]); // Include all dependencies

  /**=======================================================================
   * Determines the viewer file type based on the resource file extension.
   =======================================================================*/
  const getViewerFileType = () => {
    if (!resource) return null;

    const extension = resource.fileName.split('.').pop()?.toLowerCase();

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
    fileType: getViewerFileType(),
  };
};

export default useResourceViewer;
