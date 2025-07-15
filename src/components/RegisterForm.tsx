import React, { useState } from 'react';
import useUserStore from '../store/userStore';
import Button from './Button';
import Input from './Input';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const login = useUserStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // In a real app, you would register the user here
    login({ email });
    window.location.href = '/';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <Input
          type="password"
          placeholder="******************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="confirm-password">
          Confirm Password
        </label>
        <Input
          type="password"
          placeholder="******************"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">
          Register
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
