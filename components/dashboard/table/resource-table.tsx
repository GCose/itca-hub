import {
  Download,
  BarChart2,
  Edit,
  Trash,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldAlert,
  RefreshCw,
  Eye,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Laptop,
  Database,
  Radio,
} from 'lucide-react';
import { Resource } from '@/types/interfaces/resource';
import { useState, useEffect } from 'react';
import useResourceTable from '@/hooks/resources/use-resource-table';
import useResources from '@/hooks/resources/use-resource';
import ResourceTableSkeleton from '../skeletons/resource-table-skeleton';
import formatDepartment from '@/utils/format-department';
import { EmptyState, NetworkError, NoResults } from '@/components/dashboard/error-messages';
import { toast } from 'sonner';
import ResourceEditModal from '../modals/resources/edit-resource-modal';
import ResourceAnalytics from '../modals/resources/analytics-resource-modal';
import DeleteResourceModal from '../modals/resources/delete-resource-modal';

interface ResourceTableProps {
  resources: Resource[];
  allResources: Resource[];
  isLoading: boolean;
  isError?: boolean;
  token: string;
  searchTerm: string;
  userRole: 'admin' | 'user';
  mode?: 'default' | 'recycleBin';
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRefresh: () => void;
  onClearFilters: () => void;
  total: number;
  totalPages: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

const ResourceTable = ({
  resources,
  allResources,
  isLoading,
  isError = false,
  token,
  searchTerm,
  userRole,
  mode = 'default',
  onDeleteResource,
  onDeleteMultiple,
  onRestoreResource,
  onRestoreMultiple,
  onRefresh,
  onClearFilters,
  total,
  totalPages,
  page,
  setPage,
  limit,
}: ResourceTableProps) => {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  /**===============================================
   * Load bookmarks from localStorage on mount
   ===============================================*/
  useEffect(() => {
    if (userRole === 'user') {
      const savedBookmarks = localStorage.getItem('studentBookmarks');
      if (savedBookmarks) {
        try {
          setBookmarks(JSON.parse(savedBookmarks));
        } catch (error) {
          console.error('Error loading bookmarks:', error);
        }
      }
    }
  }, [userRole]);

  const { downloadResource } = useResources({ token });

  const {
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
    handleDeleteResource: handleDeleteClick,
    handleDeleteSelected,
  } = useResourceTable({
    resources,
    token,
    userRole,
    onRefresh,
    onDeleteResource,
    onDeleteMultiple,
    onRestoreResource,
    onRestoreMultiple,
  });

  /**===============================================
   * Save bookmarks to localStorage
   ===============================================*/
  const saveBookmarks = (newBookmarks: Record<string, boolean>) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('studentBookmarks', JSON.stringify(newBookmarks));
  };

  /**===============================================
   * Toggle bookmark for a resource
   ===============================================*/
  const toggleBookmark = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const newBookmarks = { ...bookmarks };
    const isCurrentlyBookmarked = bookmarks[resource.resourceId];

    if (isCurrentlyBookmarked) {
      delete newBookmarks[resource.resourceId];
      toast.success('Bookmark removed', {
        description: `${resource.title} has been removed from bookmarks.`,
      });
    } else {
      newBookmarks[resource.resourceId] = true;
      toast.success('Bookmark added', {
        description: `${resource.title} has been added to bookmarks.`,
      });
    }

