import EventCard from './event-card';
import { CreateEventData } from '@/types';
import useEvents from '@/hooks/events/use-events';
import { useState, useEffect, useCallback } from 'react';
import { NetworkError } from '@/components/dashboard/error-message';
import { EventProps, EventsComponentProps } from '@/types/interfaces/event';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import EditEventModal from '@/components/dashboard/modals/events/edit-event-modal';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import CreateEventModal from '@/components/dashboard/modals/events/create-event-modal';
import DeleteEventModal from '@/components/dashboard/modals/events/delete-event-modal';
import { Calendar, Search, RefreshCw, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import EventsLoadingSkeleton from '@/components/dashboard/admin/events/events-loading-skeleton';

const EventsComponent = ({ role, userData }: EventsComponentProps) => {
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<EventProps | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 9;

  const {
    isError,
    isLoading,
    searchTerm,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    setSearchTerm,
    registerForEvent,
    unregisterFromEvent,
  } = useEvents({ token: userData.token });

  /**===================
   * Load events data
   ===================*/
  const loadEvents = useCallback(async () => {
    const response = await getAllEvents({
      page,
      limit,
      status: status !== 'all' ? status : undefined,
    });

    setEvents(response.events);
    setTotalEvents(response.total);
    setTotalPages(response.pagination.totalPages || Math.ceil(response.total / limit));
  }, [page, limit, status, getAllEvents]);

  /**===============================
   * Event handlers for admin
   ===============================*/
  const handleCreateEvent = async (eventData: CreateEventData) => {
    await createEvent(eventData);
    setShowCreateModal(false);
    loadEvents();
  };

  const handleEditEvent = async (eventId: string, eventData: CreateEventData) => {
    await updateEvent(eventId, eventData);
    setShowEditModal(false);
    setEventToEdit(null);
    loadEvents();
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    await deleteEvent(eventToDelete);
    setShowDeleteModal(false);
    setEventToDelete(null);
    loadEvents();
  };

  /**===============================
   * Event handlers for students
   ===============================*/
  const handleRegister = async (eventId: string) => {
    await registerForEvent(eventId);
    loadEvents();
  };

  const handleUnregister = async (eventId: string) => {
    await unregisterFromEvent(eventId);
    loadEvents();
  };

  /**===============================
   * Refresh handler
   ===============================*/
  const handleRefresh = () => {
    setSearchTerm('');
    setStatus('all');
    setPage(1);
    loadEvents();
  };

  /**===============================
   * Modal handlers
   ===============================*/
  const handleEditClick = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setEventToEdit(event);
      setShowEditModal(true);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  /**===============================
   * Get current user ID for students
   ===============================*/
  useEffect(() => {
    if (role === 'student') {
      setCurrentUserId((userData.userId as string) || '');
    }
  }, [role, userData]);

  /**=====================================
   * Load events when dependencies change
   =====================================*/
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /**===============================
   * Reset page when filters change
   ===============================*/
  useEffect(() => {
    setPage(1);
  }, [status]);

  /**===============================
   * Pagination handlers
   ===============================*/
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  /**===============================
   * Render pagination component
   ===============================*/
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-2xl">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, totalEvents)}</span> of{' '}
              <span className="font-medium">{totalEvents}</span> results
            </p>
          </div>

          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNum === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Events" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="ITCA"
          subtitle="Events"
          description="Manage and discover campus events"
          actions={
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </button>
              )}
            </div>
          }
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
              placeholder="Search events by title, description, or location..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border-none bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <select
            value={status}
            title="select"
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border-none bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      {/*==================== End of Filters ====================*/}

      {/*==================== Events Content ====================*/}
      <div className="rounded-2xl bg-white">
        {isLoading ? (
          <EventsLoadingSkeleton />
        ) : isError ? (
          <NetworkError
            title="Unable to fetch events"
            description="Please check your internet connection and try again."
            onRetry={handleRefresh}
          />
        ) : events.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {status === 'all'
                ? 'There are no events at the moment. Check back later!'
                : `No ${status} events found. Try adjusting your filters.`}
            </p>
            {role === 'admin' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  role={role}
                  event={event}
                  key={event._id}
                  onEdit={handleEditClick}
                  onRegister={handleRegister}
                  onDelete={handleDeleteClick}
                  currentUserId={currentUserId}
                  onUnregister={handleUnregister}
                />
              ))}
            </div>
          </div>
        )}

        {/*==================== Pagination ====================*/}
        {events.length > 0 && renderPagination()}
        {/*==================== End of Pagination ====================*/}
      </div>
      {/*==================== End of Events Content ====================*/}

      {/*==================== Admin Modals ====================*/}
      {role === 'admin' && (
        <>
          {showCreateModal && (
            <CreateEventModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSave={handleCreateEvent}
            />
          )}

          {showEditModal && eventToEdit && (
            <EditEventModal
              event={eventToEdit}
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEventToEdit(null);
              }}
              onSave={handleEditEvent}
            />
          )}

          {showDeleteModal && (
            <DeleteEventModal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setEventToDelete(null);
              }}
              onConfirm={handleDeleteEvent}
            />
          )}
        </>
      )}
      {/*==================== End of Admin Modals ====================*/}
    </DashboardLayout>
  );
};

export default EventsComponent;
