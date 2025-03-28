import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  FileText,
  Upload,
  Download,
  Clock,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "user" | "event" | "resource" | "login";
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockActivities = [
          {
            id: "1",
            type: "user" as const,
            action: "registered",
            user: "Jane Smith",
            timestamp: "2023-10-15T14:30:00Z",
          },
          {
            id: "2",
            type: "resource" as const,
            action: "uploaded",
            user: "Admin",
            timestamp: "2023-10-15T12:15:00Z",
            details: "Web Development Lecture Notes",
          },
          {
            id: "3",
            type: "event" as const,
            action: "created",
            user: "Admin",
            timestamp: "2023-10-14T16:45:00Z",
            details: "Hackathon 2023",
          },
          {
            id: "4",
            type: "resource" as const,
            action: "downloaded",
            user: "John Doe",
            timestamp: "2023-10-14T10:20:00Z",
            details: "Python Programming Guide",
          },
          {
            id: "5",
            type: "login" as const,
            action: "logged in",
            user: "Robert Johnson",
            timestamp: "2023-10-14T09:05:00Z",
          },
        ];

        setActivities(mockActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4 text-blue-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case "resource":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "login":
        return <Clock className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "uploaded":
        return <Upload className="h-3 w-3 text-green-500" />;
      case "downloaded":
        return <Download className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  // Function to format timestamp as relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-4 flex items-start">
            <div className="mr-3 h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="mb-1 h-4 w-3/4 rounded bg-gray-200 animate-pulse"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white">
      <div className="p-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="mb-4 border-b border-gray-100 pb-4 last:mb-0 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  {activity.details && (
                    <>
                      <span className="inline-flex items-center">
                        {getActionIcon(activity.action)}
                        <span className="ml-1 font-medium">
                          {activity.details}
                        </span>
                      </span>
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center">
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all activity
        </a>
      </div>
    </div>
  );
};

export default RecentActivity;
