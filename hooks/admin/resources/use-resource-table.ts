import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { Resource } from '@/types';
import { ResourceAdapter } from '@/utils/resource-adapter';
import { apiClient } from '@/utils/api';

const useResourceTable = (
  resources: Resource[],
  token: string,
  userRole: 'admin' | 'user',
  onRefresh: () => void,
  onDeleteResource: (resourceId: string) => Promise<boolean>,
  onDeleteMultiple: (resourceIds: string[]) => Promise<boolean>
) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Record<string, boolean>>({});
  const itemsPerPage = 10;

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

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return resources.slice(indexOfFirstItem, indexOfLastItem);
  }, [resources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(resources.length / itemsPerPage);

  const clearSelection = useCallback(() => {
    setSelectedResources({});
  }, []);

  useEffect(() => {
    clearSelection();
    setCurrentPage(1);
  }, [resources, clearSelection]);

  /**=======================================
   * Handle single row selection (toggle)
   =======================================*/
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

  /**=======================================
   * Select all resources on current page
   =======================================*/
  const selectAll = useCallback(() => {
    const newSelection = { ...selectedResources };
    const allSelected = currentItems.every((item) => selectedResources[item.resourceId]);

    currentItems.forEach((item) => {
      newSelection[item.resourceId] = !allSelected;
    });

    setSelectedResources(newSelection);
  }, [currentItems, selectedResources]);

  /**====================================================
   * Handle double-click to navigate to resource viewer
   ====================================================*/
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
        success = await onDeleteResource(selectedResource.resourceId);
      } else if (hasMultipleSelected) {
        success = await onDeleteMultiple(selectedResourceIds);
      }

      if (success) {
        clearSelection();
        setShowDeleteModal(false);
        setSelectedResource(null);
      }
    } catch (error) {
      console.error('Error deleting resource(s):', error);
      toast.error('Failed to delete resource(s)');
    } finally {
      setIsDeleting(false);
    }
  };

  /**=========================================
   * Save resource changes using apiClient
   =========================================*/
  const handleSaveResource = async (updatedResource: Resource) => {
    setIsEditing(true);
    try {
      const updatePayload = ResourceAdapter.toUpdatePayload(updatedResource);

      const response = await apiClient.updateResource(
        updatedResource.resourceId,
        updatePayload,
        token
      );

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update resource');
      }

      toast.success('Resource updated successfully');
      onRefresh();
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource');
      throw error;
    } finally {
      setIsEditing(false);
      setShowEditModal(false);
    }
  };

  const getPaginationInfo = () => {
    const maxButtons = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return { startPage, endPage };
  };

  return {
    currentPage,
    setCurrentPage,
    selectedResource,
    setSelectedResource,
    showAnalytics,
    setShowAnalytics,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    isEditing,
    itemsPerPage,
    currentItems,
    totalPages,
    handleViewAnalytics,
    handleEditResource,
    handleDeleteResource,
    handleDeleteSelected,
    confirmDelete,
    handleSaveResource,
    getPaginationInfo,
    paginate,
    nextPage,
    prevPage,
    selectedResources,
    selectedCount,
    hasMultipleSelected,
    selectedResourceIds,
    toggleSelection,
    selectAll,
    clearSelection,
    handleDoubleClick,
  };
};

export default useResourceTable;
