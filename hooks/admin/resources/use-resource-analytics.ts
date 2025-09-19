import { useState, useCallback } from 'react';
import { BASE_URL } from '@/utils/url';

interface UseResourceAnalyticsProps {
  token?: string;
}

const useResourceAnalytics = (props?: UseResourceAnalyticsProps) => {
  const [isTracking, setIsTracking] = useState(false);

  /**===============================
   * Track a resource view event.
   ===============================*/
  const trackResourceView = useCallback(
    async (resourceId: string, token?: string) => {
      if (isTracking) return;

      const authToken = token || props?.token;
      if (!authToken) {
        console.warn('No authentication token available for tracking view');
        return;
      }

      setIsTracking(true);
      try {
        const response = await fetch(`${BASE_URL}/resources/analytics/track-view/${resourceId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to track view: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to track resource view:', error);
      } finally {
        setIsTracking(false);
      }
    },
    [isTracking, props?.token]
  );

  /**====================================
   * Track a resource download event.
   =====================================*/
  const trackResourceDownload = useCallback(
    async (resourceId: string, token?: string) => {
      if (isTracking) return;

      const authToken = token || props?.token;
      if (!authToken) {
        console.warn('No authentication token available for tracking download');
        return;
      }

      setIsTracking(true);
      try {
        const response = await fetch(
          `${BASE_URL}/resources/analytics/track-download/${resourceId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to track download: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to track resource download:', error);
      } finally {
        setIsTracking(false);
      }
    },
    [isTracking, props?.token]
  );

  /**==========================================================
   * Get analytics data for a specific resource (admin-only).
   ==========================================================*/
  const getResourceAnalytics = useCallback(
    async (resourceId: string, token?: string) => {
      const authToken = token || props?.token;
      if (!authToken) {
        throw new Error('No authentication token available for getting analytics');
      }

      try {
        const response = await fetch(`${BASE_URL}/resources/analytics/${resourceId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to get analytics: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Failed to get resource analytics:', error);
        throw error;
      }
    },
    [props?.token]
  );

  return {
    trackResourceView,
    trackResourceDownload,
    getResourceAnalytics,
    isTracking,
  };
};

export default useResourceAnalytics;
