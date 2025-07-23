import { create } from 'zustand'
import { useAuthStore } from './authStore'
import { ENDPOINTS } from '@src/config/api'

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    status: string;
    visibility: string;
    category_id?: string;
    city?: string;
    country?: string;
    image_url?: string;
    link?: string;
    user_id: string;
}

interface EventState {
    events: Event[];
    myEvents: Event[];
    loading: boolean;
    myEventsLoading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    fetchMyEvents: (token: string) => Promise<void>;
    createEvent: (eventData: Omit<Event, 'id' | 'user_id' | 'status'>, token: string) => Promise<void>;
    clearMyEvents: () => void;
}

export const useEventStore = create<EventState>((set) => ({
    events: [],
    myEvents: [],
    loading: false,
    myEventsLoading: false,
    error: null,

    fetchEvents: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(ENDPOINTS.events.base)
            if (!response.ok) {
                throw new Error('Failed to fetch events')
            }
            const result = await response.json()
            set({ events: result.data || [], loading: false })
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
        }
    },

    fetchMyEvents: async (token: string) => {
        set({ myEventsLoading: true, error: null })
        try {
            const response = await fetch(ENDPOINTS.events.myEvents, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch my events')
            }

            const result = await response.json()
            set({ myEvents: result.data || [], myEventsLoading: false })
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'An unknown error occurred',
                myEventsLoading: false
            })
        }
    },

    createEvent: async (eventData, token) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(ENDPOINTS.events.base, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...eventData, user_id: useAuthStore.getState().user?.id })
            })
            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Error creating event')
            }
            // After creating an event, fetch all events again to update the list
            const fetchResponse = await fetch(ENDPOINTS.events.base)
            const fetchResult = await fetchResponse.json()
            set({ events: fetchResult.data || [], loading: false })

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
            throw err
        }
    },

    clearMyEvents: () => {
        set({ myEvents: [], myEventsLoading: false })
    }
}))
