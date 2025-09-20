import React from 'react';

const UserTableSkeleton = () => {
  return (
    <div className="rounded-2xl bg-white">
      <div className="overflow-x-auto hide-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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

          <tbody className="divide-y divide-gray-200 bg-white">
            {[...Array(10)].map((_, index) => (
              <tr key={index} className="even:bg-gray-100/80 border-none">
                <td className="whitespace-nowrap px-8 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="ml-4">
                      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                      <div className="mt-1 h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-8 py-4">
                  <div className="h-4 w-16 rounded bg-gray-200 animate-pulse"></div>
                </td>

                <td className="whitespace-nowrap px-8 py-4">
                  <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse"></div>
                </td>

                <td className="whitespace-nowrap px-8 py-4">
                  <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                </td>

                <td className="whitespace-nowrap px-8 py-4 text-right">
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
};

export default UserTableSkeleton;
