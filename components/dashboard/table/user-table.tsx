import React from 'react';
import {
  Trash,
  User,
  ChevronLeft,
  ChevronRight,
  UserX,
  UserCheck,
  Crown,
  GraduationCap,
  Users,
} from 'lucide-react';
import useUserActions from '@/hooks/admin/users/use-user-actions';
import UserActionsModal from '../modals/user/user-actions-modal';
import { NetworkError, EmptyState } from '@/components/dashboard/error-message';

interface UserData {
  _id?: string;
  name: string;
  schoolEmail: string;
  role: string;
  isActive?: boolean;
  joinedDate: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  isEmailVerified?: boolean;
}

interface UserTableProps {
  users?: UserData[];
  isLoading?: boolean;
  isError?: boolean;
  total?: number;
  page: number;
  setPage: Function;
  limit: number;
  setLimit: Function;
  totalPages: number;
  token: string;
  onUserUpdated: () => void;
}

const UserTable = ({
  limit,
  users,
  isLoading = false,
  isError = false,
  total = users?.length,
  page,
  setPage,
  totalPages,
  token,
  onUserUpdated,
}: UserTableProps) => {
  const {
    deleteUser,
    toggleUserActivation,
    updateUserRole,
    modalState,
    closeModal,
    executeAction,
  } = useUserActions({ token, onUserUpdated });

  const currentUsers = users || [];
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total!);

  if (isError) {
    return <NetworkError title="Unable To Fetch Users" onRetry={onUserUpdated} />;
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
                    <div className="flex space-x-1 justify-end">
                      <div className="h-8 w-8 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-8 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-8 w-8 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (users?.length === 0) {
    return (
      <EmptyState
        itemName="user"
        uploadUrl="/admin"
        uploadIcon={Users}
        title="No users found"
        showRefreshButton={true}
        onRefresh={onUserUpdated}
        uploadButtonText="Back to Dashboard"
        description="No registered users match your current search criteria. Try adjusting your filters or refresh the page."
      />
    );
  }

  return (
    <>
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
              {currentUsers?.map((user) => {
                const userName = user.name || `${user.firstName} ${user.lastName}`;

                return (
                  <tr key={user._id} className="hover:bg-gray-200/60 even:bg-gray-100/80">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userName}</div>
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
                      <div className="flex items-center space-x-1 justify-end">
                        {/*==================== Toggle User Role ====================*/}
                        <button
                          onClick={() => updateUserRole(user._id!, userName, user.role)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title={
                            user.role.toLowerCase() === 'admin' ? 'Make Student' : 'Make Admin'
                          }
                        >
                          {user.role.toLowerCase() === 'admin' ? (
                            <GraduationCap className="h-5 w-5" />
                          ) : (
                            <Crown className="h-5 w-5" />
                          )}
                        </button>
                        {/*==================== End of Toggle User Role ====================*/}

                        {/*==================== Toggle User Activation ====================*/}
                        <button
                          onClick={() => toggleUserActivation(user._id!, userName)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? (
                            <UserX className="h-5 w-5" />
                          ) : (
                            <UserCheck className="h-5 w-5" />
                          )}
                        </button>
                        {/*==================== End of Toggle User Activation ====================*/}

                        {/*==================== Delete User ====================*/}
                        <button
                          onClick={() => deleteUser(user._id!, userName)}
                          className="rounded-full p-1 text-red-400 hover:bg-gray-100 hover:text-red-500"
                          title="Delete User"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                        {/*==================== End of Delete User ====================*/}
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/*==================== User Actions Modal ====================*/}
      <UserActionsModal
        onClose={closeModal}
        onConfirm={executeAction}
        isOpen={modalState.isOpen}
        userName={modalState.userName}
        userRole={modalState.userRole}
        isLoading={modalState.isLoading}
        actionType={modalState.actionType}
      />
      {/*==================== End of User Actions Modal ====================*/}
    </>
  );
};

export default UserTable;
