import { useState, useEffect, useCallback } from 'react';
import { Resource, ApiResource, UseResourceViewerProps } from '@/types';
import { BASE_URL } from '@/utils/url';
import { ResourceAdapter } from '@/utils/resource-adapter';
import { apiClient } from '@/utils/api';

const useResourceViewer = ({ resourceId, token }: UseResourceViewerProps) => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
   * Fetch resource data with correct Jeetix metadata
   =====================================================*/
  useEffect(() => {
    let isMounted = true;

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

        if (!isMounted) return;

        const apiResource = data.data.resource as ApiResource;
        const primaryFileUrl = apiResource.fileUrls[0] || '';
        const fileName = primaryFileUrl.split('/').slice(-2).join('/'); // Gets "itca-resources/filename.ext"
        const fileType = ResourceAdapter.getFileType(fileName);

        /**===========================================
         * Get file size from Jeetix using apiClient
         ===========================================*/
        let fileSize = 'Unknown';
        try {
          // Use full file path from URL, not just filename
          const fullFilePath = primaryFileUrl.split('/').slice(-2).join('/'); // Gets "itca-resources/filename.ext"

          const jeetixFileInfo = await apiClient.getJeetixFileInfo(fullFilePath);
          if (jeetixFileInfo?.data?.metadata?.size) {
            fileSize = ResourceAdapter.formatFileSize(parseInt(jeetixFileInfo.data.metadata.size));
          }
        } catch (jeetixError) {
          console.warn('Could not fetch file size from Jeetix:', jeetixError);
        }

        /**=====================================
         * Construct Resource object manually
         =====================================*/
        const convertedResource: Resource = {
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
          dateUploaded: new Date(apiResource.createdAt).toISOString().split('T')[0],
        };

        setResource(convertedResource);
        await trackView(resourceId);
      } catch (err) {
        if (!isMounted) return;

        console.error('Error fetching resource:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resource');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResource();

    return () => {
      isMounted = false;
    };
  }, [resourceId, token, trackView]);

  /**=======================================================================
   * Determines the viewer file type based on the resource file extension
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
