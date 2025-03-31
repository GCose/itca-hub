import { useState } from "react";

const useResourceAnalytics = () => {
  const [isTracking, setIsTracking] = useState(false);

  // Track a resource view
  const trackResourceView = async (resourceId: string) => {
    if (isTracking) return;

    setIsTracking(true);
    try {
      // In a real implementation, this would be an API call to the backend
      // await fetch('/api/resources/track-view', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ resourceId })
      // });

      // For now, we'll just update localStorage
      const viewsData = localStorage.getItem("resourceViews") || "{}";
      const views = JSON.parse(viewsData);
      views[resourceId] = (views[resourceId] || 0) + 1;
      localStorage.setItem("resourceViews", JSON.stringify(views));

      console.log(`Tracked view for resource ${resourceId}`);
    } catch (error) {
      console.error("Failed to track resource view:", error);
    } finally {
      setIsTracking(false);
    }
  };

  // Track a resource download
  const trackResourceDownload = async (resourceId: string) => {
    if (isTracking) return;

    setIsTracking(true);
    try {
      // In a real implementation, this would be an API call to the backend
      // await fetch('/api/resources/track-download', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ resourceId })
      // });

      // For now, we'll just update localStorage
      const downloadsData = localStorage.getItem("resourceDownloads") || "{}";
      const downloads = JSON.parse(downloadsData);
      downloads[resourceId] = (downloads[resourceId] || 0) + 1;
      localStorage.setItem("resourceDownloads", JSON.stringify(downloads));

      console.log(`Tracked download for resource ${resourceId}`);
    } catch (error) {
      console.error("Failed to track resource download:", error);
    } finally {
      setIsTracking(false);
    }
  };

  return { trackResourceView, trackResourceDownload };
};

export default useResourceAnalytics;
