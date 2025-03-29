import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Calendar, Search, ListFilter } from "lucide-react";
import Link from "next/link";
import DeleteEventModal from "@/components/dashboard/admin/events/delete-event-modal";
import EventsEmptyState from "@/components/dashboard/admin/events/events-empty-state";
import EventsList from "@/components/dashboard/admin/events/events-list";
import EventsLoadingSkeleton from "@/components/dashboard/admin/events/events-loading-skeleton";

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
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

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

  const handleDeleteClick = (eventId: number) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      // In a real app, this would call an API endpoint
      setEvents(events.filter((event) => event.id !== eventToDelete));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  return (
    <DashboardLayout title="Event Management">
      {/*==================== Page content ====================*/}
      <div className="relative">
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-amber-500/5 animate-pulse" />
        <div
          className="absolute top-40 right-20 h-40 w-40 rounded-full bg-blue-700/5 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-10 -left-10 h-80 w-80 rounded-full bg-blue-700/5 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-40 left-20 h-48 w-48 rounded-full bg-amber-500/5 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Main Content */}
        <div className="relative z-10">
          {/*==================== Header Content ====================*/}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-blue-700 mr-2">Event</span>
                  <span className="text-amber-500">Management</span>
                  <span className="ml-3 relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </span>
                </h1>
                <p className="text-gray-600">
                  Create and manage ITCA events, workshops, and seminars with
                  ease
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex space-x-2">
                <Link
                  href="/admin/events/new"
                  className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="mr-2 text-lg font-bold transition-transform duration-300 group-hover:rotate-90">
                    +
                  </span>
                  Create Event
                </Link>
              </div>
            </div>

            {/*==================== Search and Filters ====================*/}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-6">
              <div className="md:col-span-7">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                    placeholder="Search events by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ListFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-8 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer transition-colors"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-center h-full rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <button
                    className={`flex-1 h-full flex items-center justify-center px-3 transition-colors ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <ListFilter className="h-4 w-4" />
                    <span className="ml-1.5 text-sm font-medium">List</span>
                  </button>
                  <div className="h-full w-px bg-gray-200"></div>
                  <button
                    className={`flex-1 h-full flex items-center justify-center px-3 transition-colors ${
                      viewMode === "calendar"
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setViewMode("calendar")}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="ml-1.5 text-sm font-medium">Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*==================== End of Header Content ====================*/}

          {isLoading ? (
            <EventsLoadingSkeleton />
          ) : filteredEvents.length === 0 ? (
            <EventsEmptyState />
          ) : (
            <EventsList
              events={filteredEvents}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>
      </div>
      {/*==================== End of Page content ====================*/}

      {/*==================== Modals ====================*/}
      {showDeleteModal && (
        <DeleteEventModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {/*==================== End of Modals ====================*/}
    </DashboardLayout>
  );
};

export default AdminEventsPage;
