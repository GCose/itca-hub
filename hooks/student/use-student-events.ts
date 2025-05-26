import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useEvents } from '@/hooks/admin/events/use-events';

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
  registrationRequired: boolean;
  isRegistered: boolean;
  isRegistering?: boolean;
  isUnregistering?: boolean;
}

const convertApiEvent = (apiEvent: ApiEvent, currentUserId: string): Event => {
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

  const isRegistered = apiEvent.attendees.some((attendee) => attendee._id === currentUserId);

  // Auto-determine status based on current date
  const eventDate = new Date(apiEvent.date);
  const now = new Date();
  let actualStatus = apiEvent.status;

  if (eventDate < now && apiEvent.status !== 'completed') {
    actualStatus = 'completed';
  }

  return {
    id: apiEvent._id,
    title: apiEvent.title,
    description: apiEvent.description,
    date: apiEvent.date,
    time: formatTime(apiEvent.time),
    location: apiEvent.location,
    status: actualStatus,
    registrations: apiEvent.attendees.length,
    capacity: apiEvent.capacity,
    image: apiEvent.imageUrl,
    registrationRequired: apiEvent.registrationRequired,
    isRegistered,
  };
};

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useStudentEvents = (token: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term - ONLY make API call after 500ms of no typing
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isLoading, error, getAllEvents, registerForEvent, unregisterFromEvent, refreshEvents } =
    useEvents(token);

  const fetchEvents = useCallback(async () => {
    try {
      // Show search loading when search term is being debounced
      if (searchTerm !== debouncedSearchTerm) {
        setIsSearching(true);
        return;
      }

      setIsSearching(false);

      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const userProfileData = await userResponse.json();
      const currentUserId = userProfileData.data._id;

      const response = await getAllEvents({
        page: currentPage,
        limit: 9,
        status: status === 'all' ? undefined : status,
        search: debouncedSearchTerm || undefined,
      });

      setTotalPages(response.pagination.totalPages);
      setHasNext(response.pagination.hasNext);
      setHasPrev(response.pagination.hasPrev);

      const convertedEvents = response.data.map((apiEvent: ApiEvent) =>
        convertApiEvent(apiEvent, currentUserId)
      );

      setEvents(convertedEvents);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setInitialLoading(false);
      setIsSearching(false);
    }
  }, [status, debouncedSearchTerm, currentPage, getAllEvents, token, searchTerm]);
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [status, debouncedSearchTerm]);

  // Fetch events when debounced search term or other dependencies change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Show search loading when user is typing
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm && searchTerm.length > 0) {
      setIsSearching(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  const handleRefresh = useCallback(() => {
    refreshEvents();
    fetchEvents();
  }, [refreshEvents, fetchEvents]);

  const filteredEvents = events.filter((event) => {
    const matchesStatus =
      status === 'all' ||
      status === 'completed' ||
      (status === 'upcoming' && event.status !== 'completed') ||
      (status === 'ongoing' && event.status === 'ongoing');

    return matchesStatus;
  });

  const handleRegister = useCallback(
    async (eventId: string) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, isRegistering: true } : event
        )
      );

      try {
        await registerForEvent(eventId);

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  isRegistered: true,
                  registrations: event.registrations + 1,
                  isRegistering: false,
                }
              : event
          )
        );

        toast.success('Successfully registered for event!');
      } catch (error) {
        console.error('Error registering for event:', error);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, isRegistering: false } : event
          )
        );
        toast.error('Failed to register for event. Please try again.');
      }
    },
    [registerForEvent]
  );

  const handleUnregister = useCallback(
    async (eventId: string) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, isUnregistering: true } : event
        )
      );

      try {
        await unregisterFromEvent(eventId);

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  isRegistered: false,
                  registrations: event.registrations - 1,
                  isUnregistering: false,
                }
              : event
          )
        );

        toast.success('Successfully unregistered from event!');
      } catch (error) {
        console.error('Error unregistering from event:', error);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, isUnregistering: false } : event
          )
        );
        toast.error('Failed to unregister from event. Please try again.');
      }
    },
    [unregisterFromEvent]
  );

  const goToNextPage = useCallback(() => {
    if (hasNext) setCurrentPage((prev) => prev + 1);
  }, [hasNext]);

  const goToPrevPage = useCallback(() => {
    if (hasPrev) setCurrentPage((prev) => prev - 1);
  }, [hasPrev]);

  return {
    events: filteredEvents,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    viewMode,
    setViewMode,
    isLoading: isLoading || isSearching,
    error,
    initialLoading,
    handleRefresh,
    handleRegister,
    handleUnregister,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    goToNextPage,
    goToPrevPage,
  };
};
