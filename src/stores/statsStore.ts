import { create } from 'zustand'
import { ENDPOINTS } from '@src/config/api'

interface StatsData {
    total_events: number;
    total_users: number;
}

interface StatsState {
    stats: StatsData | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(ENDPOINTS.users.stats)
            if (!response.ok) {
                throw new Error('Failed to fetch statistics')
            }
            const result = await response.json()
            set({ stats: result.data, loading: false })
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'An unknown error occurred',
                loading: false
            })
        }
    }
}))
