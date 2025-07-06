import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { Resource, UpdateResourcePayload } from '@/types';
import { BASE_URL } from '@/utils/url';
import useResourceAnalytics from './use-resource-analytics';

const useResourceTable = (
  resources: Resource[],
  token: string,
  onRefresh: () => void,
  onDeleteResource: (resourceId: string) => Promise<boolean>,
  onDeleteMultiple: (resourceIds: string[]) => Promise<boolean>
) => {
  const router = useRouter();

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
  const [selectedResources, setSelectedResources] = useState<Record<string, boolean>>({});
  const itemsPerPage = 10;

  const { trackResourceDownload } = useResourceAnalytics({ token });

  const fileTypes = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.type))].sort();
  }, [resources]);

  const categories = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.category))].sort();
  }, [resources]);

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

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredResources, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

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
    const isMultiSelectKey = event.ctrlKey || event.metaKey;

    setSelectedResources((prev) => {
      const newSelection = { ...prev };

      // If multi-select key is not pressed, clear other selections
      if (!isMultiSelectKey) {
        if (prev[resource.resourceId] && Object.values(prev).filter(Boolean).length === 1) {
          newSelection[resource.resourceId] = false;
          return newSelection;
        }

        Object.keys(newSelection).forEach((id) => {
          newSelection[id] = false;
        });
      }

      // Toggle the clicked resource
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
      // Clear any selections first
      clearSelection();
      router.push(`/admin/resources/view/${resource.resourceId}`);
    },
    [router, clearSelection]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  /**====================
   * Download resource
   ====================*/
  const handleDownload = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    try {
      // Track the download first
      await trackResourceDownload(resource.resourceId, token);

      const fileName = resource.fileName;

      // Try to get the proper download link from Jeetix
      const jeetixResponse = await fetch(
        `https://jeetix-file-service.onrender.com/api/storage/file/${encodeURIComponent(fileName)}`
      );

      if (jeetixResponse.ok) {
        const jeetixData = await jeetixResponse.json();
        if (jeetixData.status === 'success' && jeetixData.data.metadata?.mediaLink) {
          // Use the mediaLink for direct download
          const link = document.createElement('a');
          link.href = jeetixData.data.metadata.mediaLink;
          link.download = resource.title || fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success('Download started', {
            description: `${resource.title} is being downloaded.`,
          });
          return;
        }
      }

      // Fallback to direct URL
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.title || fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started', {
        description: `${resource.title} is being downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Download failed', {
        description: 'Please try again or contact support.',
      });
    }
  };

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

  const handleSaveResource = async (updatedResource: Resource) => {
    setIsEditing(true);
    try {
      const updatePayload: UpdateResourcePayload = {
        title: updatedResource.title,
        description: updatedResource.description,
        category: updatedResource.category,
        visibility: updatedResource.visibility,
        academicLevel: updatedResource.academicLevel,
        department: updatedResource.department,
      };

      const response = await fetch(`${BASE_URL}/resources/${updatedResource.resourceId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update resource');
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to update resource');
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
