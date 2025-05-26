import { Calendar } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    status: string;
  }>;
}

const CalendarModal = ({ isOpen, onClose, events }: CalendarModalProps) => {
  if (!isOpen) return null;

  const eventsByDate = events.reduce(
    (acc, event) => {
      const date = new Date(event.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, typeof events>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Events Calendar
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(eventsByDate).map(([date, dateEvents]) => (
              <div key={date} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{date}</h3>
                <div className="space-y-2">
                  {dateEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{event.title}</span>
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                          event.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : event.status === 'ongoing'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
