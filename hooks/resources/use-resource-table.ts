import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import { Resource } from '@/types/interfaces/resource';

interface UseResourceTableProps {
  resources: Resource[];
  token: string;
  userRole: 'admin' | 'user';
  onRefresh: () => void;
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
}

const useResourceTable = ({
  resources,
  token,
  userRole,
  onRefresh,
  onDeleteResource,
  onDeleteMultiple,
  onRestoreResource,
  onRestoreMultiple,
}: UseResourceTableProps) => {
  const router = useRouter();

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Record<string, boolean>>({});

  const selectedCount = useMemo(
    () => Object.values(selectedResources).filter(Boolean).length,
    [selectedResources]
  );

  const hasMultipleSelected = useMemo(() => selectedCount > 1, [selectedCount]);

  const selectedResourceIds = useMemo(
    () =>
      Object.entries(selectedResources)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id),
    [selectedResources]
  );

  const clearSelection = useCallback(() => {
    setSelectedResources({});
  }, []);

  useEffect(() => {
    clearSelection();
  }, [clearSelection]);

  const toggleSelection = useCallback((resource: Resource, event: React.MouseEvent) => {
    const isMultiSelectKey = event.ctrlKey || event.metaKey;

    setSelectedResources((prev) => {
      const newSelection = { ...prev };

      if (!isMultiSelectKey) {
        if (prev[resource.resourceId] && Object.values(prev).filter(Boolean).length === 1) {
          newSelection[resource.resourceId] = false;
          return newSelection;
        }

        Object.keys(newSelection).forEach((id) => {
          newSelection[id] = false;
        });
      }

      newSelection[resource.resourceId] = !prev[resource.resourceId];
      return newSelection;
    });
  }, []);

  const selectAll = useCallback(() => {
    const newSelection = { ...selectedResources };
    const allSelected = resources.every((item) => selectedResources[item.resourceId]);

    resources.forEach((item) => {
      newSelection[item.resourceId] = !allSelected;
    });

    setSelectedResources(newSelection);
  }, [resources, selectedResources]);

  const handleDoubleClick = useCallback(
    (resource: Resource) => {
      clearSelection();
      const viewPath =
        userRole === 'admin'
          ? `/admin/resources/view/${resource.resourceId}`
          : `/student/resources/view/${resource.resourceId}`;
      router.push(viewPath);
    },
    [router, clearSelection, userRole]
  );

  const handleViewAnalytics = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowAnalytics(true);
  };

  const handleEditResource = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  const handleDeleteResource = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const handleDeleteSelected = () => {
    if (selectedCount > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      let success = false;

      if (selectedResource && !hasMultipleSelected) {
        if (onDeleteResource) {
          success = await onDeleteResource(selectedResource.resourceId);
        }
      } else if (hasMultipleSelected) {
        if (onDeleteMultiple) {
          success = await onDeleteMultiple(selectedResourceIds);
        }
      }

      if (success) {
        clearSelection();
        setShowDeleteModal(false);
        setSelectedResource(null);
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      toast.error('Failed to delete resource(s)', {
        description: message,
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmRestore = async () => {
    setIsDeleting(true);

    try {
      let success = false;

      if (selectedResource && !hasMultipleSelected) {
        if (onRestoreResource) {
          success = await onRestoreResource(selectedResource.resourceId);
        }
      } else if (hasMultipleSelected) {
        if (onRestoreMultiple) {
          success = await onRestoreMultiple(selectedResourceIds);
        }
      }

      if (success) {
        clearSelection();
        setShowDeleteModal(false);
        setSelectedResource(null);
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      toast.error('Failed to restore resource(s)', {
        description: message,
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveResource = async (updatedResource: Resource) => {
    setIsEditing(true);

    try {
      const updatePayload = {
        title: updatedResource.title,
        description: updatedResource.description,
        category: updatedResource.category,
        fileUrls: updatedResource.fileUrls,
        visibility: updatedResource.visibility,
        academicLevel: updatedResource.academicLevel,
        department: updatedResource.department,
      };

      const response = await axios.patch(
        `${BASE_URL}/resources/${updatedResource.resourceId}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        toast.success('Resource updated successfully');
        onRefresh();
        setShowEditModal(false);
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
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    selectAll,
    isDeleting,
    selectedCount,
    confirmDelete,
    showEditModal,
    showAnalytics,
    confirmRestore,
    clearSelection,
    showDeleteModal,
    toggleSelection,
    selectedResource,
    setShowEditModal,
    setShowAnalytics,
    selectedResources,
    handleDoubleClick,
    setShowDeleteModal,
    handleSaveResource,
    handleEditResource,
    handleViewAnalytics,
    selectedResourceIds,
    hasMultipleSelected,
    setSelectedResource,
    handleDeleteResource,
    handleDeleteSelected,
  };
};

export default useResourceTable;
