import { useState, useEffect, useCallback, FC } from 'react';
import { Calendar, Users, FileText, PieChart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import StatsCard from '@/components/dashboard/admin/overview/stats-card';
import UserTable from '@/components/dashboard/table/user-table';
import { isLoggedIn } from '@/utils/auth';
import { NextApiRequest } from 'next';
import { UserAuth } from '@/types';
import axios from 'axios';
import { BASE_URL } from '@/utils/url';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalResources: number;
  activeUsers: number;
}

type UserProps = {
  userData: UserAuth;
};

const AdminDashboard: FC<UserProps> = ({ userData }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalResources: 0,
    activeUsers: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchDashboardData = useCallback(
    async (page: number, limit: number) => {
      setIsLoading(true);
      try {
        const headers = {
          Authorization: `Bearer ${userData.token}`,
        };

        const [stats, recentRegistrations] = await Promise.all([
          axios.get(`${BASE_URL}/admin/stats`, {
            headers,
          }),
          axios.get(`${BASE_URL}/users/recent`, {
            params: { page, limit },
            headers,
          }),
        ]);

        setStats({
          totalUsers: stats.data.data.totalUsers,
          totalEvents: stats.data.data.activeEvents,
          totalResources: stats.data.data.resources,
          activeUsers: stats.data.data.activeUsers,
        });
        setRecentRegistrations(recentRegistrations.data.data);
        setTotal(recentRegistrations.data.total);
        setTotalPages(recentRegistrations.data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData.token]
  );

  useEffect(() => {
    fetchDashboardData(page, limit);
  }, [fetchDashboardData, page, limit]);

  return (
    <DashboardLayout title="Admin Dashboard" token={userData.token}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="text-blue-700 mr-2">Dashboard</span>
          <span className="text-amber-500">Overview</span>
          <span className="ml-3 relative">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </span>
        </h1>
        <p className="text-gray-600">Welcome to the ITCA Hub admin dashboard</p>
      </div>

      {/*==================== Stats Cards ====================*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          trendDirection="up"
          isLoading={isLoading}
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatsCard
          trendDirection="up"
          title="Active Events"
          isLoading={isLoading}
          value={stats.totalEvents}
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
        />
        <StatsCard
          title="Resources"
          trendDirection="up"
          isLoading={isLoading}
          value={stats.totalResources}
          icon={<FileText className="h-6 w-6 text-green-500" />}
        />
        <StatsCard
          title="Active Users"
          trendDirection="down"
          isLoading={isLoading}
          value={stats.activeUsers}
          icon={<PieChart className="h-6 w-6 text-purple-500" />}
        />
      </div>
      {/*==================== End of Stats Cards ====================*/}

      <div className="grid grid-cols-1 gap-6 pt-4">
        {/*==================== Recent User Activity ====================*/}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <UserTable
            page={page}
            limit={limit}
            total={total}
            setPage={setPage}
            setLimit={setLimit}
            isLoading={isLoading}
            totalPages={totalPages}
            users={recentRegistrations}
          />
        </div>
        {/*==================== End of Recent User Activity ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

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
