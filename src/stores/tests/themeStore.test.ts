import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../themeStore';
import { act } from '@testing-library/react';

// themeStore is a vanilla store, so we can directly manipulate it
import { themeStore } from '../themeStore';

describe('useThemeStore', () => {
    beforeEach(() => {
        act(() => {
            themeStore.setState({ theme: 'light' });
        });
        document.documentElement.classList.remove('dark');
    });

    it('should toggle theme from light to dark', () => {
        act(() => {
            themeStore.getState().toggleTheme();
        });
        expect(themeStore.getState().theme).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should toggle theme from dark to light', () => {
        act(() => {
            themeStore.setState({ theme: 'dark' });
        });
        act(() => {
            themeStore.getState().toggleTheme();
        });
        expect(themeStore.getState().theme).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
