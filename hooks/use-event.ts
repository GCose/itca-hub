import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import useDebounce from '@/utils/debounce';
import { CreateEventData } from '@/types';
import { useState, useCallback } from 'react';
import { UseEventsProps, GetEventsParams } from '@/types/interfaces/event';

const useEvents = ({ token }: UseEventsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isError, setIsError] = useState(false);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  /**==============================================
   * Get all events with pagination and filtering
   ==============================================*/
  const getAllEvents = useCallback(
    async (params: GetEventsParams = {}) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.get(`${BASE_URL}/events`, {
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.status && params.status !== 'all' && { status: params.status }),
            ...(debouncedSearchQuery.trim() && { search: debouncedSearchQuery.trim() }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          events: data.data || [],
          pagination: data.pagination || {},
          total: data.total || 0,
        };
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to fetch events';

        toast.error('Failed to load events', {
          description: errorMessage,
          duration: 5000,
        });

        return {
          events: [],
          pagination: {},
          total: 0,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [token, debouncedSearchQuery]
  );

  /**===================
   * Create new event 
   ===================*/
  const createEvent = useCallback(
    async (eventData: CreateEventData) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.post(`${BASE_URL}/events`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Event created successfully', {
          description: 'The event has been added to the system',
          duration: 4000,
        });

        return data.data;
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to create event';

        toast.error('Failed to create event', {
          description: errorMessage,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  /**========================
   * Update existing event 
   ========================*/
  const updateEvent = useCallback(
    async (eventId: string, eventData: Partial<CreateEventData>) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.put(`${BASE_URL}/events/${eventId}`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Event updated successfully', {
          description: 'The event has been updated',
          duration: 4000,
        });

        return data.data;
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to update event';

        toast.error('Failed to update event', {
          description: errorMessage,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  /**===============
   * Delete event 
   ===============*/
  const deleteEvent = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setIsError(false);

      try {
        await axios.delete(`${BASE_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Event deleted successfully', {
          description: 'The event has been removed from the system',
          duration: 4000,
        });

        return true;
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to delete event';

        toast.error('Failed to delete event', {
          description: errorMessage,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  /**=====================
   * Register for event 
   =====================*/
  const registerForEvent = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.post(
          `${BASE_URL}/events/${eventId}/register`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success('Successfully registered for event!', {
          description: 'You will receive updates about this event',
          duration: 4000,
        });

        return data.data;
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to register for event';

        toast.error('Failed to register for event', {
          description: errorMessage,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  /**========================
   * Unregister from event 
   ========================*/
  const unregisterFromEvent = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.delete(`${BASE_URL}/events/${eventId}/register`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Successfully unregistered from event!', {
          description: 'You will no longer receive updates about this event',
          duration: 4000,
        });

        return data.data;
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to unregister from event';

        toast.error('Failed to unregister from event', {
          description: errorMessage,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  /**===============================
   * Get single event by ID
   ===============================*/
  const getEventById = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.get(`${BASE_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return data.data;
      } catch (error) {
        setIsError(true);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to fetch event';

        toast.error('Failed to load event', {
          description: errorMessage,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    isError,
    isLoading,
    searchTerm,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    setSearchTerm,
    registerForEvent,
    unregisterFromEvent,
    debouncedSearchQuery,
  };
};

export default useEvents;
