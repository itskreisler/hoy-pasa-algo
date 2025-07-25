import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEventStore } from '../eventStore';
import { ENDPOINTS } from '../../config/api';

global.fetch = vi.fn();

describe('useEventStore', () => {
  beforeEach(() => {
    useEventStore.setState({
      events: [],
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should fetch events successfully', async () => {
    const events = [{ id: '1', title: 'Test Event' }];
    const response = {
      ok: true,
      json: () => Promise.resolve({ data: events }),
    };
    (fetch as vi.Mock).mockResolvedValue(response);

    await useEventStore.getState().fetchEvents();

    expect(fetch).toHaveBeenCalledWith(ENDPOINTS.events.base);
    expect(useEventStore.getState().events).toEqual(events);
    expect(useEventStore.getState().loading).toBe(false);
  });

  it('should handle fetch events failure', async () => {
    const error = 'Failed to fetch events';
    const response = {
      ok: false,
      json: () => Promise.resolve({ message: error }),
    };
    (fetch as vi.Mock).mockResolvedValue(response);

    await useEventStore.getState().fetchEvents();

    expect(useEventStore.getState().error).toBe(error);
    expect(useEventStore.getState().loading).toBe(false);
  });
});
