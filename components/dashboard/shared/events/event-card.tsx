import { useState } from 'react';
import {
  Edit,
  Clock,
  Users,
  MapPin,
  Trash2,
  XCircle,
  UserPlus,
  Calendar,
  UserMinus,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { EventCardProps } from '@/types/interfaces/event';

const EventCard = ({
  role,
  event,
  onEdit,
  onDelete,
  onRegister,
  onUnregister,
  currentUserId,
}: EventCardProps) => {
  const [isRegistering, setIsRegistering] = useState(false);

  /**===============================
   * Format date for display
   ===============================*/
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**===============================
   * Format time for display
   ===============================*/
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return timeString;
    }
  };

  /**===============================
   * Get status color and text
   ===============================*/
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'Upcoming',
        };
      case 'ongoing':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Ongoing',
        };
      case 'completed':
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Completed',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Unknown',
        };
    }
  };

  /**===============================
   * Check if user is registered
   ===============================*/
  const isRegistered =
    role === 'student' && currentUserId
      ? event.attendees.some((attendee) => attendee._id === currentUserId)
      : false;

  /**===============================
   * Handle registration
   ===============================*/
  const handleRegistration = async () => {
    if (!onRegister || !onUnregister) return;

    setIsRegistering(true);
    try {
      if (isRegistered) {
        await onUnregister(event._id);
      } else {
        await onRegister(event._id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error('Registration Error', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  /**====================================
   * Check if registration is available
   ====================================*/
  const canRegister =
    event.registrationRequired &&
    event.status === 'upcoming' &&
    event.attendees.length < event.capacity;

  const isFull = event.attendees.length >= event.capacity;
  const statusConfig = getStatusConfig(event.status);

  return (
    <div className="group relative overflow-hidden rounded-xl border-none bg-white">
      {/*==================== Event Image ====================*/}
      {event.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {/*==================== End of Event Image ====================*/}

      {/*==================== Event Content ====================*/}
      <div className="p-6">
        {/*==================== Event Header ====================*/}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}
            >
              {statusConfig.text}
            </span>
          </div>

          {/*==================== Admin Actions ====================*/}
          {role === 'admin' && (
            <div className="ml-3 flex space-x-1">
              <button
                onClick={() => onEdit?.(event._id)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Edit event"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete?.(event._id)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete event"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          {/*==================== End of Admin Actions ====================*/}
        </div>
        {/*==================== End of Event Header ====================*/}

        {/*==================== Event Description ====================*/}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{event.description}</p>
        {/*==================== End of Event Description ====================*/}

        {/*==================== Event Details ====================*/}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-blue-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-blue-500" />
            <span>
              {event.attendees.length} / {event.capacity} registered
            </span>
          </div>
        </div>
        {/*==================== End of Event Details ====================*/}

        {/*==================== Student Registration Section ====================*/}
        {role === 'student' && event.registrationRequired && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {isRegistered ? (
              <div className="space-y-3">
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  You are registered for this event
                </div>
                <button
                  onClick={handleRegistration}
                  disabled={isRegistering}
                  className="w-full inline-flex justify-center items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Unregistering...
                    </>
                  ) : (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unregister
                    </>
                  )}
                </button>
              </div>
            ) : canRegister ? (
              <button
                onClick={handleRegistration}
                disabled={isRegistering}
                className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isRegistering ? (
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
                <XCircle className="h-4 w-4 mr-2" />
                {isFull
                  ? 'Event Full'
                  : event.status === 'completed'
                    ? 'Event Completed'
                    : 'Registration Closed'}
              </button>
            )}
          </div>
        )}

        {/*==================== No Registration Required ====================*/}
        {role === 'student' && !event.registrationRequired && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-center text-sm text-green-600 font-medium">
              <CheckCircle className="inline h-4 w-4 mr-1" />
              No registration required - Join anytime!
            </div>
          </div>
        )}
        {/*==================== End of No Registration Required ====================*/}
      </div>
      {/*==================== End of Event Content ====================*/}
    </div>
  );
};

export default EventCard;
