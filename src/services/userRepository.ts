import useUserStore from '../store/userStore';

interface User {
  email: string;
}

export const userRepository = {
  get: (): User | null => {
    return useUserStore.getState().user;
  },
  login: (user: User): void => {
    useUserStore.getState().login(user);
  },
  logout: (): void => {
    useUserStore.getState().logout();
  },
};
