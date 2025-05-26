import { Calendar, Plus } from 'lucide-react';

interface EventsEmptyStateProps {
  onCreateEvent: () => void;
}

const EventsEmptyState = ({ onCreateEvent }: EventsEmptyStateProps) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-8 text-center">
      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-4 text-blue-600">
          <Calendar className="h-10 w-10" />
        </div>

        <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>

        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Try adjusting your search or filter criteria, or create a new event for the ITCA
          community.
        </p>

        <button
          onClick={onCreateEvent}
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </button>
      </div>
    </div>
  );
};

export default EventsEmptyState;
