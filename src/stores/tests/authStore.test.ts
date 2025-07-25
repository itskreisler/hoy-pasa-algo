import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { ENDPOINTS } from '../../config/api';

// Mock fetch
global.fetch = vi.fn();

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should handle login successfully', async () => {
    const token = 'test-token';
    const user = { id: '1', email: 'test@example.com', username: 'test', full_name: 'Test User', rol: 'user' };
    const response = {
      ok: true,
      json: () => Promise.resolve({ data: { token, user } }),
    };
    (fetch as vi.Mock).mockResolvedValue(response);

    await useAuthStore.getState().login('test@example.com', 'password');

    expect(fetch).toHaveBeenCalledWith(ENDPOINTS.auth.login, expect.any(Object));
    expect(useAuthStore.getState().token).toBe(token);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBe(null);
  });

  it('should handle login failure', async () => {
    const error = 'Invalid credentials';
    const response = {
      ok: false,
      json: () => Promise.resolve({ message: error }),
    };
    (fetch as vi.Mock).mockResolvedValue(response);

    await expect(useAuthStore.getState().login('test@example.com', 'wrong-password')).rejects.toThrow(error);

    expect(fetch).toHaveBeenCalledWith(ENDPOINTS.auth.login, expect.any(Object));
    expect(useAuthStore.getState().token).toBe(null);
    expect(useAuthStore.getState().user).toBe(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().error).toBe(error);
  });

  it('should handle registration successfully', async () => {
    const token = 'new-token';
    const user = { id: '2', email: 'new@example.com', username: 'newuser', full_name: 'New User', rol: 'user' };
    const response = {
      ok: true,
      json: () => Promise.resolve({ data: { token, user } }),
    };
    (fetch as vi.Mock).mockResolvedValue(response);

    await useAuthStore.getState().register({ email: 'new@example.com', password: 'password' });

    expect(fetch).toHaveBeenCalledWith(ENDPOINTS.auth.register, expect.any(Object));
    expect(useAuthStore.getState().token).toBe(token);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    useAuthStore.setState({ token: 'some-token', user: { id: '1', email: 'test@example.com' } });
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().token).toBe(null);
    expect(useAuthStore.getState().user).toBe(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
