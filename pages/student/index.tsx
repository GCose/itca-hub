import { useState, useEffect } from 'react';
import StatsCard from '@/components/dashboard/student/stats-card';
import { BookOpen, Calendar, FileText, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import UpcomingEvents from '@/components/dashboard/student/upcoming-events';
import ResourceList from '@/components/dashboard/student/resource/resource-list';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';

// Types for student dashboard data
interface StudentDashboardData {
  coursesEnrolled: number;
  eventsRegistered: number;
  resourcesAccessed: number;
  completionRate: number;
  upcomingEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
  }>;
  recentResources: Array<{
    id: number;
    title: string;
    type: string;
    date: string;
  }>;
  courses: Array<{
    id: number;
    title: string;
    instructor: string;
    progress: number;
    totalResources: number;
    totalStudents: number;
  }>;
}

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData>({
    coursesEnrolled: 0,
    eventsRegistered: 0,
    resourcesAccessed: 0,
    completionRate: 0,
    upcomingEvents: [],
    recentResources: [],
    courses: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch student dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setDashboardData({
          coursesEnrolled: 3,
          eventsRegistered: 2,
          resourcesAccessed: 15,
          completionRate: 68,
          upcomingEvents: [
            {
              id: 1,
              title: 'Web Development Workshop',
              date: 'Oct 25, 2023',
              time: '2:00 PM',
              location: 'Lab 302',
            },
            {
              id: 2,
              title: 'AI & Machine Learning Seminar',
              date: 'Nov 10, 2023',
              time: '3:00 PM',
              location: 'Virtual (Zoom)',
            },
          ],
          recentResources: [
            {
              id: 1,
              title: 'Introduction to Python Programming',
              type: 'PDF',
              date: 'Oct 15, 2023',
            },
            {
              id: 2,
              title: 'Database Design Principles',
              type: 'PPTX',
              date: 'Oct 12, 2023',
            },
            {
              id: 3,
              title: 'Web Security Best Practices',
              type: 'PDF',
              date: 'Oct 8, 2023',
            },
          ],
          courses: [
            {
              id: 1,
              title: 'Introduction to Web Development',
              instructor: 'Dr. Sarah Johnson',
              progress: 75,
              totalResources: 12,
              totalStudents: 45,
            },
            {
              id: 2,
              title: 'Data Structures and Algorithms',
              instructor: 'Prof. Michael Chen',
              progress: 60,
              totalResources: 18,
              totalStudents: 32,
            },
            {
              id: 3,
              title: 'Mobile App Development with React Native',
              instructor: 'Dr. David Wilson',
              progress: 40,
              totalResources: 15,
              totalStudents: 28,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Student Dashboard">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="text-blue-700 mr-2">Student</span>
          <span className="text-amber-500">Dashboard</span>
          <span className="ml-3 relative">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </span>
        </h1>
        <p className="text-gray-600">Welcome back, John Doe</p>
      </div>

      {/*==================== Stats Cards ====================*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 mb-15">
        <StatsCard
          title="Courses Enrolled"
          value={dashboardData.coursesEnrolled}
          icon={<BookOpen className="h-6 w-6 text-blue-600" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Upcoming Events"
          value={dashboardData.eventsRegistered}
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Resources Accessed"
          value={dashboardData.resourcesAccessed}
          icon={<FileText className="h-6 w-6 text-green-500" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Overall Progress"
          value={`${dashboardData.completionRate}%`}
          icon={<Award className="h-6 w-6 text-purple-500" />}
          isLoading={isLoading}
          valueClassName="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*==================== Upcoming Events ====================*/}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <UpcomingEvents events={dashboardData.upcomingEvents} isLoading={isLoading} />
        </div>

        {/*==================== Recent Resources ====================*/}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Resources</h2>
          <ResourceList isLoading={isLoading} resources={dashboardData.recentResources} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

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

  if (userAuth.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
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
