import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Trash,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

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

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockEvents = [
          {
            id: 1,
            title: "Web Development Workshop",
            description:
              "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
            date: "2023-10-25",
            time: "14:00-16:00",
            location: "Lab 302",
            status: "upcoming" as const,
            registrations: 25,
            capacity: 30,
          },
          {
            id: 2,
            title: "AI & Machine Learning Seminar",
            description:
              "An introduction to artificial intelligence and machine learning concepts.",
            date: "2023-11-10",
            time: "15:00-17:00",
            location: "Virtual (Zoom)",
            status: "upcoming" as const,
            registrations: 45,
            capacity: 100,
          },
          {
            id: 3,
            title: "Database Design Workshop",
            description:
              "Learn best practices for designing efficient and scalable databases.",
            date: "2023-09-15",
            time: "10:00-12:00",
            location: "Room 105",
            status: "completed" as const,
            registrations: 20,
            capacity: 25,
          },
          {
            id: 4,
            title: "Cybersecurity Conference",
            description:
              "A conference focused on the latest trends and challenges in cybersecurity.",
            date: "2023-10-05",
            time: "09:00-17:00",
            location: "Main Auditorium",
            status: "completed" as const,
            registrations: 120,
            capacity: 150,
          },
          {
            id: 5,
            title: "Mobile App Development Bootcamp",
            description:
              "Intensive bootcamp on developing mobile applications for iOS and Android.",
            date: "2023-12-01",
            time: "09:00-16:00",
            location: "Computer Lab 201",
            status: "upcoming" as const,
            registrations: 15,
            capacity: 20,
          },
        ];

        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = status === "all" || event.status === status;

    return matchesSearch && matchesStatus;
  });

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedEvent &&
        !(event.target as HTMLElement).closest(".event-menu")
      ) {
        setSelectedEvent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedEvent]);

  return (
    <DashboardLayout title="Event Management">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Event Management
            </h1>
            <p className="text-gray-600">
              Create and manage ITCA events, workshops, and seminars
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <Link
              href="/admin/events/new"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="flex justify-between">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No events found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {event.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <span>
                        {event.registrations}/{event.capacity} Registered
                      </span>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium mt-2 md:mt-0 ${getStatusBadgeClass(event.status)}`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex space-x-2 relative event-menu">
                  <Link
                    href={`/admin/events/${event.id}/registrations`}
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Users className="mr-1.5 h-4 w-4" />
                    Registrations
                  </Link>

                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="mr-1.5 h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                    onClick={() => console.log(`Delete event ${event.id}`)}
                  >
                    <Trash className="mr-1.5 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminEventsPage;
