import { Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
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
}

interface EventCardProps {
  event: Event;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Show fallback if no image, image failed, or image hasn't loaded yet
  const showFallback = !event.image || imageError || !imageLoaded;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/50 transition-all duration-300">
      {/*==================== Event Image ====================*/}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-amber-50">
        {event.image && !imageError && (
          <Image
            fill
            src={event.image}
            alt={event.title}
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            unoptimized={
              event.image.includes('storage.googleapis.com') || event.image.includes('onrender.com')
            }
          />
        )}

        {/* Fallback Icon - Always render but conditionally show */}
        <div
          className={`absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-amber-100 transition-opacity duration-300 ${
            showFallback ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Calendar className="h-16 w-16 text-blue-400" />
        </div>

        {/*==================== Status Badge ====================*/}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(event.status)}`}
          >
            {event.status}
          </span>
        </div>
        {/*==================== End of Status Badge ====================*/}

        {/*==================== Action Buttons ====================*/}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(event.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white hover:text-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/*==================== End of Action Buttons ====================*/}
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
            </span>
          </div>
        </div>
        {/*==================== End of Event Details ====================*/}

        {/*==================== Progress Bar ====================*/}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 text-right">
          {Math.round((event.registrations / event.capacity) * 100)}% filled
        </div>
        {/*==================== End of Progress Bar ====================*/}
      </div>
      {/*==================== End of Event Content ====================*/}
    </div>
  );
};

export default EventCard;
