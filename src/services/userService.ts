import { userRepository } from './userRepository';

interface User {
  email: string;
}

export const userService = {
  getUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userRepository.get());
      }, 500);
    });
  },
  login: (user: User): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        userRepository.login(user);
        resolve();
      }, 500);
    });
  },
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        userRepository.logout();
        resolve();
      }, 500);
    });
  },
};
