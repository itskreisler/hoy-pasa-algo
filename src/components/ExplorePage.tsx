import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import EventCard from './EventCard';
import Input from './Input';
import { explorePageText } from '../constants/explorePage';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

const ExplorePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await eventService.getAllEvents();
      setEvents(allEvents);
      setFilteredEvents(allEvents);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const categories = [...new Set(events.map((event) => event.category))];

  return (
    <div>
      <div className="my-8">
        <Input
          type="text"
          placeholder={explorePageText.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`py-2 px-4 rounded ${
            selectedCategory === null ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          {explorePageText.allButton}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-4 rounded ${
              selectedCategory === category ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
