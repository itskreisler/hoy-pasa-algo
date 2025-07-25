import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from '../ThemeToggle';
import { useThemeStore } from '../../../stores/themeStore';

// Mock the store
vi.mock('../../../stores/themeStore');

describe('ThemeToggle', () => {
  it('should call toggleTheme when clicked', () => {
    const toggleTheme = vi.fn();
    (useThemeStore as any).mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
