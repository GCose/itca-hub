import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  Edit,
  Trash,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

interface UserTableProps {
  limit?: number;
  users?: UserData[];
  isLoading?: boolean;
}

const UserTable = ({ limit, users = [], isLoading = false }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 15;

  {
    /*==================== Calculate Pagination ====================*/
  }
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentUsers = users.slice(startIndex, endIndex);
  {
    /*==================== End of Calculate Pagination ====================*/
  }

  const toggleUserMenu = (userId: string) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };

  {
    /*==================== Handle Outside Click ====================*/
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedUser && !(event.target as HTMLElement).closest('.user-menu')) {
        setSelectedUser(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedUser]);
  {
    /*==================== End of Handle Outside Click ====================*/
  }

  {
    /*==================== Loading State ====================*/
  }
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[...Array(15)].map((_, index) => (
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
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                  </td>
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
  {
    /*==================== End of Loading State ====================*/
  }

  {
    /*==================== Empty State ====================*/
  }
  if (users.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">No users found</p>
      </div>
    );
  }
  {
    /*==================== End of Empty State ====================*/
  }

  return (
    <div className="rounded-2xl bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white rounded-2xl">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-200/60 even:bg-gray-100/80">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.role}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.joinedDate).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="relative inline-block text-left user-menu">
                    <button
                      title="More options"
                      onClick={() => toggleUserMenu(user.id)}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {selectedUser === user.id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <ExternalLink className="mr-3 h-4 w-4 text-gray-500" />
                            View Details
                          </Link>
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="mr-3 h-4 w-4 text-gray-500" />
                            Edit
                          </Link>
                          <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                            <Trash className="mr-3 h-4 w-4 text-red-500" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*==================== Pagination ====================*/}
      {!limit && totalPages > 1 && (
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

export default UserTable;
