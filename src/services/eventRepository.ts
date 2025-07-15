import useEventStore from '../store/eventStore';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

export const eventRepository = {
  getAll: (): Event[] => {
    return useEventStore.getState().events;
  },
  getById: (id: number): Event | undefined => {
    return useEventStore.getState().events.find((event) => event.id === id);
  },
  create: (event: Omit<Event, 'id'>): Event => {
    const newEvent = { ...event, id: Date.now() };
    useEventStore.getState().addEvent(newEvent);
    return newEvent;
  },
  update: (id: number, event: Partial<Omit<Event, 'id'>>): Event | undefined => {
    const events = useEventStore.getState().events;
    const eventIndex = events.findIndex((event) => event.id === id);
    if (eventIndex === -1) {
      return undefined;
    }
    const updatedEvent = { ...events[eventIndex], ...event };
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = updatedEvent;
    useEventStore.setState({ events: updatedEvents });
    return updatedEvent;
  },
  delete: (id: number): void => {
    const events = useEventStore.getState().events;
    const updatedEvents = events.filter((event) => event.id !== id);
    useEventStore.setState({ events: updatedEvents });
  },
};
