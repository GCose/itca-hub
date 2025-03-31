import { useState, useEffect } from "react";
import { Users, Download, Eye } from "lucide-react";
import { Resource } from "@/hooks/admin/use-resources";

interface ResourceAnalyticsProps {
  resource: Resource;
  onClose: () => void;
}

interface AnalyticsData {
  resourceId: string;
  views: number;
  downloads: number;
  uniqueViewers: number;
  uniqueDownloaders: number;
  viewsByDay: { date: string; count: number }[];
  downloadsByDay: { date: string; count: number }[];
}

const ResourceAnalytics = ({ resource, onClose }: ResourceAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "views" | "downloads"
  >("overview");

  // This would normally fetch from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // For now, we'll use mock data
        // Later, this would be: const response = await fetch(`/api/resources/analytics/${resource.id}`);

        // Mock data
        const mockData: AnalyticsData = {
          resourceId: resource.id,
          views: resource.viewCount,
          downloads: resource.downloads,
          uniqueViewers: Math.floor(resource.viewCount * 0.7),
          uniqueDownloaders: Math.floor(resource.downloads * 0.8),
          viewsByDay: [
            { date: "2025-03-24", count: Math.floor(Math.random() * 20) },
            { date: "2025-03-25", count: Math.floor(Math.random() * 20) },
            { date: "2025-03-26", count: Math.floor(Math.random() * 20) },
            { date: "2025-03-27", count: Math.floor(Math.random() * 20) },
            { date: "2025-03-28", count: Math.floor(Math.random() * 20) },
            { date: "2025-03-29", count: Math.floor(Math.random() * 20) },
            { date: "2025-03-30", count: Math.floor(Math.random() * 20) },
          ],
          downloadsByDay: [
            { date: "2025-03-24", count: Math.floor(Math.random() * 10) },
            { date: "2025-03-25", count: Math.floor(Math.random() * 10) },
            { date: "2025-03-26", count: Math.floor(Math.random() * 10) },
            { date: "2025-03-27", count: Math.floor(Math.random() * 10) },
            { date: "2025-03-28", count: Math.floor(Math.random() * 10) },
            { date: "2025-03-29", count: Math.floor(Math.random() * 10) },
            { date: "2025-03-30", count: Math.floor(Math.random() * 10) },
          ],
        };

        setAnalytics(mockData);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [resource.id, resource.viewCount, resource.downloads]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">
          Failed to load analytics data
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-xl font-bold mb-6 text-gray-900">
        {resource.title} - Analytics
      </h2>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "overview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "views"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("views")}
        >
          Views
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "downloads"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("downloads")}
        >
          Downloads
        </button>
      </div>

      {activeTab === "overview" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.views}
                </p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.downloads}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unique Viewers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.uniqueViewers}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 flex items-center">
              <div className="bg-amber-100 rounded-full p-3 mr-3">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unique Downloaders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.uniqueDownloaders}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3 text-gray-900">
              Engagement Rate
            </h3>
            <div className="bg-gray-100 h-6 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full flex items-center justify-center text-xs text-white font-medium"
                style={{
                  width: `${Math.min(100, (analytics.downloads / analytics.views) * 100 || 0)}%`,
                }}
              >
                {Math.round((analytics.downloads / analytics.views) * 100 || 0)}
                %
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Download to view ratio (engagement rate)
            </p>
          </div>
        </div>
      )}

      {activeTab === "views" && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Daily Views
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg h-64 flex items-end space-x-2">
            {analytics.viewsByDay.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-600 w-full rounded-t-sm"
                  style={{ height: `${(day.count / 20) * 200}px` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {day.date.split("-")[2]}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Last 7 days of views
          </p>
        </div>
      )}

      {activeTab === "downloads" && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Daily Downloads
          </h3>
          <div className="bg-green-50 p-4 rounded-lg h-64 flex items-end space-x-2">
            {analytics.downloadsByDay.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-green-600 w-full rounded-t-sm"
                  style={{ height: `${(day.count / 10) * 200}px` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  {day.date.split("-")[2]}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Last 7 days of downloads
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceAnalytics;
