import { Resource } from '@/types';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface JeetixFileItem {
  name: string;
  url: string;
  metadata?: {
    id?: string;
    timeCreated?: string;
    size?: string;
    [key: string]: unknown;
  };
}

interface JeetixApiResponse {
  status: string;
  data: JeetixFileItem[];
}

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isError, setIsError] = useState(false);

  // Function to format file size
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

  // Function to get file type from filename
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext;
  };

  // Extract a more meaningful title from the filename
  const extractTitle = (fileName: string): string => {
    // Remove file extension and path
    const baseName = fileName.split('/').pop() || fileName;
    const nameWithoutExt = baseName.substring(0, baseName.lastIndexOf('.'));

    // Replace dashes and underscores with spaces
    const cleanedName = nameWithoutExt.replace(/[-_]/g, ' ');

    // Capitalize first letter of each word
    return cleanedName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch resources from Jeetix API
  const fetchResources = useCallback(async (includeDeleted = false) => {
    setIsLoading(true);
    setIsError(false); // Reset error state on each fetch attempt

    try {
      const response = await fetch(
        'https://jeetix-file-service.onrender.com/api/storage/list?prefix=itca'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch resources from server');
      }

      const data = (await response.json()) as JeetixApiResponse;

      if (data.status !== 'success' || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from server');
      }

      // Map Jeetix data to the Resource interface
      const mappedResources: Resource[] = data.data.map((item: JeetixFileItem, index: number) => {
        const fileType = getFileType(item.name);
        const pathParts = item.name.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const category = pathParts.length > 1 ? pathParts[0] : 'Uncategorized';

        // Gets metadata from localStorage if available
        const storedMetadata = localStorage.getItem('resourceMetadata');
        const metadataMap = storedMetadata ? JSON.parse(storedMetadata) : {};
        const resourceMetadata = metadataMap[item.name] || {};

        // Gets title either from metadata or generate from filename
        const title = resourceMetadata.title || extractTitle(fileName);

        // Gets description from metadata or use default
        const description = resourceMetadata.description || `${category} resource`;

        // Gets date from item.metadata.timeCreated or current date
        const uploadDate = item.metadata?.timeCreated
          ? new Date(item.metadata.timeCreated).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        return {
          id: resourceMetadata.id || `resource-${index}`,
          title: title,
          description: description,
          type: fileType,
          category:
            resourceMetadata.category || category.charAt(0).toUpperCase() + category.slice(1),
          dateUploaded: uploadDate,
          fileSize: item.metadata?.size ? formatFileSize(parseInt(item.metadata.size)) : 'Unknown',
          downloads: Math.floor(Math.random() * 100),
          viewCount: Math.floor(Math.random() * 150),
          fileUrl: item.url,
          fileName: item.name,
          visibility: resourceMetadata.visibility || 'all',
          featuredOnLanding: resourceMetadata.featuredOnLanding || false,
          academicLevel: resourceMetadata.academicLevel || 'undergraduate',
          department: resourceMetadata.department || 'computer-science',
          isDeleted: resourceMetadata.isDeleted || false,
          deletedAt: resourceMetadata.deletedAt,
          deletedBy: resourceMetadata.deletedBy,
        };
      });

      // Filter resources based on includeDeleted parameter
      const filteredResources = includeDeleted
        ? mappedResources
        : mappedResources.filter((resource) => !resource.isDeleted);

      setResources(filteredResources);
      setIsError(false); // Ensure error state is cleared on success
    } catch (err) {
      console.error('Error fetching resources:', err);
      setIsError(true); // Set error state when fetch fails
      toast.error('Failed to load resources', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Move a resource to recycle bin (soft delete)
  const moveToRecycleBin = async (resourceId: string, resourceTitle: string): Promise<boolean> => {
    setIsDeleting(true);
    const toastId = toast.loading(`Moving ${resourceTitle} to recycle bin...`);

    try {
      // Find the resource in the current resources array
      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) {
        throw new Error('Resource not found');
      }

      // TEMPORARY IMPLEMENTATION (localStorage)
      // Get stored metadata
      const storedMetadata = localStorage.getItem('resourceMetadata');
      const metadataMap = storedMetadata ? JSON.parse(storedMetadata) : {};

      // Update metadata for the resource
      metadataMap[resource.fileName] = {
        ...(metadataMap[resource.fileName] || {}),
        id: resource.id,
        title: resource.title,
        description: resource.description,
        department: resource.department,
        visibility: resource.visibility,
        category: resource.category,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: 'Admin',
        fileName: resource.fileName,
      };

      // Save updated metadata back to localStorage
      localStorage.setItem('resourceMetadata', JSON.stringify(metadataMap));

      // Update the resources state to reflect the deletion
      setResources(resources.filter((r) => r.id !== resourceId));

      toast.success('Resource moved to recycle bin', {
        id: toastId,
        description: `${resourceTitle} has been moved to the recycle bin.`,
      });

      return true;
    } catch (err) {
      console.error('Error moving resource to recycle bin:', err);
      toast.error('Failed to move resource to recycle bin', {
        id: toastId,
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Move multiple resources to recycle bin (batch delete)
  const batchMoveToRecycleBin = async (resourceIds: string[]): Promise<boolean> => {
    if (resourceIds.length === 0) return false;

    setIsDeleting(true);
    const toastId = toast.loading(`Moving ${resourceIds.length} resources to recycle bin...`);

    try {
      // Get stored metadata
      const storedMetadata = localStorage.getItem('resourceMetadata');
      const metadataMap = storedMetadata ? JSON.parse(storedMetadata) : {};

      // Process each resource
      for (const resourceId of resourceIds) {
        const resource = resources.find((r) => r.id === resourceId);
        if (!resource) continue;

        // Update metadata for the resource
        metadataMap[resource.fileName] = {
          ...(metadataMap[resource.fileName] || {}),
          id: resource.id,
          title: resource.title,
          description: resource.description,
          department: resource.department,
          visibility: resource.visibility,
          category: resource.category,
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          deletedBy: 'Admin',
          fileName: resource.fileName,
        };
      }

      // Save updated metadata back to localStorage
      localStorage.setItem('resourceMetadata', JSON.stringify(metadataMap));

      // Update the resources state to remove the deleted resources
      setResources(resources.filter((r) => !resourceIds.includes(r.id)));

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
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Restore a resource from recycle bin
  const restoreFromRecycleBin = async (
    resourceId: string,
    resourceTitle: string
  ): Promise<boolean> => {
    const toastId = toast.loading(`Restoring ${resourceTitle}...`);

    try {
      // Find resource in the current resources array
      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) {
        throw new Error('Resource not found');
      }

      // TEMPORARY IMPLEMENTATION (localStorage)
      const storedMetadata = localStorage.getItem('resourceMetadata');
      const metadataMap = storedMetadata ? JSON.parse(storedMetadata) : {};

      // Update metadata for the resource
      if (metadataMap[resource.fileName]) {
        metadataMap[resource.fileName].isDeleted = false;
        delete metadataMap[resource.fileName].deletedAt;
        delete metadataMap[resource.fileName].deletedBy;

        // Save updated metadata back to localStorage
        localStorage.setItem('resourceMetadata', JSON.stringify(metadataMap));
      }

      // Update the resources state to reflect the restoration
      setResources(
        resources.map((r) =>
          r.id === resourceId ? { ...r, isDeleted: false, deletedAt: undefined } : r
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
      throw err;
    }
  };

  // Permanently delete a resource (from Jeetix and metadata)
  const permanentlyDeleteResource = async (
    resourceFileName: string,
    resourceTitle: string
  ): Promise<boolean> => {
    setIsDeleting(true);
    const toastId = toast.loading(`Permanently deleting ${resourceTitle}...`);

    try {
      // Delete from Jeetix
      const response = await fetch(
        `https://jeetix-file-service.onrender.com/api/storage/delete/${encodeURIComponent(resourceFileName)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete resource');
      }

      // TEMPORARY IMPLEMENTATION (localStorage)
      // Remove metadata from localStorage
      const storedMetadata = localStorage.getItem('resourceMetadata');
      if (storedMetadata) {
        const metadataMap = JSON.parse(storedMetadata);
        if (metadataMap[resourceFileName]) {
          delete metadataMap[resourceFileName];
          localStorage.setItem('resourceMetadata', JSON.stringify(metadataMap));
        }
      }

      // Remove from the resources state
      setResources(resources.filter((r) => r.fileName !== resourceFileName));

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
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle successful deletion by updating state
  const handleDeleteSuccess = (resourceId: string) => {
    setResources(resources.filter((r) => r.id !== resourceId));
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
