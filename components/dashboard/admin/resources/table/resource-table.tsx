import {
  FileText,
  Download,
  File,
  Image as ImageIcon,
  Video,
  BarChart2,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import { Resource } from '@/types';
import useResourceTable from '@/hooks/admin/use-resource-table';
import ResourceTableSkeleton from './resource-table-skeleton';
import ResourceFilters from './resource-table-filters';
import ResourceAnalytics from '../modals/analytics-resource-modal';
import ResourceEditModal from '../modals/edit-resource-modal';
import DeleteResourceModal from '../modals/delete-resource-modal';
import formatDepartment from '@/utils/admin/format-department';
import { EmptyState, NetworkError, NoResults } from '@/components/error-message';

interface ResourceTableProps {
  resources: Resource[];
  isLoading: boolean;
  isError?: boolean;
  onDeleteResource: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple: (resourceIds: string[]) => Promise<boolean>;
  onRefresh: () => void;
}

const ResourceTable = ({
  resources,
  isLoading,
  isError = false,
  onDeleteResource,
  onDeleteMultiple,
  onRefresh,
}: ResourceTableProps) => {
  const {
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
    currentItems,
    filteredResources,
    handleDownload,
    handleViewAnalytics,
    handleEditResource,
    handleDeleteResource,
    handleDeleteSelected,
    confirmDelete,
    handleSaveResource,
    showAnalytics,
    setShowAnalytics,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    selectedResource,
    fileTypes,
    categories,
    totalPages,
    currentPage,
    getPaginationInfo,
    paginate,
    nextPage,
    prevPage,
    clearFilters,
    selectedResources,
    selectedCount,
    hasMultipleSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    handleDoubleClick,
  } = useResourceTable(resources, onRefresh, onDeleteResource, onDeleteMultiple);

  // Function to get the appropriate icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-5 w-5 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get visibility icon
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'all':
        return <Users className="h-4 w-4 text-green-500 mr-1" />;
      case 'admin':
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
              ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
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
        category={category}
        fileType={fileType}
        fileTypes={fileTypes}
        department={department}
        visibility={visibility}
        searchTerm={searchTerm}
        categories={categories}
        setCategory={setCategory}
        setFileType={setFileType}
        clearFilters={clearFilters}
        setDepartment={setDepartment}
        setSearchTerm={setSearchTerm}
        setVisibility={setVisibility}
      />
      {/*==================== End of Filter Component ====================*/}

      {/*==================== Multiple Selection Action Bar ====================*/}
      {hasMultipleSelected && (
        <div className="bg-blue-50 border border-blue-100 mb-4 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-800 font-medium">{selectedCount} resources selected</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={clearSelection} className="text-gray-600 hover:text-gray-800 text-sm">
              Clear Selection
            </button>
            <button onClick={selectAll} className="text-gray-600 hover:text-gray-800 text-sm">
              {currentItems.every((item) => selectedResources[item.id])
                ? 'Deselect All'
                : 'Select All'}
            </button>
            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center rounded-lg bg-amber-50 text-amber-600 px-3 py-1.5 text-sm font-medium hover:bg-amber-100"
            >
              <Trash className="mr-1.5 h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
      {/*==================== End of Multiple Selection Action Bar ====================*/}

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
                Showing {currentItems.length} of {filteredResources.length} resources
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
              {/*==================== Table Head ====================*/}
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
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 w-32"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              {/*==================== End of Table Head ====================*/}

              {/*==================== Table Body ====================*/}
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map((resource) => (
                  <tr
                    key={resource.id}
                    onClick={(e) => toggleSelection(resource, e)}
                    onDoubleClick={() => handleDoubleClick(resource)}
                    className={`even:bg-gray-100/80 hover:bg-gray-200/60 border-none transition-colors cursor-pointer ${
                      selectedResources[resource.id] ? 'bg-amber-100/50' : ''
                    }`}
                  >
                    {/*==================== Resource Column ====================*/}
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                          {getFileIcon(resource.type)}
                        </div>
                        <div className="ml-4 max-w-xs">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600 mr-2 truncate max-w-[180px]">
                              {resource.title}
                            </span>
                            {getVisibilityIcon(resource.visibility)}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[180px]">
                            {resource.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/*==================== End of Resource Column ====================*/}

                    {/*==================== Department Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-1.5 py-0.5 text-md font-medium text-gray-500">
                        {formatDepartment(resource.department)}
                      </span>
                    </td>
                    {/*==================== End of Department Column ====================*/}

                    {/*==================== Type Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      <span className="uppercase">{resource.type}</span>
                    </td>
                    {/*==================== End of Type Column ====================*/}

                    {/*==================== Size Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {resource.fileSize}
                    </td>
                    {/*==================== End of Size Column ====================*/}

                    {/*==================== Usage Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span>{resource.downloads}</span>
                        <span className="text-gray-300">|</span>
                        <span>{resource.viewCount}</span>
                      </div>
                    </td>
                    {/*==================== End of Usage Column ====================*/}

                    {/*==================== Category Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-1.5 gap-2 py-0.5 text-md font-medium text-slate-500`}
                      >
                        {resource.category}
                      </span>
                    </td>
                    {/*==================== End of Category Column ====================*/}

                    {/*==================== Actions Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleEditResource(resource, e)}
                          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                          title="Edit Resource"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={(e) => handleDownload(resource, e)}
                          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                          title="Download Resource"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        <button
                          onClick={(e) => handleViewAnalytics(resource, e)}
                          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                          title="View Analytics"
                        >
                          <BarChart2 className="h-4 w-4" />
                        </button>

                        {/*==================== Delete Button - Only visible when row is selected ====================*/}
                        {selectedResources[resource.id] && (
                          <button
                            onClick={(e) => handleDeleteResource(resource, e)}
                            className="rounded-full p-1.5 text-amber-500 hover:bg-amber-50"
                            title="Delete Resource"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                        {/*==================== End of Delete Button - Only visible when row is selected ====================*/}
                      </div>
                    </td>
                    {/*==================== End of Actions Column ====================*/}
                  </tr>
                ))}
              </tbody>
              {/*==================== End of Table Body ====================*/}
            </table>
          </div>

          {/*==================== Pagination Controls ====================*/}
          {filteredResources.length > 0 && (
            <div className="border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, filteredResources.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredResources.length}</span> results
                  </p>
                </div>

                <div>
                  <nav
                    aria-label="Pagination"
                    className="isolate inline-flex -space-x-px rounded-md"
                  >
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {renderPaginationButtons()}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
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
          <ResourceAnalytics resource={selectedResource} onClose={() => setShowAnalytics(false)} />
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

      {/*==================== Delete Modal ====================*/}
      {showDeleteModal && (
        <DeleteResourceModal
          isOpen={showDeleteModal}
          isDeleting={isDeleting}
          resourceCount={hasMultipleSelected ? selectedCount : 1}
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {/*==================== End of Delete Modal ====================*/}
    </>
  );
};

export default ResourceTable;
