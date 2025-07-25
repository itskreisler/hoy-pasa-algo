import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegisterForm from '../RegisterForm';

describe('RegisterForm', () => {
  it('should render all form fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/Email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña *')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Contraseña \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Género/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });
});
