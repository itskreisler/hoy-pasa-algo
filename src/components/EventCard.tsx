import React from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <img src={event.image} alt={`Imagen del evento ${event.title}`} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-400 mb-4">{event.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{event.date}</span>
          <span className="text-sm text-gray-500">{event.category}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
