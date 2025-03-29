import { Calendar, Clock, MapPin, Users, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  registrations: number;
  capacity: number;
  image?: string;
}

interface EventCardProps {
  event: Event;
  onDeleteClick: (eventId: number) => void;
}

const EventCard = ({ event, onDeleteClick }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          bg: "bg-gradient-to-r from-blue-100 to-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: (
            <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-600"></div>
          ),
        };
      case "ongoing":
        return {
          bg: "bg-gradient-to-r from-green-100 to-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: (
            <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full animate-pulse bg-green-600"></div>
          ),
        };
      case "completed":
        return {
          bg: "bg-gradient-to-r from-gray-100 to-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: (
            <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-gray-600"></div>
          ),
        };
      case "cancelled":
        return {
          bg: "bg-gradient-to-r from-red-100 to-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: (
            <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-600"></div>
          ),
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-100 to-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: null,
        };
    }
  };

  const statusBadge = getStatusBadge(event.status);
  const capacityPercentage = (event.registrations / event.capacity) * 100;
  const capacityColorClass =
    capacityPercentage >= 90
      ? "bg-amber-500"
      : capacityPercentage >= 70
        ? "bg-blue-600"
        : "bg-blue-400";

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 
                 ${isHovered ? "shadow-lg ring-1 ring-gray-200" : "shadow-md"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-white"></div>
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          event.status === "upcoming"
            ? "bg-blue-600"
            : event.status === "ongoing"
              ? "bg-green-600"
              : event.status === "completed"
                ? "bg-gray-400"
                : "bg-red-500"
        }`}
      ></div>

      {isHovered && (
        <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-gradient-to-br from-amber-500/10 to-blue-600/5 rounded-full"></div>
      )}

      <div className="relative p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center">
              <span
                className={`relative mr-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}
              >
                {statusBadge.icon}
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>

              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-700 transition-colors">
                <Link href={`/admin/events/${event.id}`}>{event.title}</Link>
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 max-w-3xl">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 text-blue-600" />
                <span>{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 text-blue-600" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4 text-blue-600" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
            <div className="mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-amber-500" />
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {event.registrations}
                </span>
                <span className="mx-1 text-gray-600">/</span>
                <span className="text-gray-600">{event.capacity}</span>
              </div>
            </div>

            <div className="w-36 mb-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${capacityColorClass} transition-all duration-500 ease-out`}
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-gray-500">Registrations</span>
                <span className="font-medium text-gray-900">
                  {Math.round(capacityPercentage)}%
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/admin/events/${event.id}/registrations`}
                className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Users className="mr-1 h-3.5 w-3.5" />
                Registrations
              </Link>

              <Link
                href={`/admin/events/${event.id}/edit`}
                className="flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Edit className="mr-1 h-3.5 w-3.5" />
                Edit
              </Link>

              <button
                className="flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => onDeleteClick(event.id)}
              >
                <Trash className="mr-1 h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
