import { toast } from 'sonner';
import {
  Resource,
  Pagination,
  UseResourcesProps,
  ResourcesResponse,
  SingleResourceResponse,
} from '@/types/interfaces/resource';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { useState, useCallback, useEffect } from 'react';
import { CustomError, ErrorResponseData } from '@/types';

const useResources = ({ token }: UseResourcesProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchResources = useCallback(
    async (page = 0, limit = 10, includeDeleted = false) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const response = await axios.get<ResourcesResponse>(`${BASE_URL}/resources?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success') {
          let filteredResources = response.data.data.resources;

          if (!includeDeleted) {
            filteredResources = filteredResources.filter(
              (resource: Resource) => !resource.isDeleted
            );
          }

          setResources(filteredResources);
          setPagination(response.data.data.pagination);
          setIsError(false);
        } else {
          throw new Error('Failed to fetch resources');
        }
      } catch (error) {
        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to load resources', {
          description: message,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const fetchSingleResource = useCallback(
    async (resourceId: string): Promise<Resource | null> => {
      try {
        const response = await axios.get<SingleResourceResponse>(
          `${BASE_URL}/resources/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          return response.data.data.resource;
        } else {
          throw new Error('Failed to fetch resource');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to load resource', {
          description: message,
          duration: 5000,
        });
        return null;
      }
    },
    [token]
  );

  const trackView = useCallback(
    async (resourceId: string) => {
      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-view/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        console.warn('Failed to track resource view:', message);
      }
    },
    [token]
  );

  const trackDownload = useCallback(
    async (resourceId: string) => {
      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-download/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        console.warn('Failed to track resource download:', message);
      }
    },
    [token]
  );

  const refreshResources = useCallback(() => {
    fetchResources(pagination.currentPage, pagination.limit);
  }, [fetchResources, pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    isError,
    trackView,
    resources,
    isLoading,
    pagination,
    trackDownload,
    fetchResources,
    refreshResources,
    fetchSingleResource,
  };
};

export default useResources;
