import { Resource, ApiResource } from '@/types';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';

interface UseResourcesProps {
  token: string;
}

interface JeetixFileItem {
  name: string;
  url: string;
  metadata: {
    size: string;
    contentType: string;
    timeCreated: string;
    mediaLink: string;
    [key: string]: unknown;
  };
}

interface JeetixApiResponse {
  status: string;
  data: JeetixFileItem[];
}

export const useResources = ({ token }: UseResourcesProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isError, setIsError] = useState(false);

  /**============================================================
   * Formats a file size in bytes into a human-readable string.
   ============================================================*/
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

  /**=====================================================
   * Fetches file metadata from the Jeetix file service.
   =====================================================*/
  const getJeetixFileData = async () => {
    try {
      const response = await fetch(
        'https://jeetix-file-service.onrender.com/api/storage/list?prefix=itca-resources'
      );

      if (!response.ok) {
        console.warn('Could not fetch Jeetix file data');
        return {};
      }

      const data = (await response.json()) as JeetixApiResponse;
      if (data.status !== 'success' || !Array.isArray(data.data)) {
        return {};
      }

      const fileDataMap: Record<string, JeetixFileItem> = {};
      data.data.forEach((item) => {
        const fileName = item.name.split('/').pop() || item.name;
        fileDataMap[fileName] = item;
      });

      return fileDataMap;
    } catch (error) {
      console.warn('Error fetching Jeetix file data:', error);
      return {};
    }
  };

  /**===================================================================================
   * Fetches resources from the ITCA API and maps them to the frontend Resource format.
   ===================================================================================*/
  const fetchResources = useCallback(
    async (includeDeleted = false) => {
      setIsLoading(true);
      setIsError(false);

      const convertApiResource = (
        apiResource: ApiResource,
        jeetixData: Record<string, JeetixFileItem>
      ): Resource => {
        const primaryFileUrl = apiResource.fileUrls[0] || '';
        const fileName = primaryFileUrl.split('/').pop() || '';
        const fileType = getFileType(fileName);

        const jeetixFileData = jeetixData[fileName];
        const fileSize = jeetixFileData?.metadata?.size
          ? formatFileSize(parseInt(jeetixFileData.metadata.size))
          : 'Unknown';

        const formatDate = (dateString: string) => {
          return new Date(dateString).toISOString().split('T')[0];
        };

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
      };

      try {
        const [itcaResponse, jeetixFileData] = await Promise.all([
          fetch(`${BASE_URL}/resources?page=0&limit=100`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          getJeetixFileData(),
        ]);

        if (!itcaResponse.ok) {
          throw new Error(`Failed to fetch resources: ${itcaResponse.statusText}`);
        }

        const data = await itcaResponse.json();

        if (data.status !== 'success') {
          throw new Error(data.message || 'Failed to fetch resources');
        }

        const apiResources = data.data.resources as ApiResource[];
        const mappedResources = apiResources.map((resource) =>
          convertApiResource(resource, jeetixFileData)
        );

        const filteredResources = includeDeleted
          ? mappedResources
          : mappedResources.filter((resource) => !resource.isDeleted);

        setResources(filteredResources);
        setIsError(false);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setIsError(true);
        toast.error('Failed to load resources', {
          description: err instanceof Error ? err.message : 'An unknown error occurred',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  /**====================================================
   * Moves a resource to the recycle bin (soft delete).
   ====================================================*/
  const moveToRecycleBin = async (resourceId: string, resourceTitle: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/resources/${resourceId}/trash-or-restore`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to move resource to recycle bin');
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to move resource to recycle bin');
      }

      setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));

      toast.success('Resource moved to recycle bin', {
        description: `${resourceTitle} has been moved to the recycle bin.`,
      });

      return true;
    } catch (err) {
      console.error('Error moving resource to recycle bin:', err);
      toast.error('Failed to move resource to recycle bin', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**====================================================
   * Batch move resources to recycle bin (soft delete).
   ====================================================*/
  const batchMoveToRecycleBin = async (resourceIds: string[]): Promise<boolean> => {
    if (resourceIds.length === 0) return false;

    setIsDeleting(true);
    const toastId = toast.loading(`Moving ${resourceIds.length} resources to recycle bin...`);

    try {
      const promises = resourceIds.map(async (resourceId) => {
        const response = await fetch(`${BASE_URL}/resources/${resourceId}/trash-or-restore`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to move resource ${resourceId} to recycle bin`
          );
        }

        return response.json();
      });

      await Promise.all(promises);

      setResources((prev) => prev.filter((r) => !resourceIds.includes(r.resourceId)));

      toast.success(`${resourceIds.length} resources moved to recycle bin`, {
        id: toastId,
        description: 'The selected resources have been moved to the recycle bin.',
      });

      return true;
    } catch (err) {
      console.error('Error batch moving resources to recycle bin:', err);
      toast.error('Failed to move resources to recycle bin', {
        id: toastId,
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**===========================================
   * Restores a resource from the recycle bin.
   ===========================================*/
  const restoreFromRecycleBin = async (
    resourceId: string,
    resourceTitle: string
  ): Promise<boolean> => {
    const toastId = toast.loading(`Restoring ${resourceTitle}...`);

    try {
      const response = await fetch(`${BASE_URL}/resources/${resourceId}/trash-or-restore`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to restore resource');
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to restore resource');
      }

      setResources((prev) =>
        prev.map((r) =>
          r.resourceId === resourceId ? { ...r, isDeleted: false, deletedAt: undefined } : r
        )
      );

      toast.success('Resource restored', {
        id: toastId,
        description: `${resourceTitle} has been restored from the recycle bin.`,
      });

      return true;
    } catch (err) {
      console.error('Error restoring resource:', err);
      toast.error('Failed to restore resource', {
        id: toastId,
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return false;
    }
  };

  /**=================================================
   * Permanently deletes a resource from the system.
   =================================================*/
  const permanentlyDeleteResource = async (
    resourceId: string,
    resourceTitle: string
  ): Promise<boolean> => {
    setIsDeleting(true);
    const toastId = toast.loading(`Permanently deleting ${resourceTitle}...`);

    try {
      const response = await fetch(`${BASE_URL}/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete resource');
      }

      if (response.status === 204) {
        setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));

        toast.success('Resource permanently deleted', {
          id: toastId,
          description: `${resourceTitle} has been permanently deleted.`,
        });

        return true;
      }

      throw new Error('Unexpected response from server');
    } catch (err) {
      console.error('Error permanently deleting resource:', err);
      toast.error('Failed to delete resource', {
        id: toastId,
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSuccess = (resourceId: string) => {
    setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));
  };

  return {
    resources,
    isLoading,
    isDeleting,
    isError,
    fetchResources,
    moveToRecycleBin,
    batchMoveToRecycleBin,
    restoreFromRecycleBin,
    permanentlyDeleteResource,
    handleDeleteSuccess,
  };
};
