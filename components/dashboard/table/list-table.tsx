import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, File, Image as ImageIcon, Video } from 'lucide-react';
import { Resource } from '@/types';
import formatDepartment from '@/utils/format-department';

interface ListTableAction {
  label: string;
  icon: React.ReactNode;
  onClick: (item: Resource) => void;
  className?: string;
}

interface ListTableProps {
  resources: Resource[];
  isLoading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  actions?: ListTableAction[];
  showDepartment?: boolean;
  showFileType?: boolean;
  showCategory?: boolean;
}

const ListTable = ({
  resources,
  isLoading = false,
  emptyIcon = <FileText className="mx-auto h-12 w-12 text-gray-400" />,
  emptyMessage = 'No resources found',
  actions = [],
  showDepartment = true,
  showFileType = true,
  showCategory = true,
}: ListTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /**==================== Calculate Pagination ====================*/
  const totalItems = resources.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentResources = resources.slice(startIndex, endIndex);
  /**==================== End of Calculate Pagination ====================*/

  /**==================== Get File Icon ====================*/
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
  /**==================== End of Get File Icon ====================*/

  /**==================== Format Category Name ====================*/
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };
  /**==================== End of Format Category Name ====================*/

  /**==================== Loading State ====================*/
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Resource
                </th>
                {showDepartment && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Department
                  </th>
                )}
                {showFileType && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                )}
                {showCategory && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                        <div className="mt-1 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  {showDepartment && (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                    </td>
                  )}
                  {showFileType && (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-12 rounded bg-gray-200 animate-pulse"></div>
                    </td>
                  )}
                  {showCategory && (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="h-8 w-8 rounded bg-gray-200 animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  /**==================== End of Loading State ====================*/

  /**==================== Empty State ====================*/
  if (resources.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        {emptyIcon}
        <p className="mt-2 text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  /**==================== End of Empty State ====================*/

  return (
    <div className="rounded-2xl bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white rounded-2xl">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Resource
              </th>
              {showDepartment && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Department
                </th>
              )}
              {showFileType && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
              )}
              {showCategory && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-32">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {currentResources.map((resource) => (
              <tr key={resource.resourceId} className="hover:bg-gray-200/60 even:bg-gray-100/80">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      {getFileIcon(resource.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-[200px] truncate">
                        {resource.description}
                      </div>
                    </div>
                  </div>
                </td>

                {showDepartment && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDepartment(resource.department)}
                  </td>
                )}

                {showFileType && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span className="uppercase">{resource.type}</span>
                  </td>
                )}

                {showCategory && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatCategoryName(resource.category)}
                  </td>
                )}

                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        title={action.label}
                        onClick={() => action.onClick(resource)}
                        className={`rounded-full p-1.5 text-gray-500 hover:bg-white hover:text-gray-700 ${
                          action.className || ''
                        }`}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*==================== Pagination ====================*/}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            {/*==================== Results Info ====================*/}
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
            {/*==================== End of Results Info ====================*/}

            {/*==================== Pagination Controls ====================*/}
            <div className="flex items-center space-x-2">
              <button
                title="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/*==================== Page Numbers ====================*/}
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  // Show first page, last page, current page and neighbors
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          isCurrentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }

                  // Show dots
                  if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return (
                      <span key={pageNumber} className="px-3 py-1 text-gray-700">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}
              </div>
              {/*==================== End of Page Numbers ====================*/}

              <button
                title="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            {/*==================== End of Pagination Controls ====================*/}
          </div>
        </div>
      )}
      {/*==================== End of Pagination ====================*/}
    </div>
  );
};

export default ListTable;
