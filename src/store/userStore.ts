import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
}

interface UserState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useUserStore;
