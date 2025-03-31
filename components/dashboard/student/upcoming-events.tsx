import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface UpcomingEventsProps {
  events: Event[];
  isLoading?: boolean;
}

const UpcomingEvents = ({ events, isLoading = false }: UpcomingEventsProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="border-b border-gray-100 p-4 last:border-b-0"
          >
            <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse mb-3"></div>
            <div className="flex items-center mb-2">
              <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex items-center mb-2">
              <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-1/4 rounded bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-2/5 rounded bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No upcoming events
        </h3>
        <p className="text-gray-500 mb-4">
          You have no events scheduled at this time.
        </p>
        <Link
          href="/student/events"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none  focus:ring-blue-500 focus:ring-offset-2"
        >
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {events.map((event) => (
        <div
          key={event.id}
          className="border-b border-gray-100 p-4 hover:bg-gray-50 last:border-b-0 transition duration-150"
        >
          <Link href={`/student/events/${event.id}`} className="block">
            <h3 className="font-medium text-gray-900 mb-2 pr-6 relative group">
              {event.title}
              <ExternalLink className="h-4 w-4 text-gray-400 absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              <span>{event.location}</span>
            </div>
          </Link>
        </div>
      ))}
      <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
        <Link
          href="/student/events"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all events
        </Link>
      </div>
    </div>
  );
};

export default UpcomingEvents;
