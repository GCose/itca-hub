import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { Calendar, Search, ListFilter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DeleteEventModal from '@/components/dashboard/modals/events/delete-event-modal';
import EventsEmptyState from '@/components/dashboard/admin/events/events-empty-state';
import EventsLoadingSkeleton from '@/components/dashboard/admin/events/events-loading-skeleton';
import EventCard from '@/components/dashboard/admin/events/event-card';
import CreateEventModal from '@/components/dashboard/modals/events/create-event-modal';
import EditEventModal from '@/components/dashboard/modals/events/edit-event-modal';
import { NetworkError } from '@/components/dashboard/error-message';
import { useEvents } from '@/hooks/admin/events/use-events';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';

interface ApiEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationRequired: boolean;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
  capacity: number;
  image?: string;
}

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationRequired: boolean;
  imageUrl?: string;
}

interface EditEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationRequired: boolean;
  imageUrl?: string;
}

// Props interface
interface AdminEventsPageProps {
  userData: UserAuth;
}

// Convert API event to frontend event format
const convertApiEvent = (apiEvent: ApiEvent): Event => {
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return timeString;
    }
  };

  return {
    id: apiEvent._id,
    title: apiEvent.title,
    description: apiEvent.description,
    date: apiEvent.date,
    time: formatTime(apiEvent.time),
    location: apiEvent.location,
    status: apiEvent.status,
    registrations: apiEvent.attendees.length,
    capacity: apiEvent.capacity,
    image: apiEvent.imageUrl,
  };
};

// Update component to receive userData prop
const AdminEventsPage = ({ userData }: AdminEventsPageProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  // Pass token to useEvents hook
  const { isLoading, error, getAllEvents, createEvent, updateEvent, deleteEvent, refreshEvents } =
    useEvents(userData.token);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getAllEvents({
        page: 1,
        limit: 50,
        status: status === 'all' ? undefined : status,
        search: searchTerm || undefined,
      });

      // Convert API events to frontend format
      const convertedEvents = response.map(convertApiEvent);
      setEvents(convertedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [status, searchTerm, getAllEvents]);

  // Fetch events on component mount and when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRefresh = () => {
    refreshEvents();
    fetchEvents();
  };

  // Filter events (additional client-side filtering)
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleEditClick = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEventToEdit(event);
      setShowEditModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete);
        // Remove from local state
        setEvents(events.filter((event) => event.id !== eventToDelete));
        setShowDeleteModal(false);
        setEventToDelete(null);
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event. Please try again.');
      }
    }
  };

  const handleCreateEvent = async (newEventData: CreateEventData) => {
    try {
      // Convert frontend data to API format
      const apiEventData = {
        title: newEventData.title,
        description: newEventData.description,
        date: newEventData.date,
        time: newEventData.time,
        location: newEventData.location,
        capacity: newEventData.capacity,
        registrationRequired: newEventData.registrationRequired || false,
        imageUrl: newEventData.imageUrl,
      };

      const newEvent = await createEvent(apiEventData);

      // Add to local state
      const convertedEvent = convertApiEvent(newEvent);
      setEvents([convertedEvent, ...events]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const handleEditEvent = async (eventId: string, eventData: EditEventData) => {
    try {
      const updatedEvent = await updateEvent(eventId, eventData);

      // Update local state
      const convertedEvent = convertApiEvent(updatedEvent);
      setEvents(events.map((event) => (event.id === eventId ? convertedEvent : event)));
    } catch (error) {
      console.error('Error updating event:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  return (
    <DashboardLayout title="Event Management" token={userData.token}>
      {/*==================== Page content ====================*/}
      <div className="relative z-10">
        {/*==================== Header Content ====================*/}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-blue-700 mr-2">Event</span>
                <span className="text-amber-500">Management</span>
                <span className="ml-3 relative">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                </span>
              </h1>
              <p className="text-gray-600">
                Create and manage ITCA events, workshops, and seminars with ease
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="mr-2 text-lg font-bold transition-transform duration-300 group-hover:rotate-90">
                  +
                </span>
                Create Event
              </button>
            </div>
          </div>

          {/*==================== Search and Filters ====================*/}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-6">
            <div className="md:col-span-7">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events by title, description, or location..."
                  className="w-full rounded-lg  bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <ListFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  title="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg  bg-white py-2.5 pl-10 pr-8 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-blue-600 appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
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
                      clipRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-center h-full rounded-lg  bg-white overflow-hidden">
                <button
                  className={`flex-1 h-full flex items-center justify-center px-3 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  <ListFilter className="h-4 w-4" />
                  <span className="ml-1.5 text-sm font-medium">List</span>
                </button>
                <div className="h-full w-px bg-gray-200"></div>
                <button
                  className={`flex-1 h-full flex items-center justify-center px-3 transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  onClick={() => setViewMode('calendar')}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="ml-1.5 text-sm font-medium">Calendar</span>
                </button>
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
            title="Unable to fetch events"
            description="Please check your internet connection and try again."
            onRetry={handleRefresh}
          />
        ) : events.length === 0 ? (
          <EventsEmptyState onCreateEvent={() => setShowCreateModal(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                event={event}
                key={event.id}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
        {/*==================== End of Events Content ====================*/}
      </div>
      {/*==================== End of Page content ====================*/}

      {/*==================== Modals ====================*/}
      {showDeleteModal && (
        <DeleteEventModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />
      )}

      {showEditModal && (
        <EditEventModal
          isOpen={showEditModal}
          event={eventToEdit}
          onClose={() => {
            setShowEditModal(false);
            setEventToEdit(null);
          }}
          onSave={handleEditEvent}
        />
      )}
      {/*==================== End of Modals ====================*/}
    </DashboardLayout>
  );
};

export default AdminEventsPage;

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
