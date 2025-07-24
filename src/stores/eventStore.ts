import { create } from 'zustand'
import { useAuthStore } from './authStore'
import { ENDPOINTS } from '@src/config/api'

export interface Event {
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
    favoriteEvents: Event[];
    loading: boolean;
    myEventsLoading: boolean;
    favoritesLoading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    fetchMyEvents: (token: string) => Promise<void>;
    createEvent: (eventData: Omit<Event, 'id' | 'user_id' | 'status'>, token: string) => Promise<void>;
    updateEvent: (eventId: string, eventData: Partial<Omit<Event, 'id' | 'user_id' | 'status'>>, token: string) => Promise<void>;
    deleteEvent: (eventId: string, token: string) => Promise<void>;
    fetchFavoriteEvents: (token: string) => Promise<void>;
    addFavorite: (eventId: number, token: string) => Promise<void>;
    removeFavorite: (eventId: number, token: string) => Promise<void>;
    clearMyEvents: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    myEvents: [],
    favoriteEvents: [],
    loading: false,
    myEventsLoading: false,
    favoritesLoading: false,
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

            get().fetchMyEvents(token)

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
            throw err
        }
    },

    updateEvent: async (eventId, eventData, token) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${ENDPOINTS.events.base}/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Error updating event')
            }

            get().fetchMyEvents(token)

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
            throw err
        }
    },

    deleteEvent: async (eventId, token) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${ENDPOINTS.events.base}/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Error deleting event')
            }

            get().fetchMyEvents(token)

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
            throw err
        }
    },

    fetchFavoriteEvents: async (token: string) => {
        set({ favoritesLoading: true, error: null })
        try {
            const response = await fetch(ENDPOINTS.events.favorites, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch favorite events')
            }

            const result = await response.json()
            set({ favoriteEvents: result.data || [], favoritesLoading: false })
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', favoritesLoading: false })
        }
    },

    addFavorite: async (eventId, token) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(ENDPOINTS.events.favorites, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ event_id: eventId })
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Error adding favorite')
            }

            get().fetchFavoriteEvents(token)

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
            throw err
        }
    },

    removeFavorite: async (eventId, token) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(`${ENDPOINTS.events.favorites}/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Error removing favorite')
            }

            get().fetchFavoriteEvents(token)

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false })
            throw err
        }
    },

    clearMyEvents: () => {
        set({ myEvents: [], myEventsLoading: false })
    }
}))
