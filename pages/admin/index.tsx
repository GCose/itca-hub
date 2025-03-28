import { useState, useEffect } from "react";
import { Calendar, Users, FileText, PieChart } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import StatsCard from "@/components/dashboard/admin/stats-card";
import UserTable from "@/components/dashboard/admin/user-table";
import RecentActivity from "@/components/dashboard/admin/recent-activity";

// Types for dashboard data
interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalResources: number;
  activeUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalResources: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data from API
    // This would be replaced with actual API calls -Ebrima Mbye
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setStats({
          totalUsers: 256,
          totalEvents: 12,
          totalResources: 148,
          activeUsers: 124,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">Welcome to the ITCA Hub admin dashboard</p>
      </div>

      {/*==================== Stats Cards ====================*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          trend={"+5.2%"}
          title="Total Users"
          trendDirection="up"
          isLoading={isLoading}
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatsCard
          trend={"+2.4%"}
          trendDirection="up"
          title="Active Events"
          isLoading={isLoading}
          value={stats.totalEvents}
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
        />
        <StatsCard
          trend={"+8.1%"}
          title="Resources"
          trendDirection="up"
          isLoading={isLoading}
          value={stats.totalResources}
          icon={<FileText className="h-6 w-6 text-green-500" />}
        />
        <StatsCard
          trend={"-1.8%"}
          title="Active Users"
          trendDirection="down"
          isLoading={isLoading}
          value={stats.activeUsers}
          icon={<PieChart className="h-6 w-6 text-purple-500" />}
        />
      </div>
      {/*==================== End of Stats Cards ====================*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/*==================== Recent User Activity ====================*/}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <UserTable />
        </div>
        {/*==================== End of Recent User Activity ====================*/}

        {/*==================== Activity Feed ====================*/}
        <div>
          <h2 className="text-lg font-semibold mb-4">System Activity</h2>
          <RecentActivity />
        </div>
        {/*==================== End of Activity Feed ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
