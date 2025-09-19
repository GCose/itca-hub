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
  BookmarkCheck,
  Bookmark,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useResourceTable from '@/hooks/resources/use-resource-table';
import useDownload from '@/hooks/use-download';
import useResourceAnalytics from '@/hooks/resources/use-resource-analytics';
import ResourceTableSkeleton from '../skeletons/resource-table-skeleton';
import formatDepartment from '@/utils/format-department';
import { EmptyState, NetworkError, NoResults } from '@/components/dashboard/error-messages';
import { toast } from 'sonner';
import ResourceEditModal from '../modals/resources/edit-resource-modal';
import ResourceAnalytics from '../modals/resources/analytics-resource-modal';
import DeleteResourceModal from '../modals/resources/delete-resource-modal';
import { Resource } from '@/types/interfaces/resource';

interface ResourceTableProps {
  resources: Resource[];
  allResources: Resource[];
  isLoading: boolean;
  isError?: boolean;
  token: string;
  searchTerm: string;
  userRole: 'admin' | 'user';
  mode?: 'default' | 'recycleBin';
  onRefresh: () => void;
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onClearFilters: () => void;
}

const ResourceTable = ({
  resources,
  allResources,
  isLoading,
  isError,
  token,
  searchTerm,
  userRole,
  mode = 'default',
  onRefresh,
  onDeleteResource,
  onDeleteMultiple,
  onRestoreResource,
  onRestoreMultiple,
  onClearFilters,
}: ResourceTableProps) => {
  const {
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
    handleViewAnalytics,
    handleEditResource,
    handleDeleteResource,
    handleDeleteSelected,
    confirmDelete,
    confirmRestore,
    handleSaveResource,
    selectedResources,
    selectedCount,
    hasMultipleSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    handleDoubleClick,
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

  const { downloadResource, isDownloading } = useDownload();
  const { trackResourceDownload } = useResourceAnalytics({ token });
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userRole === 'user') {
      try {
        const savedBookmarks = localStorage.getItem('studentBookmarks');
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, [userRole]);

  const handleBookmark = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const newBookmarks = { ...bookmarks };
    const isBookmarked = bookmarks[resource.resourceId];

    if (isBookmarked) {
      delete newBookmarks[resource.resourceId];
    } else {
      newBookmarks[resource.resourceId] = true;
    }

    setBookmarks(newBookmarks);
    localStorage.setItem('studentBookmarks', JSON.stringify(newBookmarks));

    toast.success(isBookmarked ? 'Bookmark removed' : 'Bookmark added', {
      description: isBookmarked
        ? `${resource.title} has been removed from bookmarks`
        : `${resource.title} has been added to bookmarks`,
    });
  };

  const handleDownload = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    try {
      await trackResourceDownload(resource.resourceId);

      if (resource.fileUrls && resource.fileUrls.length > 0) {
        const fileUrl = resource.fileUrls[0];
        await downloadResource(fileUrl, resource.title);
      } else {
        toast.error('No file available for download');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return <ResourceTableSkeleton />;
  }

  if (isError) {
    return <NetworkError onRetry={onRefresh} />;
  }

  if (allResources.length === 0) {
    return (
      <EmptyState
        title="No resources found"
        description="There are no resources available at the moment."
      />
    );
  }

  if (resources.length === 0 && searchTerm) {
    return (
      <NoResults
        searchTerm={searchTerm}
        onClearSearch={onClearFilters}
        onRefresh={onRefresh}
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-white">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'recycleBin' ? 'Deleted Resources' : 'Resources'}
              </h2>
              {selectedCount > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedCount} selected</span>
                  {userRole === 'admin' && (
                    <button
                      onClick={handleDeleteSelected}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {mode === 'recycleBin' ? (
                        <>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete Permanently
                        </>
                      ) : (
                        <>
                          <Trash className="h-3 w-3 mr-1" />
                          Move to Recycle Bin
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {userRole === 'admin' && selectedCount > 0 && mode === 'recycleBin' && (
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restore Selected
                </button>
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
              <thead className="bg-gray-50">
                <tr>
                  {userRole === 'admin' && (
                    <th scope="col" className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={
                          resources.length > 0 &&
                          resources.every((item) => selectedResources[item.resourceId])
                        }
                        onChange={selectAll}
                      />
                    </th>
                  )}
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

              <tbody className="bg-white">
                {allResources.map((resource) => (
                  <tr
                    key={resource.resourceId}
                    onClick={userRole === 'user' ? () => handleDoubleClick(resource) : undefined}
                    className={`
                      ${userRole === 'user' ? 'cursor-pointer hover:bg-gray-50' : ''}
                      ${resource.isDeleted ? 'opacity-60' : ''}
                      ${selectedResources[resource.resourceId] ? 'bg-blue-50' : ''}
                    `}
                  >
                    {userRole === 'admin' && (
                      <td className="whitespace-nowrap px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedResources[resource.resourceId] || false}
                          onChange={(e) => toggleSelection(resource, e)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {resource.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatDepartment(resource.department)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {formatCategoryName(resource.category)}
                      </span>
                    </td>

                    {userRole === 'admin' && mode === 'default' && (
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{resource.viewCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            <span>{resource.downloads}</span>
                          </div>
                          {resource.visibility === 'admin' && (
                            <div className="flex items-center">
                              <ShieldAlert className="h-4 w-4 text-orange-500" />
                            </div>
                          )}
                        </div>
                      </td>
                    )}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleDownload(resource, e)}
                          disabled={isDownloading}
                          className="p-1 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          title="Download resource"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        {userRole === 'user' && (
                          <button
                            onClick={(e) => handleBookmark(resource, e)}
                            className={`p-1 rounded-md ${
                              bookmarks[resource.resourceId]
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-yellow-600'
                            }`}
                            title={
                              bookmarks[resource.resourceId] ? 'Remove bookmark' : 'Add bookmark'
                            }
                          >
                            {bookmarks[resource.resourceId] ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {userRole === 'admin' && mode === 'default' && (
                          <>
                            <button
                              onClick={(e) => handleViewAnalytics(resource, e)}
                              className="p-1 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700"
                              title="View analytics"
                            >
                              <BarChart2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={(e) => handleEditResource(resource, e)}
                              className="p-1 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                              title="Edit resource"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteResource(resource, e)}
                              className="p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Move to recycle bin"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {userRole === 'admin' && mode === 'recycleBin' && (
                          <>
                            <button
                              onClick={(e) => {
                                if (e) e.stopPropagation();
                                setSelectedResource(resource);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700"
                              title="Restore resource"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteResource(resource, e)}
                              className="p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Delete permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {userRole === 'admin' && mode === 'default' && (
        <>
          {showAnalytics && selectedResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <ResourceAnalytics
                token={token}
                resource={selectedResource}
                onClose={() => setShowAnalytics(false)}
              />
            </div>
          )}

          {showEditModal && selectedResource && (
            <ResourceEditModal
              isOpen={showEditModal}
              resource={selectedResource}
              onSave={handleSaveResource}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </>
      )}

      {userRole === 'admin' && showDeleteModal && (
        <DeleteResourceModal
          isDeleting={isDeleting}
          isOpen={showDeleteModal}
          onConfirm={mode === 'recycleBin' ? confirmRestore : confirmDelete}
          onClose={() => setShowDeleteModal(false)}
          resourceCount={hasMultipleSelected ? selectedCount : 1}
          mode={mode}
        />
      )}
    </>
  );
};

export default ResourceTable;
