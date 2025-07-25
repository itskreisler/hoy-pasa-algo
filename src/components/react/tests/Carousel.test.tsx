import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Carousel from '../Carousel';
import { useEventStore } from '../../../stores/eventStore';

vi.mock('../../../stores/eventStore');

const mockEvents = [
  { id: '1', title: 'Event 1', description: 'Description 1', date: '2024-01-01', status: 'active', visibility: 'public', user_id: '1' },
  { id: '2', title: 'Event 2', description: 'Description 2', date: '2024-01-02', status: 'active', visibility: 'public', user_id: '1' },
];

describe('Carousel', () => {
  it('renders a carousel with given events', () => {
    (useEventStore as any).mockReturnValue({ events: mockEvents });

    render(<Carousel />);

    // The carousel clones items, so we use getAllByText
    expect(screen.getAllByText('Event 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Event 2').length).toBeGreaterThan(0);
  });

  it('renders placeholder phrases when there are no events', () => {
    (useEventStore as any).mockReturnValue({ events: [] });

    render(<Carousel />);

    expect(screen.getAllByText('¡Descubre eventos increíbles!').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tu próxima aventura te espera').length).toBeGreaterThan(0);
  });
});
