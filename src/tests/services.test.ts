import { describe, it, expect } from 'vitest';
import { getAllEvents, createEvent } from '../services/dbHelper';
import useEventStore from '../store/eventStore';

describe('Services', () => {
  it('should get all events', async () => {
    const events = await getAllEvents();
    expect(events).toEqual(useEventStore.getState().events);
  });

  it('should create an event', async () => {
    const newEvent = {
      id: 4,
      title: 'New Event',
      description: 'This is a new event.',
      date: '2025-01-01',
      category: 'testing',
      image: 'https://placehold.co/600x400',
    };
    await createEvent(newEvent);
    const events = useEventStore.getState().events;
    expect(events).toContainEqual(newEvent);
  });
});
