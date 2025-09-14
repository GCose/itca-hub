import axios from 'axios';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { NextApiRequest } from 'next';
import { BASE_URL } from '@/utils/url';
import { isLoggedIn } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { AdminUsersPageProps, UserAuth } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import UserTable from '@/components/dashboard/table/user-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const AdminUsersPage = ({ userData }: AdminUsersPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(
    async (page: number, limit: number) => {
      setIsLoading(true);
      setIsError(false);

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
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'An error occurred';

        toast.error('Failed to load data', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [userData.token, debouncedSearchQuery]
  );

  useEffect(() => {
    fetchUsers(page, limit);
  }, [fetchUsers, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  return (
    <DashboardLayout title="User Management" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="User"
          subtitle="Management"
          description="Manage user accounts, roles, and permissions"
        />
      </div>
      {/*==================== End of Page Header ====================*/}

      {/*==================== Filters ====================*/}
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
      {/*==================== End of Filters ====================*/}

      {/*==================== Users Table ====================*/}
      <div className="grid grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-lg bg-white">
          <UserTable
            page={page}
            limit={limit}
            users={users}
            setPage={setPage}
            isError={isError}
            total={totalUsers}
            setLimit={setLimit}
            isLoading={isLoading}
            token={userData.token}
            totalPages={totalPages}
            onUserUpdated={() => fetchUsers(page, limit)}
          />
        </div>
      </div>
      {/*==================== End of Users Table ====================*/}
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
