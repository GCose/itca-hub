import { useState, useCallback } from 'react';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://itca-hub-backend.onrender.com';

export const useEvents = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**=============================
   * Generic API call function
   * @param endpoint
   * @param options
   * @returns
   =============================*/
  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const response = await fetch(`${API_BASE_URL}/api/events${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses (like DELETE)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
      }

      return response.json();
    },
    [token]
  ); // Only token as dependency since it's external

  /**================
   * Get all events
   * @param params
   * @returns
   ================*/
  const getAllEvents = useCallback(
    async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);

        const query = queryParams.toString();
        const response = await apiCall(query ? `?${query}` : '');
        return response.data || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  /**====================
   * Create event
   * @param eventData
   * @returns
   ====================*/
  const createEvent = useCallback(
    async (eventData: CreateEventData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall('', {
          method: 'POST',
          body: JSON.stringify(eventData),
        });

        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create event');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  /**====================
   * Update event
   * @param eventId
   * @param eventData
   * @returns
   ====================*/
  const updateEvent = useCallback(
    async (eventId: string, eventData: Partial<CreateEventData>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall(`/${eventId}`, {
          method: 'PUT',
          body: JSON.stringify(eventData),
        });
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update event');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  /**==================
   *  Delete event
   * @param eventId
   ==================*/
  const deleteEvent = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiCall(`/${eventId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  /**=======================
   * Register for event
   * @param eventId
   * @returns
   =======================*/
  const registerForEvent = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall(`/${eventId}/register`, {
          method: 'POST',
        });
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to register for event');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  /**=======================
   * Unregister from event
   * @param eventId
   * @returns
   =======================*/
  const unregisterFromEvent = useCallback(
    async (eventId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall(`/${eventId}/register`, {
          method: 'DELETE',
        });
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unregister from event');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  /**========================
   * Refresh/reload events
   ========================*/
  const refreshEvents = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    refreshEvents,
  };
};
