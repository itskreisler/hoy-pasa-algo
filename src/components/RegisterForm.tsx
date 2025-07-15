import React, { useState } from 'react';
import { userService } from '../services/userService';
import Button from './Button';
import Input from './Input';
import { formsText } from '../constants/forms';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // In a real app, you would register the user here
    userService.login({ email });
    window.location.href = '/';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
          {formsText.emailLabel}
        </label>
        <Input
          type="email"
          placeholder={formsText.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
          {formsText.passwordLabel}
        </label>
        <Input
          type="password"
          placeholder={formsText.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="confirm-password">
          {formsText.confirmPasswordLabel}
        </label>
        <Input
          type="password"
          placeholder={formsText.passwordPlaceholder}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">
          {formsText.registerButton}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
