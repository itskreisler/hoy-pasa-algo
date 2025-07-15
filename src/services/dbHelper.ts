import { getEvents, addEvent } from './eventRepository';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

export const getAllEvents = (): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getEvents());
    }, 500);
  });
};

export const createEvent = (event: Event): Promise<Event> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      addEvent(event);
      resolve(event);
    }, 500);
  });
};
