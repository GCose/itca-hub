import {
  FileText,
  Trash,
  Download,
  File,
  Image as ImageIcon,
  Video,
  BarChart2,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Archive,
  Users,
  ShieldAlert,
  Edit,
} from "lucide-react";
import { Resource } from "@/hooks/admin/use-resources";
import useResourceTable from "@/hooks/admin/use-resource-table";
import ResourceTableSkeleton from "./resource-table-skeleton";
import ResourceFilters from "./resource-table-filters";
import ResourceAnalytics from "../modals/analytics-resource-modal";
import ResourceEditModal from "../modals/edit-resource-modal";
import formatDepartment from "@/utils/admin/format-department";
import {
  EmptyState,
  NetworkError,
  NoResults,
} from "@/components/error-message";

interface ResourceTableProps {
  resources: Resource[];
  isLoading: boolean;
  isError?: boolean;
  onDeleteClick: (resource: Resource) => void;
  onRefresh: () => void;
}

const ResourceTable = ({
  resources,
  isLoading,
  isError = false,
  onDeleteClick,
  onRefresh,
}: ResourceTableProps) => {
  const {
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
    currentItems,
    filteredResources,
    handleDownload,
    handleViewAnalytics,
    handleEditResource,
    handleSaveResource,
    showAnalytics,
    setShowAnalytics,
    showEditModal,
    setShowEditModal,
    selectedResource,
    fileTypes,
    totalPages,
    currentPage,
    getPaginationInfo,
    paginate,
    nextPage,
    prevPage,
  } = useResourceTable(resources, onRefresh, onDeleteClick);

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDepartment("all");
    setFileType("all");
    setStatus("all");
    setVisibility("all");
  };

  // Function to get the appropriate icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-5 w-5 text-purple-500" />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500 mr-1" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-500 mr-1" />;
      default:
        return null;
    }
  };

  // Function to get visibility icon
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "students":
        return <Users className="h-4 w-4 text-green-500 mr-1" />;
      case "admin":
        return <ShieldAlert className="h-4 w-4 text-purple-500 mr-1" />;
      default:
        return null;
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const { startPage, endPage } = getPaginationInfo();

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
            currentPage === i
              ? "bg-blue-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Loading state
  if (isLoading) {
    return <ResourceTableSkeleton />;
  }

  return (
    <>
      {/*==================== Filter Component ====================*/}
      <ResourceFilters
        status={status}
        fileType={fileType}
        fileTypes={fileTypes}
        setStatus={setStatus}
        department={department}
        visibility={visibility}
        searchTerm={searchTerm}
        setFileType={setFileType}
        clearFilters={clearFilters}
        setSearchTerm={setSearchTerm}
        setVisibility={setVisibility}
        setDepartment={setDepartment}
      />
      {/*==================== End of Filter Component ====================*/}

      {/*==================== Error States ====================*/}
      {isError && <NetworkError onRetry={onRefresh} />}

      {!isError && resources.length === 0 && (
        <EmptyState
          uploadUrl="/admin/resources/upload"
          description="Get started by uploading your first educational resource to the library."
        />
      )}

      {!isError && resources.length > 0 && filteredResources.length === 0 && (
        <NoResults filterTerm={searchTerm} onClearFilters={clearFilters} />
      )}
      {/*==================== End of Error States ====================*/}

      {/*==================== Results Table ====================*/}
      {!isError && filteredResources.length > 0 && (
        <div className="rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">Resources</h3>
            <div className="flex items-center mt-2 sm:mt-0">
              <p className="text-sm text-gray-500">
                Showing {currentItems.length} of {filteredResources.length}{" "}
                resources
              </p>
              <button
                onClick={onRefresh}
                title="Refresh resources"
                className="ml-3 p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Resource
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Usage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map((resource) => (
                  <tr
                    key={resource.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                          {getFileIcon(resource.type)}
                        </div>
                        <div className="ml-4 max-w-xs">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2 truncate max-w-[200px]">
                              {resource.title}
                            </span>
                            {getVisibilityIcon(resource.visibility)}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[250px]">
                            {resource.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        {formatDepartment(resource.department)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="uppercase">{resource.type}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {resource.fileSize}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span>{resource.downloads}</span>
                        <span className="text-gray-300">|</span>
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span>{resource.viewCount}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          resource.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusIcon(resource.status)}
                        {resource.status.charAt(0).toUpperCase() +
                          resource.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="relative inline-block text-left resource-menu">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditResource(resource)}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                            title="Edit Resource"
                          >
                            <Edit className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handleDownload(resource)}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                            title="Download Resource"
                          >
                            <Download className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handleViewAnalytics(resource)}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                            title="View Statistics"
                          >
                            <BarChart2 className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => onDeleteClick(resource)}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                            title="Delete Resource"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*==================== Pagination Controls ====================*/}
          {filteredResources.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 5 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 5, filteredResources.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredResources.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={prevPage}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {renderPaginationButtons()}

                    <button
                      onClick={nextPage}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          {/*==================== End of Pagination Controls ====================*/}
        </div>
      )}
      {/*==================== End of Results Table ====================*/}

      {/*==================== Analytics Modal ====================*/}
      {showAnalytics && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <ResourceAnalytics
            resource={selectedResource}
            onClose={() => setShowAnalytics(false)}
          />
        </div>
      )}
      {/*==================== End of Analytics Modal ====================*/}

      {/*==================== Edit Modal ====================*/}
      {showEditModal && selectedResource && (
        <ResourceEditModal
          isOpen={showEditModal}
          resource={selectedResource}
          onSave={handleSaveResource}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {/*==================== End of Edit Modal ====================*/}
    </>
  );
};

export default ResourceTable;
