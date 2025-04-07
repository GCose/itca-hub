import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import UserTable from '@/components/dashboard/admin/overview/user-table';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');

  return (
    <DashboardLayout title="User Management">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-700 mr-2">User</span>
              <span className="text-amber-500">Management</span>
              <span className="ml-3 relative">
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </span>
            </h1>
            <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
          </div>

          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/users/new"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none  focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="w-full rounded-lg border bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <select
              title="select"
              className="w-full rounded-lg border bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div>
            <select
              title="select"
              className="w-full rounded-lg border bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-lg bg-white">
          <UserTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData === false) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const userAuth = userData as UserAuth;

  if (userAuth.role === 'user') {
    return {
      redirect: {
        destination: '/student',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};
