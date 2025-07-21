import { Resource } from '@/types';
import { useState, useCallback } from 'react';
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

  /**======================================================================
   * Fetches student resources (only visibility="all") from the ITCA API
   ======================================================================*/
  const fetchResources = useCallback(
    async (searchParams: Omit<ResourcesParams, 'includeDeleted'> = {}) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const params: ResourcesParams = {
          page: 0,
          limit: 100,
          includeDeleted: false,
          visibility: 'all',
          ...searchParams,
        };

        const [itcaResponse, jeetixFileData] = await Promise.all([
          apiClient.getResources(params, token),
          getJeetixFileData(),
        ]);

        if (itcaResponse.status !== 'success') {
          throw new Error(itcaResponse.message || 'Failed to fetch resources');
        }

        const apiResources = itcaResponse.data.resources;
        const mappedResources = apiResources.map((resource) =>
          ResourceAdapter.fromApiResource(resource, jeetixFileData)
        );

        // Client-side filtering to ensure only public resources
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

  return {
    resources,
    isLoading,
    isError,
    fetchResources,
  };
};
