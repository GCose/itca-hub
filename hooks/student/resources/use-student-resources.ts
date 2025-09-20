import { Resource } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient, type ResourcesParams } from '@/utils/api';
import { ResourceAdapter } from '@/utils/resource-adapter';

interface UseStudentResourcesProps {
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

export const useStudentResources = ({ token }: UseStudentResourcesProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [limit] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  /*==================== Fetch Jeetix File Data ====================*/
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
  /*==================== End of Fetch Jeetix File Data ====================*/

  /*==================== Fetch Resources ====================*/
  const fetchResources = useCallback(
    async ({
      page: pageParam = 0,
      limit: limitParam = 10,
    }: {
      page?: number;
      limit?: number;
    } = {}) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const params: ResourcesParams = {
          page: Number(pageParam),
          limit: limitParam,
          includeDeleted: false,
          visibility: 'all',
        };

        const [itcaResponse, jeetixFileData] = await Promise.all([
          apiClient.getResources(params, token),
          getJeetixFileData(),
        ]);

        if (itcaResponse.status !== 'success') {
          throw new Error(itcaResponse.message || 'Failed to fetch resources');
        }

        const apiResources = itcaResponse.data.resources;

        setTotalPages(itcaResponse.data.pagination.totalPages);
        setTotal(itcaResponse.data.pagination.total);

        const mappedResources = apiResources.map((resource) =>
          ResourceAdapter.fromApiResource(resource, jeetixFileData)
        );

        const publicResources = mappedResources.filter(
          (resource) => resource.visibility === 'all' && !resource.isDeleted
        );

        setResources(publicResources);
        setIsError(false);
      } catch (err) {
        console.error('Error fetching student resources:', err);
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
  /*==================== End of Fetch Resources ====================*/

  useEffect(() => {
    fetchResources({ limit, page });
  }, [fetchResources, limit, page]);

  return {
    resources,
    isLoading,
    isError,
    fetchResources,
    totalPages,
    total,
    setPage,
    page,
    limit,
  };
};
