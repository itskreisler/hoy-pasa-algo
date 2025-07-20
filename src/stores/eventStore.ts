import { create } from 'zustand';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    visibility: string;
    user_id: string;
}

interface EventState {
    events: Event[];
    loading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    createEvent: (eventData: Omit<Event, 'id' | 'user_id'>, token: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
    events: [],
    loading: false,
    error: null,
    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/v1/events/');
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const result = await response.json();
            set({ events: result.data || [], loading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
        }
    },
    createEvent: async (eventData, token) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/v1/events/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Error creating event');
            }
            // After creating an event, fetch all events again to update the list
            const fetchResponse = await fetch('http://localhost:5000/api/v1/events/');
            const fetchResult = await fetchResponse.json();
            set({ events: fetchResult.data || [], loading: false });

        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
            throw err;
        }
    },
}));
