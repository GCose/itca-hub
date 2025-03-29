import EventCard from "./event-card";

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

interface EventsListProps {
  events: Event[];
  onDeleteClick: (eventId: number) => void;
}

const EventsList = ({ events, onDeleteClick }: EventsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  );
};

export default EventsList;
