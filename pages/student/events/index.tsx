import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { Calendar, Search, ListFilter, RefreshCw } from 'lucide-react';
import EventsLoadingSkeleton from '@/components/dashboard/admin/events/events-loading-skeleton';
import StudentEventCard from '@/components/dashboard/student/events/event-card';
import { NetworkError } from '@/components/dashboard/error-message';
import { useStudentEvents } from '@/hooks/student/events/use-student-events';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';

interface StudentEventsPageProps {
  userData: UserAuth;
}

const StudentEventsPage = ({ userData }: StudentEventsPageProps) => {
  const {
    events,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    isLoading,
    error,
    initialLoading,
    handleRefresh,
    handleRegister,
    handleUnregister,
  } = useStudentEvents(userData.token);

  return (
    <DashboardLayout title="Events" token={userData.token}>
      {/*==================== Main Content ====================*/}
      <div className="relative z-10">
        {/*==================== Header Content ====================*/}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-blue-700 mr-2">ITCA</span>
                <span className="text-amber-500">Events</span>
                <span className="ml-3 relative">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                </span>
              </h1>
              <p className="text-gray-600">
                Discover and register for ITCA events, workshops, and seminars
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/*==================== Search and Filters ====================*/}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-6">
            <div className="md:col-span-8">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events by title, description, or location..."
                  className="w-full rounded-lg bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <ListFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  title="select"
                  className="w-full rounded-lg bg-white py-2.5 pl-10 pr-8 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-blue-600 appearance-none cursor-pointer transition-colors"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="all">All Events</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*==================== End of Header Content ====================*/}

        {/*==================== Events Content ====================*/}
        {isLoading ? (
          <EventsLoadingSkeleton />
        ) : error ? (
          <NetworkError
            onRetry={handleRefresh}
            title="Unable to fetch events"
            description="Please check your internet connection and try again."
          />
        ) : events.length === 0 ? (
          // Show empty state only if NOT initially loading
          !initialLoading ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">
                {status === 'upcoming'
                  ? 'There are no upcoming events at the moment. Check back later!'
                  : 'No events match your current filters. Try adjusting your search.'}
              </p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Events
              </button>
            </div>
          ) : (
            <EventsLoadingSkeleton />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <StudentEventCard
                event={event}
                key={event.id}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
              />
            ))}
          </div>
        )}
        {/*==================== End of Events Content ====================*/}
      </div>
      {/*==================== End of Main Content ====================*/}
    </DashboardLayout>
  );
};

export default StudentEventsPage;

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
