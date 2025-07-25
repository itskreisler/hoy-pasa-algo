import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  it('should render all form fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });
});
