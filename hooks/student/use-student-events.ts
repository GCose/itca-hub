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
    registrationRequired: apiEvent.registrationRequired,
    isRegistered,
  };
};

export const useStudentEvents = (token: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [initialLoading, setInitialLoading] = useState(true);

  const { isLoading, error, getAllEvents, registerForEvent, unregisterFromEvent, refreshEvents } =
    useEvents(token);

  const fetchEvents = useCallback(async () => {
    try {
      // Step 1: Get current user ID first
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const userProfileData = await userResponse.json();
      const currentUserId = userProfileData.data._id;

      // Step 2: Get events
      const response = await getAllEvents({
        page: 1,
        limit: 50,
        status: status === 'all' ? undefined : status,
        search: searchTerm || undefined,
      });

      // Step 3: Convert events with correct user ID
      const convertedEvents = response.map((apiEvent: ApiEvent) =>
        convertApiEvent(apiEvent, currentUserId)
      );

      setEvents(convertedEvents);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [status, searchTerm, getAllEvents, token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRefresh = () => {
    refreshEvents();
    fetchEvents();
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId);

      // Update local state
      setEvents(
        events.map((event) =>
          event.id === eventId
            ? { ...event, isRegistered: true, registrations: event.registrations + 1 }
            : event
        )
      );

      toast.success('Successfully registered for event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for event. Please try again.');
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterFromEvent(eventId);

      // Update local state
      setEvents(
        events.map((event) =>
          event.id === eventId
            ? { ...event, isRegistered: false, registrations: event.registrations - 1 }
            : event
        )
      );

      toast.success('Successfully unregistered from event!');
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast.error('Failed to unregister from event. Please try again.');
    }
  };

  return {
    events: filteredEvents,
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
  };
};
