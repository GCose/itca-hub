import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import {
  CreateResourcePayload,
  ResourceAnalyticsData,
  UpdateResourcePayload,
  UseResourceAdminProps,
} from '@/types/interfaces/resource';

const useResourceAdmin = ({ token }: UseResourceAdminProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://jeetix-file-service.onrender.com/api/storage/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        return response.data.data.fileUrl;
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      throw new Error(`File upload failed: ${message}`);
    }
  }, []);

  const createResource = useCallback(
    async (payload: CreateResourcePayload) => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/resources`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success') {
          toast.success('Resource created successfully', {
            description: 'Your resource has been uploaded and is now available in the library.',
          });
          return response.data.data.resource;
        } else {
          throw new Error('Failed to create resource');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to create resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const uploadAndCreateResource = useCallback(
    async (file: File, resourceData: Omit<CreateResourcePayload, 'fileUrls'>) => {
      setIsLoading(true);
      try {
        const fileUrl = await uploadFile(file);

        const resource = await createResource({
          ...resourceData,
          fileUrls: [fileUrl],
        });

        return resource;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [uploadFile, createResource]
  );

  const updateResource = useCallback(
    async (resourceId: string, payload: UpdateResourcePayload) => {
      setIsLoading(true);
      try {
        const response = await axios.patch(`${BASE_URL}/resources/${resourceId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success') {
          toast.success('Resource updated successfully');
          return response.data.data.resource;
        } else {
          throw new Error('Failed to update resource');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to update resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const toggleResourceTrash = useCallback(
    async (resourceId: string) => {
      setIsLoading(true);
      try {
        const response = await axios.patch(
          `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          const action = response.data.data.action;
          toast.success(action === 'deleted' ? 'Resource moved to trash' : 'Resource restored', {
            description:
              action === 'deleted'
                ? 'Resource can be restored from the recycle bin.'
                : 'Resource is now available in the main library.',
          });
          return response.data.data;
        } else {
          throw new Error('Failed to update resource status');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to update resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deleteResourcePermanently = useCallback(
    async (resourceId: string) => {
      setIsLoading(true);
      try {
        await axios.delete(`${BASE_URL}/resources/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Resource permanently deleted', {
          description: 'This action cannot be undone.',
        });
        return true;
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to delete resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getResourceAnalytics = useCallback(
    async (resourceId: string): Promise<ResourceAnalyticsData | null> => {
      try {
        const response = await axios.get(`${BASE_URL}/resources/analytics/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to get analytics data');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to load analytics', {
          description: message,
          duration: 5000,
        });
        throw error;
      }
    },
    [token]
  );

  return {
    isLoading,
    uploadFile,
    createResource,
    updateResource,
    toggleResourceTrash,
    getResourceAnalytics,
    uploadAndCreateResource,
    deleteResourcePermanently,
  };
};

export default useResourceAdmin;
