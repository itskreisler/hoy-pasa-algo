import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

interface EventState {
  events: Event[];
  addEvent: (event: Event) => void;
}

const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [
        {
          id: 1,
          title: 'Concierto de Rock',
          description: 'El mejor concierto de rock del año.',
          date: '2024-12-31',
          category: 'musica',
          image: 'https://placehold.co/600x400',
        },
        {
          id: 2,
          title: 'Festival de Comida',
          description: 'Prueba la mejor comida de la ciudad.',
          date: '2024-11-20',
          category: 'comida',
          image: 'https://placehold.co/600x400',
        },
        {
          id: 3,
          title: 'Carrera 5K',
          description: 'Corre por una buena causa.',
          date: '2024-10-15',
          category: 'deportes',
          image: 'https://placehold.co/600x400',
        },
      ],
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
    }),
    {
      name: 'event-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useEventStore;