    saveBookmarks(newBookmarks);
  };

  /**===============================================
   * Handle restoring a single resource
   ===============================================*/
  const handleRestoreResource = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onRestoreResource) {
      await onRestoreResource(resource.resourceId);
    }
  };

  /**===============================================
   * Handle restoring multiple resources
   ===============================================*/
  const handleRestoreSelected = () => {
    if (selectedCount > 0 && onRestoreMultiple) {
      onRestoreMultiple(selectedResourceIds);
    }
  };

  // Function to get the appropriate icon based on department
  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'computer_science':
        return <Laptop className="h-5 w-5 text-blue-500" />;
      case 'information_systems':
        return <Database className="h-5 w-5 text-green-500" />;
      case 'telecommunications':
        return <Radio className="h-5 w-5 text-purple-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get visibility icon (admin only)
  const getVisibilityIcon = (visibility: string) => {
    if (userRole === 'user') return null;

    switch (visibility) {
      case 'all':
        return <Users className="h-4 w-4 text-green-500 mr-1" />;
      case 'admin':
        return <ShieldAlert className="h-4 w-4 text-purple-500 mr-1" />;
      default:
        return null;
    }
  };

  const handleDownload = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await downloadResource(resource);
  };

  // Function to format category display name
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return <ResourceTableSkeleton />;
  }

  return (
    <>
      {/*==================== Error States ====================*/}
      {isError && <NetworkError onRetry={onRefresh} />}

      {!isError && allResources.length === 0 && (
        <EmptyState
          uploadUrl={mode === 'recycleBin' ? '/admin/resources' : '/admin/resources/upload'}
          uploadButtonText={mode === 'recycleBin' ? 'Go Back to Resources' : undefined}
          uploadIcon={mode === 'recycleBin' ? ArrowLeft : undefined}
          description={
            mode === 'recycleBin'
              ? 'No resources in recycle bin. Deleted resources will appear here.'
              : userRole === 'admin'
                ? 'Get started by uploading your first educational resource to the library.'
                : 'No resources available at the moment. Check back later for new materials.'
          }
          showRefreshButton={mode !== 'recycleBin' && userRole === 'user'}
          onRefresh={mode !== 'recycleBin' && userRole === 'user' ? onRefresh : undefined}
          itemName="resource"
        />
      )}

      {!isError && resources.length === 0 && allResources.length > 0 && searchTerm && (
        <NoResults filterTerm={searchTerm} onClearFilters={onClearFilters} />
      )}
      {/*==================== End of Error States ====================*/}

      {/*==================== Results Table ====================*/}
      {!isError && resources.length > 0 && (
        <div className="rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'recycleBin' ? 'Deleted Resources' : 'Resources'}
            </h3>
            <div className="flex items-center mt-2 sm:mt-0">
              {selectedCount > 0 ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedCount} resource{selectedCount > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="inline-flex items-center rounded-lg bg-gray-100 text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-200"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={selectAll}
                    className="inline-flex items-center rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-sm font-medium hover:bg-blue-200"
                  >
                    {resources.every((item) => selectedResources[item.resourceId])
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                  {userRole === 'admin' && (
                    <>
                      {mode === 'recycleBin' ? (
                        <>
                          <button
                            onClick={handleRestoreSelected}
                            className="inline-flex items-center rounded-lg bg-green-100 text-green-700 px-3 py-1.5 text-sm font-medium hover:bg-green-200"
                          >
                            Restore Selected
                          </button>
                          <button
                            onClick={handleDeleteSelected}
                            className="inline-flex items-center rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-200"
                          >
                            Delete Permanently
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleDeleteSelected}
                          className="inline-flex items-center rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-200"
                        >
                          Delete Selected
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Showing {resources.length} of {total} resources
                </p>
              )}
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
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Description
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
                    Category
                  </th>
                  {userRole === 'admin' && mode === 'default' && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Usage
                    </th>
                  )}
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
              <tbody className="bg-white">
                {resources.map((resource, index) => (
                  <tr
                    key={resource.resourceId}
                    onClick={
                      userRole === 'user'
                        ? () => handleDoubleClick(resource)
                        : (e) => toggleSelection(resource, e)
                    }
                    onDoubleClick={
                      userRole === 'admin' ? () => handleDoubleClick(resource) : undefined
                    }
                    className={`${
                      userRole === 'admin' && selectedResources[resource.resourceId]
                        ? 'bg-amber-100'
                        : index % 2 === 1
                          ? 'bg-gray-100/80'
                          : ''
                    } hover:bg-gray-200/60 border-none transition-colors cursor-pointer`}
                  >
                    {/*==================== Title Column ====================*/}
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                          {getDepartmentIcon(resource.department)}
                        </div>
                        <div className="ml-2 max-w-xs">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600 mr-2 truncate">
                              {resource.title}
                            </span>
                            {getVisibilityIcon(resource.visibility)}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/*==================== End of Title Column ====================*/}

                    {/*==================== Description Column ====================*/}
                    <td className="px-5 py-4 text-sm font-medium text-gray-500 truncate">
                      {resource.description}
                    </td>
                    {/*==================== End of Description Column ====================*/}

                    {/*==================== Department Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-1.5 py-0.5 text-md font-medium text-gray-500">
                        {formatDepartment(resource.department)}
                      </span>
                    </td>
                    {/*==================== End of Department Column ====================*/}

                    {/*==================== Category Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      <span className="inline-flex items-center rounded-full px-1.5 gap-2 py-0.5 text-md font-medium text-slate-500">
                        {formatCategoryName(resource.category)}
                      </span>
                    </td>
                    {/*==================== End of Category Column ====================*/}

                    {/*==================== Usage Column (Admin Default Only) ====================*/}
                    {userRole === 'admin' && mode === 'default' && (
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-gray-400" />
                          <span>{resource.downloads}</span>
                          <span className="text-gray-300">|</span>
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span>{resource.viewCount}</span>
                        </div>
                      </td>
                    )}
                    {/*==================== End of Usage Column ====================*/}

                    {/*==================== Actions Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        {userRole === 'admin' ? (
                          <>
                            {mode === 'recycleBin' ? (
                              <>
                                {/*==================== Recycle Bin Actions ====================*/}
                                <button
                                  title="Restore Resource"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    handleRestoreResource(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>

                                <button
                                  title="Delete Permanently"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    handleDeleteClick(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {/*==================== End of Recycle Bin Actions ====================*/}
                              </>
                            ) : (
                              <>
                                {/*==================== Default Admin Actions ====================*/}
                                <button
                                  title="Edit Resource"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    handleEditResource(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>

                                <button
                                  title="Download Resource"
                                  onClick={(e) => handleDownload(resource, e)}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                >
                                  <Download className="h-4 w-4" />
                                </button>

                                <button
                                  title="View Analytics"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    handleViewAnalytics(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                >
                                  <BarChart2 className="h-4 w-4" />
                                </button>

                                {selectedResources[resource.resourceId] && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedResource(resource);
                                      handleDeleteClick(resource, e);
                                    }}
                                    className="rounded-full p-1.5 text-amber-500 hover:bg-amber-50"
                                    title="Delete Resource"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                )}
                                {/*==================== End of Default Admin Actions ====================*/}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {/*==================== Student Actions ====================*/}
                            <button
                              title={
                                bookmarks[resource.resourceId] ? 'Remove Bookmark' : 'Add Bookmark'
                              }
                              onClick={(e) => toggleBookmark(resource, e)}
                              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-amber-600"
                            >
                              {bookmarks[resource.resourceId] ? (
                                <BookmarkCheck className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              title="Download Resource"
                              onClick={(e) => handleDownload(resource, e)}
                              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {/*==================== End of Student Actions ====================*/}
                          </>
                        )}
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
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{page * limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min((page + 1) * limit, total)}</span> of{' '}
                  <span className="font-medium">{total}</span> results
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNumber;

                      if (totalPages <= 7) {
                        pageNumber = i;
                      } else if (page < 3) {
                        pageNumber = i < 5 ? i : totalPages - (7 - i);
                      } else if (page > totalPages - 4) {
                        pageNumber = totalPages - 7 + i;
                      } else {
                        pageNumber = page - 3 + i;
                      }

                      if (pageNumber >= 0 && pageNumber < totalPages) {
                        if (
                          (i === 5 && pageNumber < totalPages - 1) ||
                          (i === 1 && pageNumber > 1)
                        ) {
                          return (
                            <span key={`dots-${pageNumber}`} className="px-3 py-1 text-gray-700">
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md ${
                              page === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNumber + 1}
                          </button>
                        );
                      }

                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {/*==================== End of Pagination Controls ====================*/}
        </div>
      )}
      {/*==================== End of Results Table ====================*/}

      {/*==================== Admin-Only Modals ====================*/}
      {userRole === 'admin' && mode === 'default' && (
        <>
          {/*==================== Analytics Modal ====================*/}
          {showAnalytics && selectedResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <ResourceAnalytics
                token={token}
                resource={selectedResource}
                isOpen={showAnalytics}
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
              isLoading={isEditing}
            />
          )}
          {/*==================== End of Edit Modal ====================*/}
        </>
      )}

      {/*==================== Delete Modal ====================*/}
      {userRole === 'admin' && showDeleteModal && (
        <DeleteResourceModal
          resourceCount={hasMultipleSelected ? selectedCount : 1}
          isOpen={showDeleteModal}
          onConfirm={mode === 'recycleBin' ? confirmRestore : confirmDelete}
          onClose={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}
      {/*==================== End of Delete Modal ====================*/}
    </>
  );
};

export default ResourceTable;
