import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import UserTable from '@/components/dashboard/table/user-table';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';
import axios from 'axios';
import { BASE_URL } from '@/utils/url';
import useDebounce from '@/utils/debounce';

interface IAdminUsersPage {
  userData: UserAuth;
}

const AdminUsersPage = ({ userData }: IAdminUsersPage) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(
    async (page: number, limit: number) => {
      setIsLoading(true);

      try {
        const { data } = await axios.get(`${BASE_URL}/users`, {
          params: {
            page: Number(page),
            limit: Number(limit),
            ...(debouncedSearchQuery.trim() && { search: debouncedSearchQuery.trim() }),
          },
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        setUsers(data.data);
        setTotalUsers(data.total);
        setTotalPages(data.pagination.totalPages);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [userData.token, debouncedSearchQuery]
  );

  useEffect(() => {
    fetchUsers(page, limit);
  }, [fetchUsers, page, limit]);

  // Reset to page 1 ONLY when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  return (
    <DashboardLayout title="User Management" token={userData.token}>
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
              value={searchTerm}
              placeholder="Search users by name or email..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border-none bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <select
              value={role}
              title="select"
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
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
          <UserTable
            page={page}
            limit={limit}
            users={users}
            setPage={setPage}
            total={totalUsers}
            setLimit={setLimit}
            isLoading={isLoading}
            token={userData.token}
            totalPages={totalPages}
            onUserUpdated={() => fetchUsers(page, limit)}
          />
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
