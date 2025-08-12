import { Resource } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient, type ResourcesParams } from '@/utils/api';
import { ResourceAdapter } from '@/utils/resource-adapter';

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

export const useResources = ({ token }: UseResourcesProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  console.log('Page: ', page);

  /**=====================================================
   * Fetches file metadata from the Jeetix file service
   =====================================================*/
  const getJeetixFileData = async (): Promise<Record<string, JeetixFileItem>> => {
    try {
      const fileList = await apiClient.getJeetixFileList('itca-resources');

      const fileDataMap: Record<string, JeetixFileItem> = {};
      fileList.forEach((item) => {
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
   * Fetches resources from the ITCA API and maps them to the frontend Resource format
   ===================================================================================*/
  const fetchResources = useCallback(
    async ({
      includeDeleted = false,
      searchParams = {},
      page = 0,
      limit = 10,
    }: {
      includeDeleted?: boolean;
      searchParams?: Omit<ResourcesParams, 'includeDeleted'>;
      page: number;
      limit: number;
    }) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const params: ResourcesParams = {
          page: Number(page),
          limit,
          includeDeleted,
          ...searchParams,
        };

        const [itcaResponse, jeetixFileData] = await Promise.all([
          apiClient.getResources(params, token),
          getJeetixFileData(),
        ]);

        console.log('Itca Response: ', itcaResponse);

        if (itcaResponse.status !== 'success') {
          throw new Error(itcaResponse.message || 'Failed to fetch resources');
        }

        const apiResources = itcaResponse.data.resources;

        setTotalPages(itcaResponse.data.pagination.totalPages);
        setTotal(itcaResponse.data.pagination.total);

        const mappedResources = apiResources.map((resource) =>
          ResourceAdapter.fromApiResource(resource, jeetixFileData)
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

  useEffect(() => {
    fetchResources({ limit, page });
  }, [fetchResources, limit, page]);

  /**====================================================
   * Moves a resource to the recycle bin (soft delete)
   ====================================================*/
  const moveToRecycleBin = async (resourceId: string, resourceTitle: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const response = await apiClient.moveToRecycleBin(resourceId, token);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to move resource to recycle bin');
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
   * Batch move resources to recycle bin (soft delete)
   ====================================================*/
  const batchMoveToRecycleBin = async (resourceIds: string[]): Promise<boolean> => {
    if (resourceIds.length === 0) return false;

    setIsDeleting(true);
    const toastId = toast.loading(`Moving ${resourceIds.length} resources to recycle bin...`);

    try {
      const promises = resourceIds.map((resourceId) =>
        apiClient.moveToRecycleBin(resourceId, token)
      );

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
   * Restores a resource from the recycle bin
   ===========================================*/
  const restoreFromRecycleBin = async (
    resourceId: string,
    resourceTitle: string
  ): Promise<boolean> => {
    const toastId = toast.loading(`Restoring ${resourceTitle}...`);

    try {
      const response = await apiClient.restoreFromRecycleBin(resourceId, token);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to restore resource');
      }

      setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));

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

  /**===========================================
   * Batch restore resources from recycle bin
   ===========================================*/
  const batchRestoreFromRecycleBin = async (resourceIds: string[]): Promise<boolean> => {
    if (resourceIds.length === 0) return false;

    const toastId = toast.loading(`Restoring ${resourceIds.length} resources...`);

    try {
      const promises = resourceIds.map((resourceId) =>
        apiClient.restoreFromRecycleBin(resourceId, token)
      );

      await Promise.all(promises);

      setResources((prev) => prev.filter((r) => !resourceIds.includes(r.resourceId)));

      toast.success(`${resourceIds.length} resources restored`, {
        id: toastId,
        description: 'The selected resources have been restored from the recycle bin.',
      });

      return true;
    } catch (err) {
      console.error('Error batch restoring resources:', err);
      toast.error('Failed to restore resources', {
        id: toastId,
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return false;
    }
  };

  /**=================================================
   * Permanently deletes a resource from the system
   =================================================*/
  const permanentlyDeleteResource = async (
    resourceId: string,
    resourceTitle: string
  ): Promise<boolean> => {
    setIsDeleting(true);
    const toastId = toast.loading(`Permanently deleting ${resourceTitle}...`);

    try {
      await apiClient.deleteResourcePermanently(resourceId, token);

      setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));

      toast.success('Resource permanently deleted', {
        id: toastId,
        description: `${resourceTitle} has been permanently deleted.`,
      });

      return true;
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

  /**=================================================
   * Batch permanently delete resources from system
   =================================================*/
  const batchPermanentlyDeleteResource = async (resourceIds: string[]): Promise<boolean> => {
    if (resourceIds.length === 0) return false;

    setIsDeleting(true);
    const toastId = toast.loading(`Permanently deleting ${resourceIds.length} resources...`);

    try {
      const promises = resourceIds.map((resourceId) =>
        apiClient.deleteResourcePermanently(resourceId, token)
      );

      await Promise.all(promises);

      setResources((prev) => prev.filter((r) => !resourceIds.includes(r.resourceId)));

      toast.success(`${resourceIds.length} resources permanently deleted`, {
        id: toastId,
        description: 'The selected resources have been permanently deleted.',
      });

      return true;
    } catch (err) {
      console.error('Error batch permanently deleting resources:', err);
      toast.error('Failed to delete resources', {
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
    batchRestoreFromRecycleBin,
    permanentlyDeleteResource,
    batchPermanentlyDeleteResource,
    handleDeleteSuccess,
    setPage,
    setLimit,
    totalPages,
    total,
    page,
    limit,
  };
};
