import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import useResourceAnalytics from './use-resource-analytics';
import { useRouter } from 'next/router';
import { Resource } from '@/types';

const useResourceTable = (
  resources: Resource[],
  onRefresh: () => void,
  onDeleteResource: (resourceId: string) => Promise<boolean>,
  onDeleteMultiple: (resourceIds: string[]) => Promise<boolean>
) => {
  const router = useRouter();

  // Basic state definitions
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [fileType, setFileType] = useState('all');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selection state
  const [selectedResources, setSelectedResources] = useState<Record<string, boolean>>({});
  const itemsPerPage = 10;

  // Using the analytics hooks
  const { trackResourceDownload } = useResourceAnalytics();

  /**=======================
   * Get unique file types
   =======================*/
  const fileTypes = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.type))].sort();
  }, [resources]);

  /**=======================
   * Get unique categories
   =======================*/
  const categories = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.category))].sort();
  }, [resources]);

  /**===========================================
   * Calculate how many resources are selected
   ===========================================*/
  const selectedCount = useMemo(
    () => Object.values(selectedResources).filter(Boolean).length,
    [selectedResources]
  );

  // Check if multiple resources are selected
  const hasMultipleSelected = useMemo(() => selectedCount > 1, [selectedCount]);

  /**====================================
   * Get array of selected resource IDs
   ====================================*/
  const selectedResourceIds = useMemo(
    () =>
      Object.entries(selectedResources)
        .filter((entry) => entry[1]) // Use entry[1] which is the boolean value
        .map((entry) => entry[0]), // Use entry[0] which is the ID
    [selectedResources]
  );

  /**===============================================================================
   * Filter resources based on search, department, type, category, and visibility
   ===============================================================================*/
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = department === 'all' || resource.department === department;

      const matchesType = fileType === 'all' || resource.type === fileType;

      const matchesCategory = category === 'all' || resource.category === category;

      const matchesVisibility = visibility === 'all' || resource.visibility === visibility;

      return (
        matchesSearch && matchesDepartment && matchesType && matchesCategory && matchesVisibility
      );
    });
  }, [resources, searchTerm, department, fileType, category, visibility]);

  /**=========================
   * Get current page items
   =========================*/
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredResources, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  // Clear all selections - define this before the useEffect that uses it
  const clearSelection = useCallback(() => {
    setSelectedResources({});
  }, []);

  // Reset selection when page changes or filters change
  useEffect(() => {
    clearSelection();
  }, [currentPage, searchTerm, department, fileType, category, visibility, clearSelection]);

  /**=======================================
   * Handle single row selection (toggle)
   =======================================*/
  const toggleSelection = useCallback((resource: Resource, event: React.MouseEvent) => {
    // Check if Ctrl/Cmd key is pressed for multi-select
    const isMultiSelectKey = event.ctrlKey || event.metaKey;

    setSelectedResources((prev) => {
      const newSelection = { ...prev };

      // If multi-select key is not pressed, clear other selections
      if (!isMultiSelectKey) {
        // If the resource is already the only one selected, toggle it off
        if (prev[resource.id] && Object.values(prev).filter(Boolean).length === 1) {
          newSelection[resource.id] = false;
          return newSelection;
        }

        // Otherwise clear everything and select just this one
        Object.keys(newSelection).forEach((id) => {
          newSelection[id] = false;
        });
      }

      // Toggle the clicked resource
      newSelection[resource.id] = !prev[resource.id];
      return newSelection;
    });
  }, []);

  /**=======================================
   * Select all resources on current page
   =======================================*/
  const selectAll = useCallback(() => {
    const newSelection = { ...selectedResources };

    // Check if all current items are already selected
    const allSelected = currentItems.every((item) => selectedResources[item.id]);

    // Toggle: select all if not all selected, otherwise deselect all
    currentItems.forEach((item) => {
      newSelection[item.id] = !allSelected;
    });

    setSelectedResources(newSelection);
  }, [currentItems, selectedResources]);

  /**====================================================
   * Handle double-click to navigate to resource viewer
   ====================================================*/
  const handleDoubleClick = useCallback(
    (resource: Resource) => {
      router.push(`/admin/resources/view/${encodeURIComponent(resource.fileName)}`);
    },
    [router]
  );

  /**=============
   * Change page
   =============*/
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  /**====================
   * Download resource
   ====================*/
  const handleDownload = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent row selection

    try {
      // Track the download for analytics
      await trackResourceDownload(resource.id);

      // Use API to initiate the download
      const link = document.createElement('a');
      link.href = `/api/resources/download/${resource.id}`;
      link.download = resource.fileName || resource.title || 'resource';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Failed to download resource');
    }
  };

  /**==========================
   * View resource analytics
   ==========================*/
  const handleViewAnalytics = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent row selection

    setSelectedResource(resource);
    setShowAnalytics(true);
  };

  /**===============
   * Edit resource
   ===============*/
  const handleEditResource = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent row selection

    setSelectedResource(resource);
    setShowEditModal(true);
  };

  /**===========================
   * Delete a single resource
   ===========================*/
  const handleDeleteResource = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent row selection

    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  /**============================
   * Delete multiple resources
   ============================*/
  const handleDeleteSelected = () => {
    if (selectedCount > 0) {
      setShowDeleteModal(true);
    }
  };

  /**===============================================
   * Confirm delete (for both single and multiple)
   ===============================================*/
  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      let success = false;

      // Single resource deletion
      if (selectedResource && !hasMultipleSelected) {
        success = await onDeleteResource(selectedResource.id);
      }
      // Multiple resource deletion
      else if (hasMultipleSelected) {
        success = await onDeleteMultiple(selectedResourceIds);
      }

      if (success) {
        // Clear selection and modals
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

  /**======================
   * Save edited resource
   ======================*/
  const handleSaveResource = async (updatedResource: Resource) => {
    setIsEditing(true);
    try {
      // LOCALSTORAGE IMPLEMENTATION (TEMPORARY)

      // Get existing metadata
      const storedMetadata = localStorage.getItem('resourceMetadata');
      const metadataMap = storedMetadata ? JSON.parse(storedMetadata) : {};

      // Update the resource metadata
      metadataMap[updatedResource.fileName] = {
        fileName: updatedResource.fileName,
        fileUrl: updatedResource.fileUrl,
        title: updatedResource.title,
        description: updatedResource.description,
        department: updatedResource.department,
        visibility: updatedResource.visibility,
        category: updatedResource.category,
      };

      // Save back to localStorage
      localStorage.setItem('resourceMetadata', JSON.stringify(metadataMap));

      // Show success message
      toast.success('Resource updated successfully');

      // Refresh resources
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

  /**==================================
   * Generate pagination information
   ==================================*/
  const getPaginationInfo = () => {
    // Pagination with limit of buttons
    const maxButtons = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return { startPage, endPage };
  };

  /**====================
   * Clear all filters
   ====================*/
  const clearFilters = () => {
    setSearchTerm('');
    setDepartment('all');
    setFileType('all');
    setCategory('all');
    setVisibility('all');
  };

  return {
    searchTerm,
    setSearchTerm,
    department,
    setDepartment,
    fileType,
    setFileType,
    category,
    setCategory,
    visibility,
    setVisibility,
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
    fileTypes,
    categories,
    filteredResources,
    currentItems,
    totalPages,
    handleDownload,
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
    clearFilters,
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
