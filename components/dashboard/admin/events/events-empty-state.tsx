import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

const EventsEmptyState = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/5"></div>
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-blue-700/5"></div>

      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-4 text-blue-600">
          <Calendar className="h-10 w-10" />
        </div>

        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No events found
        </h3>

        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Try adjusting your search or filter criteria, or create a new event
          for the ITCA community.
        </p>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none  focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Link>
      </div>
    </div>
  );
};

export default EventsEmptyState;
