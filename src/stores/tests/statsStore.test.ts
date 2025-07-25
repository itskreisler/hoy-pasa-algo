import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStatsStore } from '../statsStore';
import { ENDPOINTS } from '../../config/api';

global.fetch = vi.fn();

describe('useStatsStore', () => {
  beforeEach(() => {
    useStatsStore.setState({
      stats: {
        total_events: 0,
        users_this_month: 0,
        total_favorites: 0,
      },
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should fetch stats successfully', async () => {
    const stats = {
      total_events: 100,
      users_this_month: 20,
      total_favorites: 50,
    };
    const response = {
      ok: true,
      json: () => Promise.resolve({ data: stats }),
    };
    (fetch as vi.Mock).mockResolvedValue(response);

    await useStatsStore.getState().fetchStats();

    expect(fetch).toHaveBeenCalledWith(ENDPOINTS.users.stats);
    expect(useStatsStore.getState().stats).toEqual(stats);
    expect(useStatsStore.getState().loading).toBe(false);
  });
});
