import { describe, it, expect } from 'vitest';
import useUserStore from '../store/userStore';
import useEventStore from '../store/eventStore';

describe('Zustand Stores', () => {
  it('should log in a user', () => {
    const user = { email: 'test@example.com' };
    useUserStore.getState().login(user);
    expect(useUserStore.getState().user).toEqual(user);
  });

  it('should log out a user', () => {
    useUserStore.getState().logout();
    expect(useUserStore.getState().user).toBeNull();
  });

  it('should add an event', () => {
    const newEvent = {
      id: 5,
      title: 'Another Event',
      description: 'This is another event.',
      date: '2025-02-01',
      category: 'testing',
      image: 'https://placehold.co/600x400',
    };
    useEventStore.getState().addEvent(newEvent);
    const events = useEventStore.getState().events;
    expect(events).toContainEqual(newEvent);
  });
});
