import { eventRepository } from './eventRepository';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

export const eventService = {
  getAllEvents: (): Promise<Event[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(eventRepository.getAll());
      }, 500);
    });
  },
  getEventById: (id: number): Promise<Event | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(eventRepository.getById(id));
      }, 500);
    });
  },
  createEvent: (event: Omit<Event, 'id'>): Promise<Event> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(eventRepository.create(event));
      }, 500);
    });
  },
  updateEvent: (id: number, event: Partial<Omit<Event, 'id'>>): Promise<Event | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(eventRepository.update(id, event));
      }, 500);
    });
  },
  deleteEvent: (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        eventRepository.delete(id);
        resolve();
      }, 500);
    });
  },
};
