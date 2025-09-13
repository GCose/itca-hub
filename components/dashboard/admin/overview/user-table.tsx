import React, { useState, useEffect } from 'react';
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
  schoolEmail: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
  createdAt: string;
  firstName: string;
  lastName: string;
}

interface UserTableProps {
  users?: UserData[];
  isLoading?: boolean;
  total?: number;
  page: number;
  setPage: Function;
  limit: number;
  setLimit: Function;
  totalPages: number;
}

const UserTable = ({
  limit,
  users,
  isLoading = false,
  total = users?.length,
  page,
  setPage,
  totalPages,
}: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const currentUsers = users || [];

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total!);

  const toggleUserMenu = (userId: string) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedUser && !(event.target as HTMLElement).closest('.user-menu')) {
        setSelectedUser(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedUser]);

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
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="even:bg-gray-100/80 border-none">
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
  if (users?.length === 0) {
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
            {currentUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-200/60 even:bg-gray-100/80">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || user.firstName + ' ' + user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.schoolEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.role.toLowerCase() === 'user' ? 'Student' : 'Admin'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.joinedDate || user.createdAt).toLocaleDateString()}
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
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            {/*==================== Results Info ====================*/}
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </p>
            {/*==================== End of Results Info ====================*/}

            {/*==================== Pagination Controls ====================*/}
            <div className="flex items-center space-x-2">
              <button
                title="button"
                onClick={() => setPage((prev: number) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/*==================== Page Numbers ====================*/}
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === page;

                  // Show first page, last page, current page and neighbors
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <button
                        key={`page-${pageNumber}`}
                        onClick={() => setPage(pageNumber)}
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
                  if (pageNumber === page - 2 || pageNumber === page + 2) {
                    return (
                      <span key={`dots-${pageNumber}`} className="px-3 py-1 text-gray-700">
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
                onClick={() => setPage((prev: number) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
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
