import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Resource } from "./use-resources";
import useResourceAnalytics from "./use-resource-analytics";

const useResourceTable = (
  resources: Resource[],
  onRefresh: () => void,
  onDeleteClick: (resource: Resource) => void
) => {
  // All the state definitions with their setters
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("all");
  const [fileType, setFileType] = useState("all");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const itemsPerPage = 5;

  // Using the analytics hooks
  const { trackResourceDownload } = useResourceAnalytics();

  // Get unique file types
  const fileTypes = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.type))].sort();
  }, [resources]);

  // Filter resources based on search, department, type, status, and visibility
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        department === "all" || resource.department === department;

      const matchesType = fileType === "all" || resource.type === fileType;

      const matchesStatus = status === "all" || resource.status === status;

      const matchesVisibility =
        visibility === "all" || resource.visibility === visibility;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesType &&
        matchesStatus &&
        matchesVisibility
      );
    });
  }, [resources, searchTerm, department, fileType, status, visibility]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, department, fileType, status, visibility]);

  // Get current page items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredResources, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Download resource
  const handleDownload = (resource: Resource) => {
    trackResourceDownload(resource.id);
    window.open(resource.fileUrl, "_blank");
  };

  // View resource analytics
  const handleViewAnalytics = (resource: Resource) => {
    setSelectedResource(resource);
    setShowAnalytics(true);
  };

  // Edit resource
  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  // Save edited resource
  const handleSaveResource = async (updatedResource: Resource) => {
    setIsEditing(true);
    try {
      // LOCALSTORAGE IMPLEMENTATION (TEMPORARY)
      // Get existing metadata
      const storedMetadata = localStorage.getItem("resourceMetadata");
      const metadataMap = storedMetadata ? JSON.parse(storedMetadata) : {};

      // Update the resource metadata
      metadataMap[updatedResource.fileName] = {
        fileName: updatedResource.fileName,
        fileUrl: updatedResource.fileUrl,
        title: updatedResource.title,
        description: updatedResource.description,
        department: updatedResource.department,
        visibility: updatedResource.visibility,
        status: updatedResource.status,
      };

      // Save back to localStorage
      localStorage.setItem("resourceMetadata", JSON.stringify(metadataMap));

      // BACKEND API IMPLEMENTATION (I WILL UNCOMMENT THIS OUT WHEN BACKEND IS READY)
      /*
      const response = await fetch(`/api/resources/metadata/${encodeURIComponent(updatedResource.fileName)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedResource.title,
          description: updatedResource.description,
          department: updatedResource.department,
          visibility: updatedResource.visibility,
          status: updatedResource.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update resource metadata');
      }
      */

      // Show success message
      toast.success("Resource updated successfully");

      // Refresh resources
      onRefresh();
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
      throw error;
    } finally {
      setIsEditing(false);
      setShowEditModal(false);
    }
  };

  // Generate pagination information
  const getPaginationInfo = () => {
    // Pagination with limit of 5 page buttons
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    return { startPage, endPage };
  };

  // Return all state variables, setters, and functions
  return {
    searchTerm,
    setSearchTerm,
    department,
    setDepartment,
    fileType,
    setFileType,
    status,
    setStatus,
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
    isEditing,
    setIsEditing,
    itemsPerPage,
    fileTypes,
    filteredResources,
    currentItems,
    totalPages,
    handleDownload,
    handleViewAnalytics,
    handleEditResource,
    handleSaveResource,
    getPaginationInfo,
    paginate,
    nextPage,
    prevPage,
    isLoading: false,
    onDeleteClick,
  };
};

export default useResourceTable;
