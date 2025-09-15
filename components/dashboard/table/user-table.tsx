import React from 'react';
import {
  Trash,
  User,
  UserX,
  Crown,
  Users,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { UserTableProps } from '@/types/interfaces/table';
import UserTableSkeleton from '../skeletons/user-table-skeleton';
import UserActionsModal from '../modals/user/user-actions-modal';
import useUserActions from '@/hooks/admin/users/use-user-actions';
import { NetworkError, EmptyState } from '@/components/dashboard/error-messages';

const UserTable = ({
  page,
  limit,
  users,
  token,
  setPage,
  totalPages,
  isError = false,
  isLoading = false,
  total = users?.length,
  onUserUpdated,
}: UserTableProps) => {
  const {
    deleteUser,
    modalState,
    closeModal,
    executeAction,
    updateUserRole,
    toggleUserActivation,
  } = useUserActions({ token, onUserUpdated });

  const currentUsers = users || [];
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total!);

  if (isError) {
    return <NetworkError title="Unable To Fetch Users" onRetry={onUserUpdated} />;
  }

  if (isLoading) {
    return <UserTableSkeleton />;
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
        description="No users found. Might be due to wrong filtering or no users exist at all."
      />
    );
  }

  return (
    <>
      {/*==================== User Table ====================*/}
      <div className="rounded-2xl bg-white">
        {/*==================== Table ====================*/}
        <div className="overflow-x-auto hide-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white rounded-2xl">
              <tr>
                <th className="px-8 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email Status
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-8 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {currentUsers?.map((user) => {
                const userName = user.name || `${user.firstName} ${user.lastName}`;

                return (
                  <tr key={user._id} className="hover:bg-amber-100/70 even:bg-gray-100/80">
                    <td className="whitespace-nowrap px-8 py-4">
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

                    <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
                      {user.role.toLowerCase() === 'user' ? 'Student' : 'Admin'}
                    </td>

                    <td className="whitespace-nowrap px-8 py-4">
                      {user.isEmailVerified ? (
                        <span className="inline-flex px-2 py-2 text-sm font-medium rounded-md bg-green-100 text-green-600">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-2 text-sm font-medium rounded-md bg-red-100/70 text-red-600">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
                      {new Date(user.joinedDate || user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="whitespace-nowrap px-8 py-4 text-right text-sm font-medium">
                      <div className="flex items-center space-x-1 justify-end">
                        {/*==================== Toggle User Role ====================*/}
                        <button
                          onClick={() => updateUserRole(user._id!, userName, user.role)}
                          className="rounded-full p-2 text-gray-400 hover:bg-white"
                          title={
                            user.role.toLowerCase() === 'admin' ? 'Make Student' : 'Make Admin'
                          }
                        >
                          {user.role.toLowerCase() === 'admin' ? (
                            <GraduationCap className="h-5 w-5 text-blue-600 rounded-full" />
                          ) : (
                            <Crown className="h-5 w-5 text-purple-600 rounded-full" />
                          )}
                        </button>
                        {/*==================== End of Toggle User Role ====================*/}

                        {/*==================== Toggle User Activation ====================*/}
                        <button
                          onClick={() => toggleUserActivation(user._id!, userName)}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          className="rounded-full p-2 text-gray-400 hover:bg-white"
                        >
                          {user.isActive ? (
                            <UserX className="h-5 w-5 text-amber-400 rounded-full" />
                          ) : (
                            <UserCheck className="h-5 w-5 text-green-300 rounded-full" />
                          )}
                        </button>
                        {/*==================== End of Toggle User Activation ====================*/}

                        {/*==================== Delete User ====================*/}
                        <button
                          title="Delete User"
                          onClick={() => deleteUser(user._id!, userName)}
                          className="rounded-full p-2 text-red-400 hover:bg-white hover:text-red-500"
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
        {/*==================== End of Table ====================*/}

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
      {/*==================== End of User Table ====================*/}

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
