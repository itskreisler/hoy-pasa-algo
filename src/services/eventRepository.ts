import useEventStore from '../store/eventStore';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

export const getEvents = (): Event[] => {
  return useEventStore.getState().events;
};

export const addEvent = (event: Event): void => {
  useEventStore.getState().addEvent(event);
};
