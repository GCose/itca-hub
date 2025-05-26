import { Calendar, MapPin, Users, UserCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
  capacity: number;
  image?: string;
  registrationRequired: boolean;
  isRegistered: boolean;
}

interface StudentEventCardProps {
  event: Event;
  onRegister: (eventId: string) => Promise<void>;
  onUnregister: (eventId: string) => Promise<void>;
}

const StudentEventCard = ({ event, onRegister, onUnregister }: StudentEventCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      if (event.isRegistered) {
        await onUnregister(event.id);
      } else {
        await onRegister(event.id);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canRegister = event.status === 'upcoming' && event.registrations < event.capacity;
  const isFull = event.registrations >= event.capacity;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/50 transition-all duration-300">
      {/*==================== Event Image ====================*/}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-amber-50">
        {event.image && !imageError ? (
          <Image
            fill
            src={event.image}
            alt={event.title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized={
              event.image.includes('storage.googleapis.com') || event.image.includes('onrender.com')
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-amber-100">
            <Calendar className="h-16 w-16 text-blue-400" />
          </div>
        )}

        {/*==================== Status Badge ====================*/}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(event.status)}`}
          >
            {event.status}
          </span>
        </div>
        {/*==================== End of Status Badge ====================*/}

        {/*==================== Registration Status ====================*/}
        {event.isRegistered && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              <UserCheck className="h-3 w-3 mr-1" />
              Registered
            </span>
          </div>
        )}
        {/*==================== End of Registration Status ====================*/}
      </div>
      {/*==================== End of Event Image ====================*/}

      {/*==================== Event Content ====================*/}
      <div className="p-5">
        {/*==================== Event Title ====================*/}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
        {/*==================== End of Event Title ====================*/}

        {/*==================== Event Description ====================*/}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        {/*==================== End of Event Description ====================*/}

        {/*==================== Event Details ====================*/}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>
              {formatDate(event.date)} • {event.time}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-amber-500" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 text-green-500" />
            <span>
              {event.registrations}/{event.capacity} registered
              {isFull && <span className="ml-1 text-red-500">(Full)</span>}
            </span>
          </div>
        </div>
        {/*==================== End of Event Details ====================*/}

        {/*==================== Progress Bar ====================*/}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isFull
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
          />
        </div>
        <div className="mb-4 text-xs text-gray-500 text-right">
          {Math.round((event.registrations / event.capacity) * 100)}% filled
        </div>
        {/*==================== End of Progress Bar ====================*/}

        {/*==================== Registration Button ====================*/}
        {event.registrationRequired && (
          <div className="pt-2 border-t border-gray-100">
            {event.status === 'completed' ? (
              <button
                disabled
                className="w-full inline-flex justify-center items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
              >
                Event Completed
              </button>
            ) : event.isRegistered ? (
              <button
                onClick={handleRegistration}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Unregistering...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Unregister
                  </>
                )}
              </button>
            ) : canRegister && !isFull ? (
              <button
                onClick={handleRegistration}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full inline-flex justify-center items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
              >
                {isFull ? 'Event Full' : 'Registration Closed'}
              </button>
            )}
          </div>
        )}
        {!event.registrationRequired && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-center text-sm text-green-600 font-medium">
              No registration required - Join anytime!
            </div>
          </div>
        )}
        {/*==================== End of Registration Button ====================*/}
      </div>
      {/*==================== End of Event Content ====================*/}
    </div>
  );
};

export default StudentEventCard;
